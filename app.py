import os
import re
import json
import urllib.parse
from flask import Flask, request, jsonify, Response, stream_with_context, send_from_directory, make_response
from flask_cors import CORS
import requests
from concurrent.futures import ThreadPoolExecutor

from providers import (
    RadioProvider,
    TVProvider,
    YouTubeProvider,
    UniversalProvider,
    PodcastProvider,
    AudiobookProvider,
    LyricsProvider,
    MetadataProvider,
    SubtitleProvider,
)
from epg import epg_service

# Base directory resolution (safe for both Local and Vercel)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE_DIR, "dist")

app = Flask(
    __name__,
    static_folder=os.path.join(DIST_DIR, "assets") if os.path.exists(DIST_DIR) else None,
    static_url_path="/assets",
)

# 50MB request cap for Vercel
app.config["MAX_CONTENT_LENGTH"] = 50 * 1024 * 1024

# Ensure natural UTF-8 in all JSON responses (No escaped unicode like \u092e...)
app.json.ensure_ascii = False
app.config["JSON_AS_ASCII"] = False

# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "*"}})

# Instantiate providers
radio_prov = RadioProvider()
tv_prov = TVProvider()
yt_prov = YouTubeProvider()
univ_prov = UniversalProvider()
podcast_prov = PodcastProvider()
audiobook_prov = AudiobookProvider()
lyrics_prov = LyricsProvider()
meta_prov = MetadataProvider()
sub_prov = SubtitleProvider()


# --- FRONTEND APP ROUTES (SPA DEEP LINKING) ---
@app.route("/")
@app.route("/home")
@app.route("/radio")
@app.route("/tv")
@app.route("/youtube")
@app.route("/podcasts")
@app.route("/audiobooks")
@app.route("/universal")
@app.route("/api-hub")
@app.route("/favorites")
@app.route("/settings")
def frontend_routes():
    index_file = os.path.join(DIST_DIR, "index.html")
    if os.path.exists(index_file):
        return send_from_directory(DIST_DIR, "index.html")
    return "Frontend bundle not found. Please run 'npm run build' to generate dist/.", 500


@app.route("/site.webmanifest")
def serve_site_webmanifest():
    folder = DIST_DIR if os.path.exists(os.path.join(DIST_DIR, "site.webmanifest")) else os.path.join(BASE_DIR, "public")
    return send_from_directory(folder, "site.webmanifest", mimetype="application/manifest+json")


@app.route("/favicon.svg")
def serve_favicon_svg():
    folder = DIST_DIR if os.path.exists(os.path.join(DIST_DIR, "favicon.svg")) else os.path.join(BASE_DIR, "public")
    resp = make_response(send_from_directory(folder, "favicon.svg", mimetype="image/svg+xml"))
    resp.headers["Cache-Control"] = "no-cache, must-revalidate"
    return resp


@app.route("/favicon.ico")
def serve_favicon_ico():
    folder = DIST_DIR if os.path.exists(os.path.join(DIST_DIR, "favicon.ico")) else os.path.join(BASE_DIR, "public")
    resp = make_response(send_from_directory(folder, "favicon.ico", mimetype="image/x-icon"))
    resp.headers["Cache-Control"] = "no-cache, must-revalidate"
    return resp


@app.route("/<path:path>")
def static_proxy(path):
    if path.startswith("api/") or path.startswith("stream/"):
        return jsonify({"error": "Not Found"}), 404
    if os.path.exists(os.path.join(DIST_DIR, path)):
        return send_from_directory(DIST_DIR, path)
    if os.path.exists(os.path.join(DIST_DIR, "index.html")):
        return send_from_directory(DIST_DIR, "index.html")
    return "Not Found", 404



# =========================================================================
# UNIVERSAL ALL-IN-ONE API & REST SUITE
# =========================================================================

@app.route("/api", methods=["GET"])
@app.route("/api/docs", methods=["GET"])
@app.route("/api/info", methods=["GET"])
def api_docs():
    """
    Returns full machine-readable and developer-friendly documentation
    for all available REST and Universal API endpoints in MediaHub.
    """
    base_url = request.host_url.rstrip("/")
    docs = {
        "title": "MediaHub Universal Open Media API",
        "description": "Unified high-performance media aggregation and streaming API for YouTube, Live Radio, Live TV, Podcasts, Audiobooks, Lyrics, and HLS/Stream Proxying.",
        "base_url": base_url,
        "universal_endpoint": {
            "path": "/api/universal",
            "aliases": ["/api/all", "/api/search"],
            "description": "Single-call unified search across ALL 6 media sources simultaneously (YouTube, Radio, TV, Podcasts, Audiobooks, Lyrics).",
            "parameters": {
                "q": "Search keyword query (e.g. 'lofi', 'arijit singh', 'sherlock', 'news')",
                "sources": "Comma-separated list: youtube,radio,tv,podcasts,audiobooks or 'all' (default: 'all')",
                "country": "Country code: 'IN', 'US', 'UK', 'CA', 'DE', 'FR', 'GLOBAL' (default: 'IN')",
                "limit": "Max items per media source (default: 8, max: 25)",
                "url": "Optional: Direct URL to extract media info from (YouTube, Twitch, SoundCloud, Vimeo, MP4, etc.)"
            },
            "example": f"{base_url}/api/universal?q=lofi&country=GLOBAL&limit=6"
        },
        "endpoints": {
            "universal": {
                "paths": ["/api/universal", "/api/all", "/api/search"],
                "methods": ["GET"],
                "description": "Aggregates results across YouTube, Radio, TV, Podcasts, Audiobooks, and Lyrics in one request."
            },
            "youtube": {
                "paths": ["/api/youtube", "/api/youtube/search", "/api/youtube/trending", "/api/youtube/live", "/api/youtube/extract"],
                "methods": ["GET"],
                "parameters": {"q": "search term", "type": "search|trending|live|extract", "sort": "relevance|latest|popular|rating", "limit": "int", "url": "video url"}
            },
            "radio": {
                "paths": ["/api/radio", "/api/radio/search"],
                "methods": ["GET"],
                "parameters": {"q": "station name", "country": "IN|GLOBAL|US|UK|...", "tag": "genre tag", "limit": "int"}
            },
            "tv": {
                "paths": ["/api/tv", "/api/tv/channels"],
                "methods": ["GET"],
                "parameters": {"country": "IN|US|UK|CA|DE|FR|IT|ES|JP|AU", "category": "news|music|sports|entertainment|all", "q": "filter name"}
            },
            "podcasts": {
                "paths": ["/api/podcasts", "/api/podcasts/search", "/api/podcasts/episodes"],
                "methods": ["GET"],
                "parameters": {"q": "search query", "country": "IN|GLOBAL|US", "feed": "RSS feed url for episodes list", "limit": "int"}
            },
            "audiobooks": {
                "paths": ["/api/audiobooks", "/api/audiobooks/search", "/api/audiobooks/chapters"],
                "methods": ["GET"],
                "parameters": {"q": "search query", "region": "indian|global|all", "cat": "category filter", "id": "identifier for chapters", "limit": "int"}
            },
            "lyrics": {
                "paths": ["/api/lyrics"],
                "methods": ["GET"],
                "parameters": {"title": "song title", "artist": "artist name", "q": "search query"}
            },
            "metadata": {
                "paths": ["/api/metadata"],
                "methods": ["GET"],
                "parameters": {"title": "movie or track title", "type": "movie|music"}
            },
            "stream_hls": {
                "paths": ["/api/stream/hls", "/stream/hls"],
                "methods": ["GET"],
                "parameters": {"url": "HLS master or playlist URL (.m3u8)"}
            },
            "stream_proxy": {
                "paths": ["/api/stream/proxy", "/stream/proxy"],
                "methods": ["GET"],
                "parameters": {"url": "Direct video/audio segment or stream URL"}
            }
        }
    }
    return jsonify(docs)


@app.route("/api/universal", methods=["GET"])
@app.route("/api/all", methods=["GET"])
@app.route("/api/search", methods=["GET"])
def universal_api():
    """
    Universal API: Multi-source parallel search across YouTube, Radio, TV,
    Podcasts, Audiobooks, and Lyrics in a single call. Also supports URL media extraction.
    """
    try:
        url = request.args.get("url", "").strip()
        quality = request.args.get("quality", "best")

        # 1. Direct URL extraction mode (Twitch, Kick, YouTube, TikTok, SoundCloud, MP4, etc.)
        if url:
            data = univ_prov.extract(url=url, quality=quality)
            if "error" in data:
                return jsonify({"success": False, "error": data["error"]}), 400
            return jsonify({
                "success": True,
                "mode": "url_extraction",
                "source": data.get("extractor", "universal"),
                "data": data
            })

        # 2. Universal Search mode
        q = request.args.get("q", "").strip()
        country = request.args.get("country", request.args.get("region", "IN")).strip().upper()
        sources_param = request.args.get("sources", request.args.get("type", request.args.get("types", "all"))).lower()
        limit = min(max(int(request.args.get("limit", 8)), 1), 25)

        active_sources = set(sources_param.split(",")) if sources_param != "all" else {"youtube", "radio", "tv", "podcasts", "audiobooks"}

        results = {
            "youtube": [],
            "radio": [],
            "tv": [],
            "podcasts": [],
            "audiobooks": [],
            "lyrics": None
        }

        audiobook_region = "indian" if country in ("IN", "INDIA") else ("global" if country in ("GLOBAL", "US", "UK") else "all")

        with ThreadPoolExecutor(max_workers=5) as executor:
            futures = {}
            if "youtube" in active_sources:
                futures["youtube"] = executor.submit(yt_prov.search, query=q, limit=limit)
            if "radio" in active_sources:
                futures["radio"] = executor.submit(radio_prov.search, name=q, country=country, limit=limit)
            if "tv" in active_sources:
                futures["tv"] = executor.submit(tv_prov.by_country, cc=country)
            if "podcasts" in active_sources:
                futures["podcasts"] = executor.submit(podcast_prov.search, query=q, country=country, limit=limit)
            if "audiobooks" in active_sources:
                futures["audiobooks"] = executor.submit(audiobook_prov.search, query=q, region=audiobook_region, limit=limit)
            if q and len(q.split()) > 1:
                futures["lyrics"] = executor.submit(lyrics_prov.get, raw_title=q, artist_hint="")

            for key, future in futures.items():
                try:
                    res = future.result()
                    if key == "tv":
                        if q:
                            q_lower = q.lower()
                            filtered_tv = [c for c in res if q_lower in c.get("name", "").lower() or q_lower in c.get("group", "").lower()]
                            if len(filtered_tv) < limit:
                                from providers import CURATED_TV_CHANNELS
                                for c in CURATED_TV_CHANNELS:
                                    if q_lower in c.get("name", "").lower() or q_lower in c.get("group", "").lower():
                                        if not any(x.get("name") == c.get("name") for x in filtered_tv):
                                            filtered_tv.append(c)
                            results["tv"] = filtered_tv[:limit]
                        else:
                            results["tv"] = res[:limit]
                    elif key == "lyrics":
                        if res and not res.get("error"):
                            results["lyrics"] = res
                    else:
                        results[key] = res or []
                except Exception as err:
                    print(f"Universal API error for {key}: {err}")
                    results[key] = []

        # Flattened cross-source unified feed
        unified = []
        for item in results["youtube"]:
            unified.append({
                "type": "youtube",
                "id": item.get("id"),
                "name": item.get("title"),
                "title": item.get("title"),
                "subtitle": item.get("uploader"),
                "uploader": item.get("uploader"),
                "url": item.get("url"),
                "embed_url": item.get("embed_url"),
                "thumbnail": item.get("thumbnail"),
                "duration": item.get("duration"),
                "is_video": True,
                "is_live": item.get("is_live", False)
            })
        for item in results["radio"]:
            unified.append({
                "type": "radio",
                "id": item.get("id"),
                "name": item.get("name"),
                "title": item.get("name"),
                "subtitle": f"{item.get('country', 'Live')} · {item.get('codec', 'Radio')}",
                "url": item.get("url"),
                "thumbnail": item.get("favicon"),
                "favicon": item.get("favicon"),
                "is_video": False,
                "is_live": True
            })
        for item in results["tv"]:
            unified.append({
                "type": "tv",
                "id": item.get("tvg_id") or item.get("name"),
                "name": item.get("name"),
                "title": item.get("name"),
                "subtitle": item.get("group", "Live TV"),
                "group": item.get("group", "Live TV"),
                "url": item.get("url"),
                "thumbnail": item.get("logo"),
                "logo": item.get("logo"),
                "is_video": True,
                "is_live": True
            })
        for item in results["podcasts"]:
            unified.append({
                "type": "podcasts",
                "id": item.get("id"),
                "name": item.get("title"),
                "title": item.get("title"),
                "author": item.get("author"),
                "subtitle": item.get("author"),
                "feedUrl": item.get("feedUrl"),
                "thumbnail": item.get("artwork"),
                "artwork": item.get("artwork"),
                "episodeCount": item.get("episodeCount", 0),
                "is_video": False,
                "is_live": False
            })
        for item in results["audiobooks"]:
            unified.append({
                "type": "audiobooks",
                "id": item.get("identifier"),
                "identifier": item.get("identifier"),
                "name": item.get("title"),
                "title": item.get("title"),
                "author": item.get("author"),
                "subtitle": item.get("author"),
                "thumbnail": item.get("image"),
                "image": item.get("image"),
                "chapters": item.get("chapters", []),
                "is_video": False,
                "is_live": False
            })

        total_count = sum(len(results[k]) for k in ["youtube", "radio", "tv", "podcasts", "audiobooks"])

        return jsonify({
            "success": True,
            "api": "MediaHub Universal API",
            "query": q,
            "country": country,
            "counts": {
                "total": total_count,
                "youtube": len(results["youtube"]),
                "radio": len(results["radio"]),
                "tv": len(results["tv"]),
                "podcasts": len(results["podcasts"]),
                "audiobooks": len(results["audiobooks"]),
                "has_lyrics": results["lyrics"] is not None
            },
            "results": results,
            "unified": unified
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# --- RADIO ROUTES ---
@app.route("/api/radio", methods=["GET"])
@app.route("/api/radio/search", methods=["GET"])
def radio_search():
    try:
        name = request.args.get("name", request.args.get("q", ""))
        country = request.args.get("country", "")
        tag = request.args.get("tag", "")
        limit = request.args.get("limit", 60)
        stations = radio_prov.search(name=name, country=country, tag=tag, limit=limit)
        return jsonify({"success": True, "count": len(stations), "data": stations})
    except Exception as e:
        return jsonify({"success": False, "error": str(e), "data": []}), 500


# --- TV ROUTES ---
@app.route("/api/tv", methods=["GET"])
@app.route("/api/tv/channels", methods=["GET"])
def tv_channels():
    try:
        country = request.args.get("country", "IN")
        q = request.args.get("q", "").strip().lower()
        category = request.args.get("category", request.args.get("group", "all")).lower()
        channels = tv_prov.by_country(cc=country)

        # Optional filter by search query or category
        if q:
            channels = [c for c in channels if q in c.get("name", "").lower() or q in c.get("group", "").lower()]
        if category and category != "all":
            channels = [c for c in channels if category in c.get("group", "").lower()]

        return jsonify({"success": True, "country": country, "count": len(channels), "data": channels})
    except Exception as e:
        return jsonify({"success": False, "error": str(e), "data": []}), 500


# --- YOUTUBE ROUTES ---
@app.route("/api/youtube", methods=["GET"])
def api_youtube_unified():
    try:
        url = request.args.get("url")
        if url:
            return youtube_extract()
        req_type = request.args.get("type", "").lower()
        if req_type == "trending":
            return youtube_trending()
        if req_type == "live" or request.args.get("live"):
            return youtube_live()
        return youtube_search()
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/youtube/search", methods=["GET"])
def youtube_search():
    try:
        q = request.args.get("q", "")
        cat = request.args.get("cat", "all")
        limit = request.args.get("limit", 24)
        sort_by = request.args.get("sort", request.args.get("sort_by", "relevance"))
        results = yt_prov.search(query=q, category=cat, limit=limit, sort_by=sort_by)
        return jsonify({"success": True, "count": len(results), "sort": sort_by, "data": results})
    except Exception as e:
        return jsonify({"success": False, "error": str(e), "data": []}), 500


@app.route("/api/youtube/trending", methods=["GET"])
def youtube_trending():
    try:
        cat = request.args.get("cat", "all")
        limit = request.args.get("limit", 24)
        results = yt_prov.trending(category=cat, limit=limit)
        return jsonify({"success": True, "category": cat, "count": len(results), "data": results})
    except Exception as e:
        return jsonify({"success": False, "error": str(e), "data": []}), 500


@app.route("/api/youtube/live", methods=["GET"])
def youtube_live():
    try:
        q = request.args.get("q", "")
        cat = request.args.get("cat", "")
        limit = request.args.get("limit", 24)
        results = yt_prov.live_now(query=q, category=cat, limit=limit)
        return jsonify({"success": True, "count": len(results), "data": results})
    except Exception as e:
        return jsonify({"success": False, "error": str(e), "data": []}), 500


@app.route("/api/youtube/extract", methods=["GET"])
def youtube_extract():
    try:
        url = request.args.get("url", "")
        quality = request.args.get("quality", "best")
        if not url:
            return jsonify({"success": False, "error": "Missing URL parameter"}), 400

        data = yt_prov.extract(url=url, quality=quality)
        if "error" in data:
            return jsonify({"success": False, "error": data["error"]}), 400
        return jsonify({"success": True, "data": data})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# --- UNIVERSAL URL ROUTE ---
@app.route("/api/universal/play", methods=["GET"])
def universal_play():
    try:
        url = request.args.get("url", "")
        quality = request.args.get("quality", "best")
        if not url:
            return jsonify({"success": False, "error": "Missing URL parameter"}), 400

        data = univ_prov.extract(url=url, quality=quality)
        if "error" in data:
            return jsonify({"success": False, "error": data["error"]}), 400
        return jsonify({"success": True, "data": data})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# --- PODCAST ROUTES ---
@app.route("/api/podcasts", methods=["GET"])
def api_podcasts_unified():
    if request.args.get("feed"):
        return podcasts_episodes()
    return podcasts_search()


@app.route("/api/podcasts/search", methods=["GET"])
def podcasts_search():
    try:
        q = request.args.get("q", "")
        country = request.args.get("country", "IN")
        limit = request.args.get("limit", 30)
        results = podcast_prov.search(query=q, country=country, limit=limit)
        return jsonify({"success": True, "count": len(results), "data": results})
    except Exception as e:
        return jsonify({"success": False, "error": str(e), "data": []}), 500


@app.route("/api/podcasts/episodes", methods=["GET"])
def podcasts_episodes():
    try:
        feed = request.args.get("feed", "")
        limit = request.args.get("limit", 100)
        if not feed:
            return jsonify({"success": False, "error": "Missing feed URL"}), 400
        results = podcast_prov.episodes(feed_url=feed, limit=limit)
        return jsonify({"success": True, "count": len(results), "data": results})
    except Exception as e:
        return jsonify({"success": False, "error": str(e), "data": []}), 500


# --- AUDIOBOOK ROUTES ---
@app.route("/api/audiobooks", methods=["GET"])
def api_audiobooks_unified():
    if request.args.get("id") or request.args.get("identifier"):
        return audiobooks_chapters()
    return audiobooks_search()


@app.route("/api/audiobooks/search", methods=["GET"])
def audiobooks_search():
    try:
        q = request.args.get("q", "")
        cat = request.args.get("cat", "all")
        region = request.args.get("region", "all")
        limit = request.args.get("limit", 36)
        results = audiobook_prov.search(query=q, category=cat, region=region, limit=limit)
        return jsonify({"success": True, "count": len(results), "data": results})
    except Exception as e:
        return jsonify({"success": False, "error": str(e), "data": []}), 500


@app.route("/api/audiobooks/chapters", methods=["GET"])
def audiobooks_chapters():
    try:
        identifier = request.args.get("id", request.args.get("identifier", ""))
        if not identifier:
            return jsonify({"success": False, "error": "Missing book id"}), 400
        chapters = audiobook_prov.get_chapters(identifier)
        return jsonify({"success": True, "count": len(chapters), "data": chapters})
    except Exception as e:
        return jsonify({"success": False, "error": str(e), "data": []}), 500


# --- LYRICS ROUTE ---
@app.route("/api/lyrics", methods=["GET"])
def lyrics():
    try:
        title = request.args.get("title", "")
        artist = request.args.get("artist", "")
        data = lyrics_prov.get(raw_title=title, artist_hint=artist)
        return jsonify({"success": True, "data": data})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# --- METADATA ROUTE ---
@app.route("/api/metadata", methods=["GET"])
def metadata():
    try:
        url = request.args.get("url", "")
        tmdb_key = request.args.get("tmdb_key", "")
        if not url:
            return jsonify({"success": False, "error": "Missing URL"}), 400
        data = meta_prov.enrich_from_url(url=url, tmdb_key=tmdb_key)
        return jsonify({"success": True, "data": data})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# --- SUBTITLES ROUTE ---
@app.route("/api/subtitles", methods=["GET"])
def subtitles():
    try:
        url = request.args.get("url", "")
        langs_param = request.args.get("langs", "en,hi")
        langs = [l.strip() for l in langs_param.split(",") if l.strip()]
        if not url:
            return jsonify({"success": False, "error": "Missing URL"}), 400
        data = sub_prov.fetch_inline(url=url, langs=langs)
        return jsonify({"success": True, "count": len(data), "data": data})
    except Exception as e:
        return jsonify({"success": False, "error": str(e), "data": []}), 500


# --- EPG ROUTES ---
@app.route("/api/epg/load", methods=["GET"])
def epg_load():
    try:
        url = request.args.get("url", "")
        if not url:
            return jsonify({"success": False, "error": "Missing XMLTV URL"}), 400
        result = epg_service.load_from_url(url=url)
        return jsonify({"success": True, "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/epg/now", methods=["GET"])
def epg_now():
    try:
        tvg_id = request.args.get("tvg_id", "")
        if not tvg_id:
            return jsonify({"success": False, "error": "Missing tvg_id"}), 400
        data = epg_service.get_now_and_next(tvg_id=tvg_id)
        return jsonify({"success": True, "data": data})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# High-performance connection-pooled session for HLS and media proxying
proxy_session = requests.Session()
adapter = requests.adapters.HTTPAdapter(
    pool_connections=64,
    pool_maxsize=128,
    max_retries=requests.adapters.Retry(total=2, backoff_factor=0.1)
)
proxy_session.mount("http://", adapter)
proxy_session.mount("https://", adapter)

# --- STREAM & HLS PROXY ROUTES ---
@app.route("/api/stream", methods=["GET", "HEAD", "OPTIONS"])
def api_stream_smart():
    if request.method == "OPTIONS":
        resp = Response()
        resp.headers["Access-Control-Allow-Origin"] = "*"
        resp.headers["Access-Control-Allow-Methods"] = "GET, HEAD, OPTIONS"
        resp.headers["Access-Control-Allow-Headers"] = "*"
        return resp
    stream_type = request.args.get("type", "").lower()
    target_url = request.args.get("url", "")
    if stream_type == "hls" or ".m3u8" in target_url.lower():
        return stream_hls()
    return stream_proxy()


@app.route("/api/stream/proxy", methods=["GET", "HEAD", "OPTIONS"])
@app.route("/stream/proxy", methods=["GET", "HEAD", "OPTIONS"])
def stream_proxy():
    if request.method == "OPTIONS":
        resp = Response()
        resp.headers["Access-Control-Allow-Origin"] = "*"
        resp.headers["Access-Control-Allow-Methods"] = "GET, HEAD, OPTIONS"
        resp.headers["Access-Control-Allow-Headers"] = "*"
        return resp

    target_url = request.args.get("url")
    if not target_url:
        return "Missing URL", 400

    # Auto-rewrite deprecated CDN endpoints to active public endpoints
    if "9xjio.wiseplayout.com" in target_url:
        target_url = target_url.replace("9xjio.wiseplayout.com", "wiselp.wiseplayout.com")

    try:
        # Forward client range headers and provide legitimate Referer/Origin for CDN acceptance
        parsed_target = urllib.parse.urlparse(target_url)
        origin = f"{parsed_target.scheme}://{parsed_target.netloc}"
        req_headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Referer": origin + "/",
            "Origin": origin
        }
        if "Range" in request.headers:
            req_headers["Range"] = request.headers["Range"]

        upstream = proxy_session.get(target_url, headers=req_headers, stream=True, timeout=15)

        def generate():
            for chunk in upstream.iter_content(chunk_size=128 * 1024):
                if chunk:
                    yield chunk

        resp = Response(
            stream_with_context(generate()),
            status=upstream.status_code,
            content_type=upstream.headers.get("Content-Type", "application/octet-stream"),
        )
        resp.headers["Access-Control-Allow-Origin"] = "*"
        resp.headers["Access-Control-Allow-Headers"] = "*"
        resp.headers["Access-Control-Allow-Methods"] = "GET, HEAD, OPTIONS"
        resp.headers["Accept-Ranges"] = "bytes"

        # Fast caching for immutable video/audio transport stream segments
        if any(target_url.lower().endswith(ext) or ext in target_url.lower() for ext in [".ts", ".aac", ".m4s", ".mp4", ".key"]):
            resp.headers["Cache-Control"] = "public, max-age=3600"

        if "Content-Range" in upstream.headers:
            resp.headers["Content-Range"] = upstream.headers["Content-Range"]
        if "Content-Length" in upstream.headers:
            resp.headers["Content-Length"] = upstream.headers["Content-Length"]

        return resp
    except Exception as e:
        resp = Response(
            json.dumps({"error": f"Proxy error: {str(e)}", "url": target_url}),
            status=502,
            mimetype="application/json"
        )
        resp.headers["Access-Control-Allow-Origin"] = "*"
        resp.headers["Access-Control-Allow-Headers"] = "*"
        resp.headers["Access-Control-Allow-Methods"] = "GET, HEAD, OPTIONS"
        return resp


@app.route("/api/stream/hls", methods=["GET", "HEAD", "OPTIONS"])
@app.route("/stream/hls", methods=["GET", "HEAD", "OPTIONS"])
def stream_hls():
    if request.method == "OPTIONS":
        resp = Response()
        resp.headers["Access-Control-Allow-Origin"] = "*"
        resp.headers["Access-Control-Allow-Methods"] = "GET, HEAD, OPTIONS"
        resp.headers["Access-Control-Allow-Headers"] = "*"
        return resp

    target_url = request.args.get("url")
    if not target_url:
        return "Missing URL", 400

    # Auto-rewrite deprecated CDN endpoints to active public endpoints
    if "9xjio.wiseplayout.com" in target_url:
        target_url = target_url.replace("9xjio.wiseplayout.com", "wiselp.wiseplayout.com")

    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        }
        r = proxy_session.get(target_url, headers=headers, timeout=10)

        if r.status_code != 200:
            resp = Response(
                json.dumps({"error": f"Upstream broadcast returned HTTP {r.status_code}", "status": r.status_code, "url": target_url}),
                status=r.status_code,
                mimetype="application/json"
            )
            resp.headers["Access-Control-Allow-Origin"] = "*"
            resp.headers["Access-Control-Allow-Headers"] = "*"
            resp.headers["Access-Control-Allow-Methods"] = "GET, HEAD, OPTIONS"
            return resp

        final_url = r.url or target_url
        text = r.text

        # Check if valid M3U8
        if "#EXTM3U" not in text:
            # Fallback to direct chunked streaming if it's a binary file
            return stream_proxy()

        rewritten_lines = []
        for line in text.splitlines():
            stripped = line.strip()
            if not stripped:
                rewritten_lines.append(line)
                continue

            if stripped.startswith("#"):
                # Handle encryption keys if present
                if stripped.startswith("#EXT-X-KEY:") and 'URI="' in stripped:
                    key_match = re.search(r'URI="([^"]+)"', stripped)
                    if key_match:
                        raw_key_uri = key_match.group(1)
                        resolved_key_uri = urllib.parse.urljoin(final_url, raw_key_uri)
                        proxied_key = f"/stream/proxy?url={urllib.parse.quote(resolved_key_uri)}"
                        rewritten_line = stripped.replace(f'URI="{raw_key_uri}"', f'URI="{proxied_key}"')
                        rewritten_lines.append(rewritten_line)
                        continue
                rewritten_lines.append(line)
            else:
                # Segment or sub-playlist URI line
                resolved_uri = urllib.parse.urljoin(final_url, stripped)
                if ".m3u8" in resolved_uri.lower() or "m3u8" in stripped.lower():
                    rewritten_lines.append(f"/stream/hls?url={urllib.parse.quote(resolved_uri)}")
                else:
                    rewritten_lines.append(f"/stream/proxy?url={urllib.parse.quote(resolved_uri)}")

        output_manifest = "\n".join(rewritten_lines)
        resp = Response(output_manifest, mimetype="application/vnd.apple.mpegurl")
        resp.headers["Access-Control-Allow-Origin"] = "*"
        resp.headers["Access-Control-Allow-Headers"] = "*"
        resp.headers["Access-Control-Allow-Methods"] = "GET, HEAD, OPTIONS"
        resp.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        return resp
    except Exception as e:
        resp = Response(
            json.dumps({"error": f"HLS proxy error: {str(e)}", "url": target_url}),
            status=502,
            mimetype="application/json"
        )
        resp.headers["Access-Control-Allow-Origin"] = "*"
        resp.headers["Access-Control-Allow-Headers"] = "*"
        resp.headers["Access-Control-Allow-Methods"] = "GET, HEAD, OPTIONS"
        return resp


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True, threaded=True)
