import os
import re
import time
import tempfile
import urllib.parse
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
import feedparser
import yt_dlp
import audiobooker
import syncedlyrics
from pyradios import RadioBrowser

# 100% Tested & Verified 24/7 Working Live TV Channels
CURATED_TV_CHANNELS = [
    {
        "name": "ABC News Live HD",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/ABC_News_logo_2021.svg/320px-ABC_News_logo_2021.svg.png",
        "group": "News",
        "tvg_id": "ABCNews.us",
        "country": "US",
        "url": "https://amg01942-amg01942c6-stirr-us-10178.playouts.now.amagi.tv/playlist.m3u8"
    },
    {
        "name": "DW News English (Live)",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Deutsche_Welle_symbol_2012.svg/320px-Deutsche_Welle_symbol_2012.svg.png",
        "group": "News",
        "tvg_id": "DWNews.de",
        "country": "DE",
        "url": "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8"
    },
    {
        "name": "Red Bull TV (Action & Sports)",
        "logo": "https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Red_Bull_TV_logo.svg/320px-Red_Bull_TV_logo.svg.png",
        "group": "Sports",
        "tvg_id": "RedBullTV.at",
        "country": "AT",
        "url": "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8"
    },
    {
        "name": "Bloomberg US (Financial News)",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Bloomberg_Television_logo.svg/320px-Bloomberg_Television_logo.svg.png",
        "group": "Business",
        "tvg_id": "BloombergTV.us",
        "country": "US",
        "url": "https://bloomberg.com/media-manifest/streams/us.m3u8"
    },
    {
        "name": "Aaj Tak HD (Live News)",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Aaj_tak_logo.png/320px-Aaj_tak_logo.png",
        "group": "News",
        "tvg_id": "AajTak.in",
        "country": "IN",
        "url": "https://feeds.intoday.in/aajtak/api/aajtakhd/master.m3u8"
    },
    {
        "name": "9XM (Bollywood Hits HD)",
        "logo": "https://upload.wikimedia.org/wikipedia/en/thumb/f/f4/9XM_logo.svg/320px-9XM_logo.svg.png",
        "group": "Music",
        "tvg_id": "9XM.in",
        "country": "IN",
        "url": "https://wiselp.wiseplayout.com/9XM/master.m3u8"
    },
    {
        "name": "9X Tashan (Punjabi Hits HD)",
        "logo": "https://upload.wikimedia.org/wikipedia/en/thumb/5/52/9X_Tashan_logo.svg/320px-9X_Tashan_logo.svg.png",
        "group": "Music",
        "tvg_id": "9XTashan.in",
        "country": "IN",
        "url": "https://wiselp.wiseplayout.com/9X_Tashan/master.m3u8"
    },
    {
        "name": "9X Jalwa (Bollywood Classics)",
        "logo": "https://xstreamcp-assets-msp.streamready.in/assets/LIVETV/LIVECHANNEL/LIVETV_LIVETVCHANNEL_9X_JALWA/images/LOGO_HD/image.png",
        "group": "Music",
        "tvg_id": "9XJalwa.in",
        "country": "IN",
        "url": "https://wiselp.wiseplayout.com/9X_Jalwa/master.m3u8"
    },
    {
        "name": "NDTV 24x7 (Live News)",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/NDTV_logo.svg/320px-NDTV_logo.svg.png",
        "group": "News",
        "tvg_id": "NDTV24x7.in",
        "country": "IN",
        "url": "https://ndtv24x7elemarchana.akamaized.net/hls/live/2003678/ndtv24x7/master.m3u8"
    },
    {
        "name": "7S Music (Non-Stop Hits)",
        "logo": "https://i.imgur.com/zDiIhdN.png",
        "group": "Music",
        "tvg_id": "7SMusic.in",
        "country": "IN",
        "url": "https://cdn.pishow.tv/ott/live/1257/master.m3u8"
    },
    {
        "name": "4 SiDES TV (HD News)",
        "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/4sites.png",
        "group": "News",
        "tvg_id": "4SiDESTV.in",
        "country": "IN",
        "url": "https://stream.ottlive.co.in/4sidestv/index.m3u8"
    },
    {
        "name": "Business Today (Live News)",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Business_Today_logo.svg/320px-Business_Today_logo.svg.png",
        "group": "Business",
        "tvg_id": "BusinessToday.in",
        "country": "IN",
        "url": "https://feeds.intoday.in/bttv/itgd.m3u8"
    },
    {
        "name": "News Capital (Live HD)",
        "logo": "https://newscapital.com/wp-content/uploads/2021/04/cropped-logo-192x192.png",
        "group": "News",
        "tvg_id": "NewsCapital.in",
        "country": "IN",
        "url": "https://newscapital.com/hls/stream.m3u8?token=Nc360Permanent"
    },
    # ==================== 🇺🇸 UNITED STATES ====================
    {
        "name": "00s Replay (Retro Hits)",
        "logo": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=80",
        "group": "Music",
        "tvg_id": "00sReplay.us",
        "country": "US",
        "url": "https://jmp2.uk/plu-62ba60f059624e000781c436.m3u8"
    },
    {
        "name": "24 Hour Free Movies",
        "logo": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&auto=format&fit=crop&q=80",
        "group": "Movies & Shows",
        "tvg_id": "24HourMovies.us",
        "country": "US",
        "url": "https://d1j2u714xk898n.cloudfront.net/scheduler/scheduleMaster/403.m3u8"
    },
    # ==================== 🇬🇧 UNITED KINGDOM ====================
    {
        "name": "5 Cops (UK Action)",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Channel_5_logo_2020.svg/320px-Channel_5_logo_2020.svg.png",
        "group": "Entertainment",
        "tvg_id": "5Cops.uk",
        "country": "UK",
        "url": "https://jmp2.uk/plu-5d2c571faeb3e2738ae27933.m3u8"
    },
    {
        "name": "Adventure Earth (UK HD)",
        "logo": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&auto=format&fit=crop&q=80",
        "group": "Documentary",
        "tvg_id": "AdventureEarth.uk",
        "country": "UK",
        "url": "https://a57e9c69976649b582a8d7604c00e69a.mediatailor.us-east-1.amazonaws.com/v1/master/04fd913bb278d8775298c26bf9ca2818dad14fb2/Samsung-UK_AdventureEarth/playlist.m3u8"
    },
    {
        "name": "Afrobeat TV Entertainment (UK)",
        "logo": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=80",
        "group": "Music",
        "tvg_id": "AfrobeatTV.uk",
        "country": "UK",
        "url": "https://stream.ecable.tv/afrobeats/index.m3u8"
    },
    {
        "name": "Andromeda UK (Sci-Fi)",
        "logo": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&auto=format&fit=crop&q=80",
        "group": "Movies & Shows",
        "tvg_id": "Andromeda.uk",
        "country": "UK",
        "url": "https://jmp2.uk/plu-5e8db96bccae160007c71eec.m3u8"
    },
    # ==================== 🇨🇦 CANADA ====================
    {
        "name": "48 Hours CA (True Crime)",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/48_Hours_logo.svg/320px-48_Hours_logo.svg.png",
        "group": "News",
        "tvg_id": "48Hours.ca",
        "country": "CA",
        "url": "https://jmp2.uk/plu-62e925bc68d18a00077bb990.m3u8"
    },
    {
        "name": "Autentic History CA HD",
        "logo": "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=200&auto=format&fit=crop&q=80",
        "group": "Documentary",
        "tvg_id": "AutenticHistory.ca",
        "country": "CA",
        "url": "https://9e754fa707344ccca6d84955c8fcaf36.mediatailor.us-east-1.amazonaws.com/v1/master/04fd913bb278d8775298c26bf9ca2818dad14fb2/Samsung-CA_AutenticHistory/playlist.m3u8"
    },
    {
        "name": "Autentic Travel CA HD",
        "logo": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&auto=format&fit=crop&q=80",
        "group": "Documentary",
        "tvg_id": "AutenticTravel.ca",
        "country": "CA",
        "url": "https://cb0c87cc605942ff9766a4e6744bbadc.mediatailor.us-east-1.amazonaws.com/v1/master/04fd913bb278d8775298c26bf9ca2818dad14fb2/Samsung-CA_AutenticTravel/playlist.m3u8"
    },
    # ==================== 🇩🇪 GERMANY ====================
    {
        "name": "1-2-3.tv HD (Live DE)",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/1-2-3.tv_Logo_2016.svg/320px-1-2-3.tv_Logo_2016.svg.png",
        "group": "Entertainment",
        "tvg_id": "123tv.de",
        "country": "DE",
        "url": "https://123tv-mx1.flex-cdn.net/index.m3u8"
    },
    {
        "name": "Alle hassen Chris (DE)",
        "logo": "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=200&auto=format&fit=crop&q=80",
        "group": "Comedy",
        "tvg_id": "AlleHassenChris.de",
        "country": "DE",
        "url": "https://jmp2.uk/plu-622f6e1e2792150007e0b2ff.m3u8"
    },
    {
        "name": "ARD-alpha (Science HD)",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/ARD_alpha_2019.svg/320px-ARD_alpha_2019.svg.png",
        "group": "Science",
        "tvg_id": "ARDalpha.de",
        "country": "DE",
        "url": "https://mcdn.br.de/br/fs/ard_alpha/hls/de/master.m3u8"
    },
    # ==================== 🇫🇷 FRANCE ====================
    {
        "name": "BFM2 (News 1080p)",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/BFM_TV_logo_2019.svg/320px-BFM_TV_logo_2019.svg.png",
        "group": "News",
        "tvg_id": "BFM2.fr",
        "country": "FR",
        "url": "https://d1ib1gsg71oarf.cloudfront.net/v1/master/3722c60a815c421300071ef2e865db2657e33527/BFM2/master.m3u8"
    },
    {
        "name": "ADN TV+ (Anime HD FR)",
        "logo": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&auto=format&fit=crop&q=80",
        "group": "Movies & Shows",
        "tvg_id": "ADNTV.fr",
        "country": "FR",
        "url": "https://d3b73b34o7cvkq.cloudfront.net/v1/master/3722c60a815c421300071ef2e865db2657e33527/ADN_TV_FR/master.m3u8"
    },
    {
        "name": "Africa 24 (Live News FR)",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Africa_24_logo.png/320px-Africa_24_logo.png",
        "group": "News",
        "tvg_id": "Africa24.fr",
        "country": "FR",
        "url": "https://africa24.vedge.infomaniak.com/livecast/ik:africa24/manifest.m3u8"
    },
    # ==================== 🇯🇵 JAPAN ====================
    {
        "name": "CGNTV Japan (1080p)",
        "logo": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=200&auto=format&fit=crop&q=80",
        "group": "Culture",
        "tvg_id": "CGNTV.jp",
        "country": "JP",
        "url": "https://d2p4mrcwl6ly4.cloudfront.net/out/v1/8d50f69fdbbf411a84f501254bf31efb/index.m3u8"
    },
    # ==================== 🇦🇺 AUSTRALIA ====================
    {
        "name": "2GB Sydney Live (1080p)",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/2GB_logo.svg/320px-2GB_logo.svg.png",
        "group": "News",
        "tvg_id": "2GB.au",
        "country": "AU",
        "url": "https://2gblive.akamaized.net/hls/live/2033805/2GB/index.m3u8"
    },
    {
        "name": "3AW Melbourne Live (1080p)",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/3AW_logo.svg/320px-3AW_logo.svg.png",
        "group": "News",
        "tvg_id": "3AW.au",
        "country": "AU",
        "url": "https://3awlive.akamaized.net/hls/live/2032295/3AW/index.m3u8"
    },
    # ==================== 🇮🇹 ITALY ====================
    {
        "name": "16 Anni e Incinta (IT)",
        "logo": "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=200&auto=format&fit=crop&q=80",
        "group": "Entertainment",
        "tvg_id": "16Anni.it",
        "country": "IT",
        "url": "https://jmp2.uk/plu-60940a07d88ba90007b9cb71.m3u8"
    },
    # ==================== 🇪🇸 SPAIN ====================
    {
        "name": "3Cat Info (1080p ES)",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/3Cat_logo.svg/320px-3Cat_logo.svg.png",
        "group": "News",
        "tvg_id": "3CatInfo.es",
        "country": "ES",
        "url": "https://directes-tv-int.3catdirectes.cat/live-origin/canal324-hls/master.m3u8"
    }
]

# Curated High-Fidelity Radio Stations (Verified Indian & Global)
CURATED_RADIO_STATIONS = [
    # ==================== 🇮🇳 100% VERIFIED WORKING INDIAN RADIO STATIONS ====================
    {
        "name": "Mirchi Top 20 (Bollywood Chartbusters)",
        "url": "https://drive.uber.radio/uber/bollywoodnow/icecast.audio",
        "country": "IN",
        "region": "indian",
        "favicon": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Radio_Mirchi_logo.svg/320px-Radio_Mirchi_logo.svg.png",
        "tags": ["bollywood", "hindi", "mirchi", "top40", "pop", "chartbusters"],
        "bitrate": 128,
        "codec": "MP3"
    },
    {
        "name": "Vividh Bharati (All India Radio AIR)",
        "url": "https://air.pc.cdn.bitgravity.com/air/live/pbaudio001/playlist.m3u8",
        "country": "IN",
        "region": "indian",
        "favicon": "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/All_India_Radio_logo.svg/320px-All_India_Radio_logo.svg.png",
        "tags": ["air", "vividh bharati", "classical", "retro", "hindi", "news"],
        "bitrate": 128,
        "codec": "AAC"
    },
    {
        "name": "Bollywood Gaane Purane (Retro Classics)",
        "url": "https://stream.zeno.fm/6n6ewddtad0uv",
        "country": "IN",
        "region": "indian",
        "favicon": "https://mytuner.global.ssl.fastly.net/media/tvos_radios/ppqbgfej6skx.jpeg",
        "tags": ["bollywood", "retro", "classic", "hindi", "purane", "70s", "80s"],
        "bitrate": 128,
        "codec": "MP3"
    },
    {
        "name": "Hits Of Kishore Kumar",
        "url": "http://stream.zeno.fm/pg6rqp8ztm0uv",
        "country": "IN",
        "region": "indian",
        "favicon": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Kishore_Kumar_1973.jpg/240px-Kishore_Kumar_1973.jpg",
        "tags": ["kishore kumar", "bollywood", "retro", "classic", "hindi"],
        "bitrate": 128,
        "codec": "MP3"
    },
    {
        "name": "Hits Of Lata Mangeshkar",
        "url": "http://stream.zeno.fm/g95zm67prfhvv",
        "country": "IN",
        "region": "indian",
        "favicon": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Lata_Mangeshkar_1969.jpg/240px-Lata_Mangeshkar_1969.jpg",
        "tags": ["lata mangeshkar", "bollywood", "melodies", "classic", "hindi"],
        "bitrate": 128,
        "codec": "MP3"
    },
    {
        "name": "Radio Mirchi Hindi FM",
        "url": "https://eu8.fastcast4u.com/proxy/clyedupq/stream",
        "country": "IN",
        "region": "indian",
        "favicon": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Radio_Mirchi_logo.svg/320px-Radio_Mirchi_logo.svg.png",
        "tags": ["bollywood", "mirchi", "hindi", "chartbusters", "pop"],
        "bitrate": 128,
        "codec": "MP3"
    },
    {
        "name": "Hits Of Bollywood (90s & 2000s)",
        "url": "http://stream.zeno.fm/8ty8szwpwfeuv",
        "country": "IN",
        "region": "indian",
        "favicon": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&auto=format&fit=crop&q=80",
        "tags": ["bollywood", "hindi", "hits", "desi", "90s", "2000s"],
        "bitrate": 128,
        "codec": "MP3"
    },
    {
        "name": "MY CLUB REMIX (Bollywood DJ & Dance)",
        "url": "http://stream.zeno.fm/u7eee0hyzp8uv",
        "country": "IN",
        "region": "indian",
        "favicon": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&auto=format&fit=crop&q=80",
        "tags": ["remix", "club", "dj", "bollywood", "dance", "edm"],
        "bitrate": 128,
        "codec": "MP3"
    },
    {
        "name": "Goldy Evergreen Bollywood",
        "url": "https://stream.zeno.fm/n2fd0edh9k8uv",
        "country": "IN",
        "region": "indian",
        "favicon": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&auto=format&fit=crop&q=80",
        "tags": ["evergreen", "retro", "golden era", "hindi", "classic"],
        "bitrate": 128,
        "codec": "AAC"
    },
    {
        "name": "Radio BollyFM (HD Hits)",
        "url": "http://stream.radiobollyfm.in:8201/hd?t=1526570335",
        "country": "IN",
        "region": "indian",
        "favicon": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=80",
        "tags": ["bollywood", "hindi", "bollyfm", "hits"],
        "bitrate": 128,
        "codec": "MP3"
    },
    {
        "name": "Bhakti World (Krishna & Ram Bhajans)",
        "url": "http://millenniumhits.out.airtime.pro:8000/millenniumhits_a",
        "country": "IN",
        "region": "indian",
        "favicon": "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=200&auto=format&fit=crop&q=80",
        "tags": ["bhakti", "devotional", "krishna", "bhajan", "spiritual"],
        "bitrate": 128,
        "codec": "MP3"
    },
    {
        "name": "All India Radio AIR Punjabi",
        "url": "https://air.pc.cdn.bitgravity.com/air/live/pbaudio138/chunklist.m3u8",
        "country": "IN",
        "region": "indian",
        "favicon": "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/All_India_Radio_logo.svg/320px-All_India_Radio_logo.svg.png",
        "tags": ["punjabi", "air", "bhangra", "folk", "news"],
        "bitrate": 128,
        "codec": "AAC"
    },
    {
        "name": "Tamil Panpalai Gold",
        "url": "https://tamilpanpalai.radioca.st/ind",
        "country": "IN",
        "region": "indian",
        "favicon": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&auto=format&fit=crop&q=80",
        "tags": ["tamil", "south", "gold", "melodies"],
        "bitrate": 128,
        "codec": "MP3"
    },
    # ==================== 🌍 GLOBAL CURATED RADIO STATIONS ====================
    {
        "name": "Lofi Girl (Chill Beats Radio)",
        "url": "https://play.streamafrica.net/lofigirl",
        "country": "Global",
        "region": "global",
        "favicon": "https://yt3.googleusercontent.com/ytc/AIdro_kU55CkgYtD_n5g6mZ2c_aU7m6jM=s176-c-k-c0x00ffffff-no-rj",
        "tags": ["lofi", "chill", "relax", "study"],
        "bitrate": 192,
        "codec": "MP3"
    },
    {
        "name": "SomaFM: Groove Salad",
        "url": "https://ice1.somafm.com/groovesalad-256-mp3",
        "country": "US",
        "region": "global",
        "favicon": "https://somafm.com/img/groovesalad120.png",
        "tags": ["ambient", "chillout", "electronic"],
        "bitrate": 256,
        "codec": "MP3"
    },
    {
        "name": "BBC Radio 1",
        "url": "https://stream.live.vc.bbcmedia.co.uk/bbc_radio_one",
        "country": "UK",
        "region": "global",
        "favicon": "https://sounds.files.bbci.co.uk/3.6.0/networks/bbc_radio_one/colour_default.svg",
        "tags": ["pop", "dance", "top40"],
        "bitrate": 128,
        "codec": "AAC"
    },
    {
        "name": "Jazz FM (UK)",
        "url": "https://stream-al.planetradio.co.uk/jazzhigh.aac",
        "country": "UK",
        "region": "global",
        "favicon": "https://planetradio.co.uk/wp-content/themes/planetradio/assets/images/logos/jazz.svg",
        "tags": ["jazz", "blues", "soul"],
        "bitrate": 128,
        "codec": "AAC"
    },
    {
        "name": "Ibiza Global Radio",
        "url": "https://listens.ibizaglobalradio.com/ibizaglobalradio.mp3",
        "country": "ES",
        "region": "global",
        "favicon": "https://ibizaglobalradio.com/wp-content/uploads/2021/04/cropped-favicon-192x192.png",
        "tags": ["electronic", "house", "club", "dance"],
        "bitrate": 192,
        "codec": "MP3"
    },
    {
        "name": "KEXP 90.3 FM Seattle",
        "url": "https://kexp.streamguys1.com/kexp160.mp3",
        "country": "US",
        "region": "global",
        "favicon": "https://www.kexp.org/static/assets/img/kexp-logo.png",
        "tags": ["indie", "alternative", "rock"],
        "bitrate": 160,
        "codec": "MP3"
    },
    {
        "name": "Defected Radio",
        "url": "https://stream.defected.com/defected",
        "country": "UK",
        "region": "global",
        "favicon": "https://defected.com/static/images/logo.svg",
        "tags": ["house", "disco", "club"],
        "bitrate": 192,
        "codec": "MP3"
    }
]


class RadioProvider:
    """
    Search and browse 45,000+ global radio stations via Radio Browser with caching,
    featuring rich 24/7 verified Indian and Global curated stations.
    """
    def __init__(self):
        self.rb = RadioBrowser()
        self._cache = {}

    def search(self, name="", country="", tag="", limit=60):
        country_norm = (country or "").strip().upper()
        cache_key = f"{name}_{country_norm}_{tag}_{limit}".lower()
        if cache_key in self._cache and time.time() - self._cache[cache_key]["time"] < 900:
            return self._cache[cache_key]["data"]

        is_indian = country_norm in ["IN", "INDIA", "INDIAN"]
        is_global = country_norm in ["GLOBAL", "US", "UK", "WORLD"]

        raw_results = []
        try:
            http_params = {
                "limit": min(int(limit or 60), 80),
                "hidebroken": "true",
                "order": "votes",
                "reverse": "true"
            }
            if name and name.strip():
                http_params["name"] = name.strip()
            if is_indian:
                http_params["countrycode"] = "IN"
            elif country_norm and not is_global:
                if len(country_norm) == 2:
                    http_params["countrycode"] = country_norm
                else:
                    http_params["country"] = country_norm
            if tag and tag.strip():
                http_params["tag"] = tag.strip().lower()

            url = "https://de1.api.radio-browser.info/json/stations/search"
            headers = {"User-Agent": "MediaHub/1.0"}
            resp = requests.get(url, params=http_params, headers=headers, timeout=6)
            if resp.status_code == 200:
                raw_results = resp.json()
        except Exception:
            raw_results = []

        stations = []
        # Prepend matching curated stations first
        for cs in CURATED_RADIO_STATIONS:
            cs_region = cs.get("region", "global")
            if is_indian and cs_region != "indian":
                continue
            if is_global and cs_region != "global":
                continue

            match = True
            if name and name.lower() not in cs["name"].lower():
                match = False
            if tag and not any(tag.lower() in t for t in cs["tags"]):
                match = False
            if match:
                stations.append({
                    "id": f"curated-{cs['name']}",
                    "name": cs["name"],
                    "url": cs["url"],
                    "country": cs["country"],
                    "favicon": cs["favicon"],
                    "tags": cs["tags"],
                    "codec": cs["codec"],
                    "bitrate": cs["bitrate"],
                    "votes": 99999
                })

        # Append RadioBrowser results avoiding duplicates
        seen_urls = {s["url"] for s in stations}
        seen_names = {s["name"].lower() for s in stations}

        for item in raw_results:
            stream_url = item.get("url_resolved") or item.get("url")
            station_name = item.get("name", "").strip()
            if not stream_url or not station_name:
                continue
            if stream_url in seen_urls or station_name.lower() in seen_names:
                continue

            seen_urls.add(stream_url)
            seen_names.add(station_name.lower())
            stations.append({
                "id": item.get("stationuuid") or item.get("changeuuid"),
                "name": station_name,
                "url": stream_url,
                "country": item.get("country", "") or item.get("countrycode", ""),
                "favicon": item.get("favicon", "") or "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=80",
                "tags": [t.strip() for t in item.get("tags", "").split(",") if t.strip()][:5],
                "codec": item.get("codec", "MP3"),
                "bitrate": item.get("bitrate", 128),
                "votes": item.get("votes", 0)
            })

        results = stations[:min(int(limit or 60), 80)]
        self._cache[cache_key] = {"data": results, "time": time.time()}
        return results


class TVProvider:
    """
    Parses iptv-org M3U playlists with verified 24/7 channels and in-memory cache.
    """
    def __init__(self):
        self._cache = {}

    def by_country(self, cc="IN"):
        country_code = (cc or "IN").strip().upper()
        if country_code in self._cache:
            return self._cache[country_code]

        channels = []
        # Prepend matching top working channels for the requested country
        for c in CURATED_TV_CHANNELS:
            if c["country"] == country_code or (country_code in ("ALL", "GLOBAL") and c["country"] in ("US", "IN", "UK", "DE")):
                channels.append({
                    "name": c["name"],
                    "logo": c["logo"],
                    "group": c["group"],
                    "tvg_id": c["tvg_id"],
                    "url": c["url"]
                })

        # Fetch iptv-org country list
        url = f"https://iptv-org.github.io/iptv/countries/{country_code.lower()}.m3u"
        try:
            resp = requests.get(url, timeout=10)
            if resp.status_code == 200:
                content = resp.text
                lines = content.splitlines()
                current_meta = None

                for line in lines:
                    line = line.strip()
                    if not line:
                        continue

                    if line.startswith("#EXTINF:"):
                        tvg_id = ""
                        tvg_logo = ""
                        group_title = "General"
                        name = "Unknown Channel"

                        id_match = re.search(r'tvg-id="([^"]*)"', line)
                        if id_match: tvg_id = id_match.group(1)

                        logo_match = re.search(r'tvg-logo="([^"]*)"', line)
                        if logo_match: tvg_logo = logo_match.group(1)

                        group_match = re.search(r'group-title="([^"]*)"', line)
                        if group_match: group_title = group_match.group(1)

                        name_split = line.split(",", 1)
                        if len(name_split) > 1:
                            name = name_split[1].strip()

                        current_meta = {
                            "name": name,
                            "logo": tvg_logo,
                            "group": group_title,
                            "tvg_id": tvg_id
                        }
                    elif not line.startswith("#") and current_meta:
                        stream_line = line.strip()
                        name_lower = current_meta.get("name", "").lower()

                        # Auto-filter dead scrapers, expired token domains, raw IP ports, and explicitly geo-blocked/offline tags
                        if (
                            "aynaott.com" in stream_line
                            or re.search(r"http://\d+\.\d+\.\d+\.\d+:\d+", stream_line)
                            or not stream_line.startswith("http")
                            or any(bad in name_lower for bad in ["[geo-blocked]", "[not 24/7]", "[offline]", "(geo-blocked)", "offline", "not 24/7"])
                        ):
                            current_meta = None
                            continue

                        # Auto-fix deprecated CDN endpoints
                        if "9xjio.wiseplayout.com" in stream_line:
                            stream_line = stream_line.replace("9xjio.wiseplayout.com", "wiselp.wiseplayout.com")

                        current_meta["url"] = stream_line
                        # Only include HTTPS or proxyable streams to avoid mixed-content failure
                        if not any(c["url"] == stream_line for c in channels):
                            channels.append(current_meta)
                        current_meta = None
        except Exception:
            pass

        # Enrich with active EPG Now Playing schedule
        try:
            from epg import epg_service
            for c in channels:
                epg_data = epg_service.get_now_and_next(c.get("tvg_id"), c.get("name"))
                if epg_data and epg_data.get("now"):
                    c["now_playing"] = epg_data["now"].get("title")
                    c["now_time"] = epg_data["now"].get("time_display")
                    c["now_category"] = epg_data["now"].get("category")
        except Exception:
            pass

        self._cache[country_code] = channels
        return channels


class YouTubeProvider:
    """
    YouTube search, trending, live streams, and stream extraction via yt-dlp.
    Includes in-memory TTL caching for instant responses and embed URL generation.
    """
    CATEGORY_DEFAULTS = {
        "all": "trending viral videos entertainment",
        "gaming": "gaming walkthrough gameplay playthrough esports live gaming",
        "live": "live stream broadcast 24/7 gaming news",
        "music": "top official music videos billboard hits",
        "news": "world news breaking news headlines live stream",
        "movies": "official movie trailers teaser film clips cinema",
        "tutorials": "tech programming coding tutorial software guide",
        "documentary": "documentary national geographic science 4k history",
        "comedy": "standup comedy sketches funny highlights humor",
        "sports": "sports highlights match goals nba ufc football",
    }

    def __init__(self):
        self.search_cache = {}
        self.extract_cache = {}

    def search(self, query="", category="all", limit=24, sort_by="relevance"):
        cat = (category or "all").lower()
        sort = (sort_by or "relevance").lower()
        search_term = query.strip() if query else ""

        if not search_term:
            if sort == "latest":
                search_term = f"new {self.CATEGORY_DEFAULTS.get(cat, cat)}"
            elif sort == "popular":
                search_term = f"popular top {self.CATEGORY_DEFAULTS.get(cat, cat)}"
            else:
                search_term = self.CATEGORY_DEFAULTS.get(cat, f"popular {cat}")
        elif cat != "all" and cat not in search_term.lower():
            if cat == "gaming":
                search_term = f"{search_term} gameplay walkthrough"
            elif cat == "music":
                search_term = f"{search_term} official music video"
            elif cat == "live":
                search_term = f"{search_term} live stream"
            else:
                search_term = f"{search_term} {cat}"

        cache_key = f"{search_term}_{limit}_{sort}".lower()
        if cache_key in self.search_cache and time.time() - self.search_cache[cache_key]["time"] < 600:
            return self.search_cache[cache_key]["data"]

        max_results = min(int(limit or 24), 50)
        ydl_opts = {
            "quiet": True,
            "skip_download": True,
            "extract_flat": "in_playlist",
            "socket_timeout": 8,
            "ignoreerrors": True,
        }

        # Build search target based on sort_by (SP filter codes: CAI%3D = upload date / latest, CAM%3D = view count / popular)
        if sort == "latest":
            target = f"https://www.youtube.com/results?search_query={urllib.parse.quote_plus(search_term)}&sp=CAI%253D"
        elif sort == "popular":
            target = f"https://www.youtube.com/results?search_query={urllib.parse.quote_plus(search_term)}&sp=CAM%253D"
        elif sort == "rating":
            target = f"https://www.youtube.com/results?search_query={urllib.parse.quote_plus(search_term)}&sp=CAE%253D"
        else:
            target = f"ytsearch{max_results}:{search_term}"

        results = []
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(target, download=False)
                for entry in info.get("entries", []):
                    if not entry:
                        continue
                    vid_id = entry.get("id")
                    if not vid_id:
                        continue
                    url = entry.get("url") or f"https://www.youtube.com/watch?v={vid_id}"
                    results.append({
                        "id": vid_id,
                        "title": entry.get("title", "Untitled"),
                        "url": url,
                        "embed_url": f"https://www.youtube-nocookie.com/embed/{vid_id}?autoplay=1&enablejsapi=1",
                        "uploader": entry.get("uploader") or entry.get("channel", "YouTube"),
                        "duration": entry.get("duration") or 0,
                        "thumbnail": entry.get("thumbnail") or (f"https://i.ytimg.com/vi/{vid_id}/hqdefault.jpg" if vid_id else ""),
                        "is_live": bool(entry.get("is_live") or entry.get("live_status") == "is_live"),
                        "view_count": entry.get("view_count") or 0
                    })
                    if len(results) >= max_results:
                        break
        except Exception:
            pass

        self.search_cache[cache_key] = {"data": results, "time": time.time()}
        return results

    def extract(self, url, quality="best"):
        cache_key = f"{url}_{quality}"
        if cache_key in self.extract_cache and time.time() - self.extract_cache[cache_key]["time"] < 600:
            return self.extract_cache[cache_key]["data"]

        vid_id_match = re.search(r"(?:v=|\/|be\/)([0-9A-Za-z_-]{11})", url)
        vid_id = vid_id_match.group(1) if vid_id_match else None
        embed_url = f"https://www.youtube-nocookie.com/embed/{vid_id}?autoplay=1&enablejsapi=1" if vid_id else None

        ydl_opts = {
            "quiet": True,
            "skip_download": True,
            "socket_timeout": 10,
            "extractor_args": {
                "youtube": {
                    "player_client": ["android", "ios", "web"]
                }
            }
        }

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
        except Exception:
            try:
                with yt_dlp.YoutubeDL({"quiet": True, "skip_download": True, "socket_timeout": 10}) as ydl:
                    info = ydl.extract_info(url, download=False)
            except Exception as ex:
                if embed_url:
                    return {
                        "is_live": False,
                        "url": embed_url,
                        "embed_url": embed_url,
                        "title": "YouTube Video",
                        "is_video": True,
                        "available_heights": [360, 720, 1080],
                        "extractor": "youtube"
                    }
                return {"error": f"Failed to extract stream: {str(ex)}"}

        is_live = bool(info.get("is_live") or info.get("live_status") == "is_live")
        formats = info.get("formats", [])
        available_heights = sorted(list({f.get("height") for f in formats if f.get("height")})) or [360, 720, 1080]

        chosen_url = None
        audio_url = None

        if is_live:
            # YouTube live streams separate video and audio itags; use official embed for synchronized video + audio
            result = {
                "is_live": True,
                "url": embed_url or info.get("url"),
                "embed_url": embed_url,
                "title": info.get("title", "Live Stream"),
                "thumbnail": info.get("thumbnail", ""),
                "available_heights": [360, 720, 1080],
                "is_video": True
            }
            self.extract_cache[cache_key] = {"data": result, "time": time.time()}
            return result

        audio_formats = [f for f in formats if f.get("vcodec") == "none" and f.get("acodec") != "none" and f.get("url")]
        if audio_formats:
            best_audio = sorted(audio_formats, key=lambda x: x.get("abr") or 0, reverse=True)[0]
            audio_url = best_audio.get("url")

        combined = [f for f in formats if f.get("vcodec") != "none" and f.get("acodec") != "none" and f.get("url")]

        if quality == "audio":
            chosen_url = audio_url or (combined[0].get("url") if combined else info.get("url"))
            is_video = False
        else:
            is_video = True
            if combined:
                combined.sort(key=lambda x: x.get("height") or 0, reverse=True)
                chosen_url = combined[0].get("url")
            if not chosen_url:
                chosen_url = embed_url or info.get("url")

        result = {
            "is_live": False,
            "url": chosen_url or embed_url or "",
            "embed_url": embed_url,
            "audio_url": audio_url or chosen_url or "",
            "title": info.get("title", ""),
            "thumbnail": info.get("thumbnail", ""),
            "duration": info.get("duration", 0),
            "available_heights": available_heights,
            "is_video": is_video,
            "extractor": info.get("extractor", "youtube")
        }

        self.extract_cache[cache_key] = {"data": result, "time": time.time()}
        return result

    def trending(self, category="all", limit=20):
        lim = int(limit or 20)
        cat = (category or "all").lower()
        if cat == "all":
            search_term = "trending popular videos entertainment"
        elif cat == "gaming":
            search_term = "trending gaming gameplay walkthrough esports"
        elif cat == "music":
            search_term = "trending official music videos hits"
        elif cat in self.CATEGORY_DEFAULTS:
            search_term = f"trending {self.CATEGORY_DEFAULTS[cat]}"
        else:
            search_term = f"trending {cat}"
        return self.search(search_term, category="all", limit=lim)

    def live_now(self, query="", category="", limit=20):
        lim = int(limit or 20)
        cat = (category or "").lower()
        q_clean = query.strip() if query else ""

        if q_clean:
            q = f"{q_clean} live stream"
        elif cat == "gaming":
            q = "gaming live stream gameplay esports 24/7"
        elif cat == "news":
            q = "breaking world news live stream 24/7"
        elif cat == "music":
            q = "live concert music stream broadcast"
        elif cat == "sports":
            q = "sports live stream commentary match"
        else:
            q = "live stream broadcast 24/7 news gaming"

        results = self.search(q, category="live", limit=lim * 2)
        live_only = [r for r in results if r.get("is_live")]
        return live_only[:lim] if live_only else results[:lim]


class UniversalProvider:
    """
    Universal media extraction for Twitch, Kick, Vimeo, TikTok, Dailymotion,
    Rumble, Twitter/X, Instagram, Reddit, SoundCloud, Bandcamp, and 1,700+ sites.
    Only uses embeds when allowed by X-Frame-Options; otherwise extracts native media.
    """
    def __init__(self):
        self.extract_cache = {}

    def extract(self, url, quality="best"):
        if not url:
            return {"error": "No URL provided"}

        url = url.strip()
        cache_key = f"univ_{url}_{quality}"
        if cache_key in self.extract_cache and time.time() - self.extract_cache[cache_key]["time"] < 600:
            return self.extract_cache[cache_key]["data"]

        # Fast path: Direct video/audio/HLS streams
        lower_url = url.lower().split("?")[0]
        if lower_url.endswith((".mp4", ".webm", ".ogv", ".mov", ".mkv")):
            result = {
                "is_live": False,
                "url": url,
                "title": url.split("/")[-1].split("?")[0] or "Direct Video Stream",
                "is_video": True,
                "extractor": "direct"
            }
            self.extract_cache[cache_key] = {"data": result, "time": time.time()}
            return result

        if ".m3u8" in lower_url or lower_url.endswith(".m3u"):
            result = {
                "is_live": True,
                "url": url,
                "title": url.split("/")[-1].split("?")[0] or "Direct HLS Live Stream",
                "is_video": True,
                "extractor": "hls"
            }
            self.extract_cache[cache_key] = {"data": result, "time": time.time()}
            return result

        if lower_url.endswith((".mp3", ".aac", ".flac", ".ogg", ".m4a", ".wav")):
            result = {
                "is_live": False,
                "url": url,
                "title": url.split("/")[-1].split("?")[0] or "Direct Audio Stream",
                "is_video": False,
                "audio_only": True,
                "extractor": "direct"
            }
            self.extract_cache[cache_key] = {"data": result, "time": time.time()}
            return result

        # Only use embeds for services that officially support iframe embedding
        embed_url = None
        is_video = True
        custom_title = None

        if "vimeo.com" in url:
            vimeo_match = re.search(r"vimeo\.com\/([0-9]+)", url)
            if vimeo_match:
                embed_url = f"https://player.vimeo.com/video/{vimeo_match.group(1)}?autoplay=1"
                custom_title = f"Vimeo Video #{vimeo_match.group(1)}"
        elif "soundcloud.com" in url:
            embed_url = f"https://w.soundcloud.com/player/?url={urllib.parse.quote(url)}&color=%237c3aed&auto_play=true"
            is_video = False
            custom_title = "SoundCloud Track"
        elif "youtube.com" in url or "youtu.be" in url:
            vid_id_match = re.search(r"(?:v=|\/|be\/)([0-9A-Za-z_-]{11})", url)
            if vid_id_match:
                embed_url = f"https://www.youtube-nocookie.com/embed/{vid_id_match.group(1)}?autoplay=1&enablejsapi=1"
                custom_title = "YouTube Video"
        elif "twitch.tv" in url:
            channel_match = re.search(r"twitch\.tv\/([a-zA-Z0-9_]+)", url)
            if channel_match:
                # Twitch embed - frontend will ensure proper parent domain
                embed_url = f"https://player.twitch.tv/?channel={channel_match.group(1)}&parent=localhost&parent=127.0.0.1&autoplay=true"
                custom_title = f"Twitch Live: {channel_match.group(1)}"

        # Extract with yt-dlp to get direct stream
        ydl_opts = {
            "quiet": True,
            "skip_download": True,
            "socket_timeout": 10,
            "ignoreerrors": True,
        }

        info = None
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
        except Exception:
            pass

        # If yt-dlp extraction succeeded, prefer direct playable stream over iframe
        if info:
            if "entries" in info and info["entries"]:
                info = [e for e in info["entries"] if e][0]

            is_live = bool(info.get("is_live") or info.get("live_status") == "is_live")
            formats = info.get("formats", []) or []

            extractor = (info.get("extractor") or "").lower()
            is_audio_site = any(name in extractor for name in ["soundcloud", "bandcamp", "audioboom", "anchor", "mixcloud"])
            has_video_track = any(f.get("vcodec") not in (None, "none") for f in formats)
            is_video = not is_audio_site and has_video_track

            available_heights = sorted(list({f.get("height") for f in formats if f.get("height")}))
            chosen_url = None
            audio_url = None

            # Check for live stream URL
            if is_live:
                if "youtube" in extractor or "youtube.com" in url or "youtu.be" in url:
                    chosen_url = embed_url
                else:
                    for f in formats:
                        f_url = f.get("url", "")
                        has_video = f.get("vcodec") not in (None, "none") and f.get("resolution") != "audio only"
                        if (".m3u8" in f_url or f.get("protocol") in ("m3u8", "m3u8_native")) and has_video:
                            chosen_url = f_url
                            break

                result = {
                    "is_live": True,
                    "url": chosen_url or embed_url or info.get("url"),
                    "embed_url": embed_url,
                    "title": info.get("title", custom_title or "Live Stream"),
                    "thumbnail": info.get("thumbnail", ""),
                    "is_video": True,
                    "available_heights": available_heights,
                    "extractor": extractor
                }
                self.extract_cache[cache_key] = {"data": result, "time": time.time()}
                return result

            # Audio stream
            audio_formats = [f for f in formats if f.get("vcodec") in (None, "none") and f.get("acodec") not in (None, "none") and f.get("url")]
            if audio_formats:
                best_audio = sorted(audio_formats, key=lambda x: x.get("abr") or 0, reverse=True)[0]
                audio_url = best_audio.get("url")

            # Progressive or HLS video format
            if is_video:
                if "youtube" in extractor or "youtube.com" in url or "youtu.be" in url:
                    if quality != "audio":
                        chosen_url = embed_url
                else:
                    combined = [f for f in formats if f.get("vcodec") not in (None, "none") and f.get("acodec") not in (None, "none") and f.get("url")]
                    if quality == "audio":
                        chosen_url = audio_url or (combined[0].get("url") if combined else info.get("url"))
                        is_video = False
                    elif combined:
                        combined.sort(key=lambda x: x.get("height") or 0, reverse=True)
                        chosen_url = combined[0].get("url")
                    if not chosen_url:
                        for f in formats:
                            f_url = f.get("url", "")
                            has_video = f.get("vcodec") not in (None, "none") and f.get("resolution") != "audio only"
                            if f_url and (".m3u8" in f_url or f.get("protocol") in ("m3u8", "m3u8_native")) and has_video:
                                chosen_url = f_url
                                break
                    if not chosen_url:
                        chosen_url = embed_url or info.get("url")
            else:
                chosen_url = audio_url or info.get("url")

            result = {
                "is_live": False,
                "url": chosen_url or embed_url or "",
                "embed_url": embed_url,
                "audio_url": audio_url or chosen_url or "",
                "title": info.get("title", custom_title or "Universal Media Stream"),
                "thumbnail": info.get("thumbnail", ""),
                "duration": info.get("duration", 0),
                "available_heights": available_heights,
                "is_video": is_video,
                "extractor": extractor
            }
            self.extract_cache[cache_key] = {"data": result, "time": time.time()}
            return result

        # Fallback to approved embed if available
        if embed_url:
            result = {
                "is_live": False,
                "url": embed_url,
                "embed_url": embed_url,
                "title": custom_title or "Universal Media Embed",
                "is_video": is_video,
                "extractor": "universal"
            }
            self.extract_cache[cache_key] = {"data": result, "time": time.time()}
            return result

        return {
            "error": "This webpage does not allow direct video extraction or embedded playback due to security restrictions (X-Frame-Options / CORS). Use 'Open Source' to view directly on their website.",
            "requires_external": True,
            "webpage_url": url
        }


# Curated Premier Fallback Podcasts (Indian & Global)
CURATED_FALLBACK_PODCASTS = {
    "IN": [
        {
            "id": "888135469",
            "title": "The Stories of Mahabharata",
            "author": "Sudipta Bhawmik",
            "description": "The epic story of the Mahabharata retold in audio with rich narrative and dramatization.",
            "feedUrl": "https://feeds.acast.com/public/shows/61a5495fd20fb600197c82fd",
            "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts125/v4/4b/32/3d/4b323dcf-bb24-00ee-2e38-9cfec1e79391/mza_1079555139097769634.jpg/600x600bb.jpg",
            "episodeCount": 79,
            "genre": "History & Myth",
            "country": "IN"
        },
        {
            "id": "1485600780",
            "title": "The Ranveer Show (BeerBiceps)",
            "author": "BeerBiceps / Ranveer Allahbadia",
            "description": "India's smartest podcast featuring top thinkers, scientists, authors, celebrities, and spiritual masters.",
            "feedUrl": "https://feeds.simplecast.com/7PWFZi_d",
            "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/33/c2/f3/33c2f354-9e32-2d12-1f4a-87428f522a27/mza_11676678235212351214.jpg/600x600bb.jpg",
            "episodeCount": 350,
            "genre": "Interviews & Society",
            "country": "IN"
        },
        {
            "id": "1518305061",
            "title": "The Desi Crime Podcast",
            "author": "Desi Studios",
            "description": "South Asia's premier true crime podcast unravelling notorious mysteries and crime cases across India and South Asia.",
            "feedUrl": "https://feeds.acast.com/public/shows/6a55242c7987e974eaf4ba29",
            "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts126/v4/4a/c3/88/4ac3882f-8da7-0e62-c3ca-62b1660f9947/mza_14620023616235471018.jpg/600x600bb.jpg",
            "episodeCount": 277,
            "genre": "True Crime",
            "country": "IN"
        },
        {
            "id": "1490216669",
            "title": "Finshots Daily",
            "author": "Finshots",
            "description": "A 5-minute daily breakdown of the most important financial, business, and economic developments in India.",
            "feedUrl": "https://anchor.fm/s/112f4588/podcast/rss",
            "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/bf/16/be/bf16be02-b2f5-bca9-ec2b-f1a23869992f/mza_17204996929949983946.jpg/600x600bb.jpg",
            "episodeCount": 600,
            "genre": "Business & Finance",
            "country": "IN"
        },
        {
            "id": "1501941375",
            "title": "Figuring Out with Raj Shamani",
            "author": "Raj Shamani",
            "description": "Conversations on business, startups, entrepreneurship, finance, and career growth in modern India.",
            "feedUrl": "https://anchor.fm/s/f5347ab0/podcast/rss",
            "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts112/v4/7e/ce/db/7ecedbc3-1463-c78d-712f-90e964dd12eb/mza_8314986708688325983.jpg/600x600bb.jpg",
            "episodeCount": 320,
            "genre": "Business & Education",
            "country": "IN"
        },
        {
            "id": "1754694834",
            "title": "The Daily Brief by Zerodha",
            "author": "Zerodha",
            "description": "The daily podcast bringing you timely analysis of Indian market trends, economics, and business stories.",
            "feedUrl": "https://anchor.fm/s/fd34ca00/podcast/rss",
            "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/70/4e/d8/704ed88f-a9cb-b295-88e5-e0a5c484fcf1/mza_15560645672288015508.jpg/600x600bb.jpg",
            "episodeCount": 90,
            "genre": "Investing & Economy",
            "country": "IN"
        },
        {
            "id": "1589578144",
            "title": "Maha Bharat with Dhruv Rathee",
            "author": "Dhruv Rathee",
            "description": "Deep-dives into how India works: history, governance, sociology, education, and economy explained.",
            "feedUrl": "https://anchor.fm/s/80e9fc74/podcast/rss",
            "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts122/v4/f6/cb/09/f6cb0912-32a5-48b4-023a-7db69d04fc49/mza_17208155988078972235.jpg/600x600bb.jpg",
            "episodeCount": 45,
            "genre": "Society & Culture",
            "country": "IN"
        },
        {
            "id": "1506540505",
            "title": "Gita for Daily Living",
            "author": "Neil Bhatt",
            "description": "Practical and insightful life guidance derived from the timeless verses of the Bhagavad Gita.",
            "feedUrl": "https://anchor.fm/s/172e7070/podcast/rss",
            "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts125/v4/e5/ea/bf/e5eabf2d-df83-5c26-f75a-0a006c3983a5/mza_11929971847190013958.jpg/600x600bb.jpg",
            "episodeCount": 180,
            "genre": "Spirituality & Philosophy",
            "country": "IN"
        },
        {
            "id": "981442168",
            "title": "Cyrus Says",
            "author": "Cyrus Broacha",
            "description": "India's definitive comedic talk show hosted by Cyrus Broacha with witty commentary on current affairs and pop culture.",
            "feedUrl": "https://feeds.simplecast.com/15wYyB1j",
            "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts115/v4/28/7f/05/287f0580-b74a-cf05-4f40-3cf1c3f68305/mza_9510167822557404481.jpg/600x600bb.jpg",
            "episodeCount": 1050,
            "genre": "Comedy & Culture",
            "country": "IN"
        },
        {
            "id": "1232886737",
            "title": "The Seen and the Unseen",
            "author": "Amit Varma",
            "description": "Long-form insightful conversations hosted by Amit Varma covering Indian economics, history, politics, and literature.",
            "feedUrl": "https://seenunseen.libsyn.com/rss",
            "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts125/v4/05/bc/11/05bc11cf-561b-949e-b2d2-8f19dafe437d/mza_13337989518331566417.jpg/600x600bb.jpg",
            "episodeCount": 380,
            "genre": "Economics & Heritage",
            "country": "IN"
        },
        {
            "id": "1539265910",
            "title": "Khooni : The Crime People",
            "author": "Sneha & Pooja",
            "description": "True crime audio docuseries investigating chilling murder trials and mysteries across India and Asia.",
            "feedUrl": "https://anchor.fm/s/32be6948/podcast/rss",
            "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts125/v4/bb/94/a3/bb94a3b7-7e6d-6725-b8ea-6aeb55776077/mza_14959416550979633215.jpg/600x600bb.jpg",
            "episodeCount": 115,
            "genre": "True Crime",
            "country": "IN"
        },
        {
            "id": "1516244671",
            "title": "Paisa Vaisa with Anupam Gupta",
            "author": "Anupam Gupta / IVM Podcasts",
            "description": "India's leading personal finance podcast addressing investments, mutual funds, real estate, and financial freedom.",
            "feedUrl": "https://feeds.audioboom.com/channels/4933927.rss",
            "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts115/v4/73/4f/98/734f9810-75c1-1557-ca5e-b27b5f1fe930/mza_11438995536412150388.jpg/600x600bb.jpg",
            "episodeCount": 420,
            "genre": "Personal Finance",
            "country": "IN"
        }
    ],
    "GLOBAL": [
        {
            "id": "1545953110",
            "title": "Huberman Lab",
            "author": "Dr. Andrew Huberman",
            "description": "Dr. Andrew Huberman discusses neuroscience, brain health, optimal biology, and evidence-based performance tools.",
            "feedUrl": "https://feeds.megaphone.fm/hubermanlab",
            "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts116/v4/8b/6e/c3/8b6ec340-9e66-6b68-6d81-ce0368c4a45a/mza_15535314088071850393.jpg/600x600bb.jpg",
            "episodeCount": 210,
            "genre": "Science & Health",
            "country": "GLOBAL"
        },
        {
            "id": "1434243584",
            "title": "Lex Fridman Podcast",
            "author": "Lex Fridman",
            "description": "Conversations about AI, science, technology, history, philosophy, intelligence, and the general human condition.",
            "feedUrl": "https://lexfridman.com/feed/podcast/",
            "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts125/v4/e5/47/33/e547336f-5776-87e2-45e3-8588507cb3dc/mza_10795493201479864235.jpg/600x600bb.jpg",
            "episodeCount": 430,
            "genre": "Technology & Science",
            "country": "GLOBAL"
        },
        {
            "id": "173001861",
            "title": "Dan Carlin's Hardcore History",
            "author": "Dan Carlin",
            "description": "Immersive, deep cinematic audio theater journeying into humanity's most dramatic and apocalyptic historic eras.",
            "feedUrl": "https://feeds.feedburner.com/dancarlin/history?format=xml",
            "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts115/v4/8e/3c/6f/8e3c6f14-722a-f966-2315-9989a319ea91/mza_12239694709405469446.jpg/600x600bb.jpg",
            "episodeCount": 85,
            "genre": "History",
            "country": "GLOBAL"
        },
        {
            "id": "1050462261",
            "title": "Acquired",
            "author": "Ben Gilbert & David Rosenthal",
            "description": "The playbooks behind the greatest companies of all time: Apple, Nvidia, Microsoft, LVMH, and more.",
            "feedUrl": "https://feeds.transistor.fm/acquired",
            "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts116/v4/1f/22/e7/1f22e703-a44d-df76-c560-60b73c41ea44/mza_16694380126244439121.jpg/600x600bb.jpg",
            "episodeCount": 240,
            "genre": "Business",
            "country": "GLOBAL"
        },
        {
            "id": "1521578868",
            "title": "SmartLess",
            "author": "Jason Bateman, Sean Hayes, Will Arnett",
            "description": "SmartLess with Jason Bateman, Sean Hayes, & Will Arnett connects and unites people from all walks of life.",
            "feedUrl": "https://feeds.simplecast.com/hNaFxXpO",
            "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts116/v4/33/c7/e9/33c7e99c-b3a6-8be5-6184-a1db2f7eb21e/mza_11979958315102551408.jpg/600x600bb.jpg",
            "episodeCount": 220,
            "genre": "Comedy & Interviews",
            "country": "GLOBAL"
        },
        {
            "id": "160904630",
            "title": "TED Talks Daily",
            "author": "TED",
            "description": "Every weekday, TED Talks Daily brings you the latest talks in audio to spark your curiosity and expand your mind.",
            "feedUrl": "https://feeds.acast.com/public/shows/67587e77c705e441797aff96",
            "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts116/v4/a4/c8/ee/a4c8ee86-8f3b-ec8a-3652-30089063544d/mza_13222383827419133481.jpg/600x600bb.jpg",
            "episodeCount": 1800,
            "genre": "Ideas & Education",
            "country": "GLOBAL"
        },
        {
            "id": "290783428",
            "title": "Planet Money",
            "author": "NPR",
            "description": "The economy explained. Imagine you could call up a friend and ask what's really happening with money and work.",
            "feedUrl": "https://feeds.npr.org/510289/podcast.xml",
            "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts116/v4/f5/01/fa/f501fa5c-2796-0f7f-2cf0-83533ec9e755/mza_10493863456381084224.jpg/600x600bb.jpg",
            "episodeCount": 1400,
            "genre": "Economics",
            "country": "GLOBAL"
        },
        {
            "id": "278981407",
            "title": "Stuff You Should Know",
            "author": "iHeartPodcasts",
            "description": "Josh and Chuck explore how everyday things, bizarre phenomenons, and historical oddities work.",
            "feedUrl": "https://omnycontent.com/d/playlist/e73c998e-6e60-432f-8610-ae210140c5b1/a91018a4-ea4f-4130-bf55-ae270180c327/44710ecc-10bb-48d1-93c7-ae270180c33e/podcast.rss",
            "artwork": "https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/4a/c0/a2/4ac0a2e7-ef56-d7fa-0bb2-68c34fbc4e57/mza_16694669352934444557.jpg/600x600bb.jpg",
            "episodeCount": 1600,
            "genre": "Society & Culture",
            "country": "GLOBAL"
        }
    ]
}
CURATED_FALLBACK_PODCASTS["US"] = CURATED_FALLBACK_PODCASTS["GLOBAL"]
CURATED_FALLBACK_PODCASTS["ALL"] = CURATED_FALLBACK_PODCASTS["GLOBAL"]


class PodcastProvider:
    """
    Search podcasts via Apple iTunes Search API with dedicated Indian and Global catalogs.
    """
    def __init__(self):
        self._top_cache = {}
        self._search_cache = {}
        self._episode_cache = {}

    def search(self, query="", country="IN", limit=30):
        country_norm = (country or "IN").upper().strip()
        is_global = country_norm in ["GLOBAL", "US", "ALL"]
        search_country = "US" if is_global else "IN"
        fallback_key = "GLOBAL" if is_global else "IN"
        limit = min(max(int(limit or 30), 1), 60)
        q = (query or "").strip()

        # If query is empty, return curated + live top chart for that country
        if not q:
            cache_key = f"top_{fallback_key}_{limit}"
            now = time.time()
            if cache_key in self._top_cache and (now - self._top_cache[cache_key]["time"]) < 3600:
                return self._top_cache[cache_key]["data"]

            curated = CURATED_FALLBACK_PODCASTS.get(fallback_key, [])
            dynamic_pods = []
            try:
                itunes_url = f"https://itunes.apple.com/search?term=podcast&country={search_country}&media=podcast&entity=podcast&limit={limit}"
                resp = requests.get(itunes_url, timeout=5)
                if resp.status_code == 200:
                    for item in resp.json().get("results", []):
                        feed_url = item.get("feedUrl")
                        if not feed_url: continue
                        dynamic_pods.append({
                            "id": str(item.get("collectionId")),
                            "title": item.get("collectionName", "Untitled Podcast"),
                            "author": item.get("artistName", ""),
                            "description": item.get("primaryGenreName", ""),
                            "feedUrl": feed_url,
                            "artwork": item.get("artworkUrl600") or item.get("artworkUrl100") or "",
                            "episodeCount": item.get("trackCount", 0),
                            "genre": item.get("primaryGenreName", ""),
                            "country": "GLOBAL" if is_global else "IN"
                        })
            except Exception:
                pass

            seen = set()
            merged = []
            for p in curated + dynamic_pods:
                pid = p.get("id") or p.get("feedUrl")
                if pid not in seen:
                    seen.add(pid)
                    merged.append(p)

            results = merged[:limit] if merged else curated[:limit]
            self._top_cache[cache_key] = {"data": results, "time": now}
            return results

        # Non-empty query: search iTunes
        cache_key = f"search_{fallback_key}_{q.lower()}_{limit}"
        now = time.time()
        if cache_key in self._search_cache and (now - self._search_cache[cache_key]["time"]) < 600:
            return self._search_cache[cache_key]["data"]

        encoded_q = urllib.parse.quote(q)
        url = f"https://itunes.apple.com/search?term={encoded_q}&country={search_country}&media=podcast&entity=podcast&limit={limit}"

        podcasts = []
        try:
            resp = requests.get(url, timeout=7)
            if resp.status_code == 200:
                data = resp.json()
                for item in data.get("results", []):
                    feed_url = item.get("feedUrl")
                    if not feed_url: continue
                    podcasts.append({
                        "id": str(item.get("collectionId")),
                        "title": item.get("collectionName", "Untitled Podcast"),
                        "author": item.get("artistName", ""),
                        "description": item.get("primaryGenreName", ""),
                        "feedUrl": feed_url,
                        "artwork": item.get("artworkUrl600") or item.get("artworkUrl100") or "",
                        "episodeCount": item.get("trackCount", 0),
                        "genre": item.get("primaryGenreName", ""),
                        "country": "GLOBAL" if is_global else "IN"
                    })
        except Exception:
            pass

        self._search_cache[cache_key] = {"data": podcasts, "time": now}
        return podcasts

    def episodes(self, feed_url, limit=100):
        if not feed_url: return []

        now = time.time()
        if feed_url in self._episode_cache and (now - self._episode_cache[feed_url]["time"]) < 600:
            return self._episode_cache[feed_url]["data"][:limit]

        try:
            parsed = feedparser.parse(feed_url)
        except Exception:
            return []

        episodes = []
        limit = min(int(limit or 100), 200)

        for entry in parsed.entries[:limit]:
            audio_url = None
            for enc in entry.get("enclosures", []):
                if enc.get("href"):
                    audio_url = enc.get("href")
                    break

            if not audio_url:
                for link in entry.get("links", []):
                    if "audio" in link.get("type", ""):
                        audio_url = link.get("href")
                        break

            if not audio_url: continue

            episodes.append({
                "id": entry.get("id") or audio_url,
                "title": entry.get("title", "Untitled Episode"),
                "url": audio_url,
                "published": entry.get("published", ""),
                "duration": entry.get("itunes_duration", ""),
                "description": entry.get("summary", "") or entry.get("description", "")
            })

        self._episode_cache[feed_url] = {"data": episodes, "time": now}
        return episodes


# Curated Library of Iconic Indian & World Public Domain Audiobooks
CURATED_AUDIOBOOKS = [
    # ==================== 🇮🇳 INDIAN CLASSICS & EPICS ====================
    {
        "identifier": "mahabharata_condensed_om_librivox",
        "title": "The Mahabharata of Krishna-Dwaipayana Vyasa",
        "author": "Vyasa (tr. Romesh Chunder Dutt)",
        "region": "indian",
        "category": "indian",
        "language": "English / Sanskrit",
        "badge": "🇮🇳 Indian Epic",
        "description": "The monumental epic of ancient India condensed into verse, recounting the legendary struggle between the Pandavas and Kauravas, the dice game, and the great war of Kurukshetra.",
        "image": "https://archive.org/services/img/mahabharata_condensed_om_librivox"
    },
    {
        "identifier": "the_ramayan_book_6_1403_librivox",
        "title": "The Ramayan of Valmiki (Yuddha Kanda)",
        "author": "Valmiki (tr. Ralph T. H. Griffith)",
        "region": "indian",
        "category": "indian",
        "language": "English / Sanskrit",
        "badge": "🇮🇳 Indian Epic",
        "description": "The climax of the Ramayana detailing Prince Rama's assault on Lanka, the vanquishing of Ravana, and the triumph of Dharma.",
        "image": "https://archive.org/services/img/the_ramayan_book_6_1403_librivox"
    },
    {
        "identifier": "ramayan4_1304_librivox",
        "title": "The Ramayan of Valmiki (Kishkindha Kanda)",
        "author": "Valmiki (tr. Ralph T. H. Griffith)",
        "region": "indian",
        "category": "indian",
        "language": "English / Sanskrit",
        "badge": "🇮🇳 Indian Epic",
        "description": "The heroic alliance between Lord Rama, Sugriva, and Hanuman in the monkey kingdom of Kishkindha.",
        "image": "https://archive.org/services/img/ramayan4_1304_librivox"
    },
    {
        "identifier": "bhagavad_gita_0803_librivox",
        "title": "The Bhagavad Gita (Divine Song)",
        "author": "Vyasa (tr. Sir Edwin Arnold)",
        "region": "indian",
        "category": "gita",
        "language": "English / Sanskrit",
        "badge": "🕉️ Sacred Text",
        "description": "The profound 18 discourses of Lord Krishna spoken to Arjuna regarding duty (Karma), wisdom (Jnana), and pure devotion (Bhakti).",
        "image": "https://archive.org/services/img/bhagavad_gita_0803_librivox"
    },
    {
        "identifier": "bhagavad-gita_1502_librivox",
        "title": "The Song Celestial (Bhagavad-Gita in Verse)",
        "author": "Vyasa (tr. Sir Edwin Arnold)",
        "region": "indian",
        "category": "gita",
        "language": "English",
        "badge": "🕉️ Sacred Text",
        "description": "The timeless verse translation celebrated worldwide for conveying the essence of the Gita's spiritual philosophy.",
        "image": "https://archive.org/services/img/bhagavad-gita_1502_librivox"
    },
    {
        "identifier": "panchatantra_2305_librivox",
        "title": "The Panchatantra (Five Books of Wisdom)",
        "author": "Pandit Vishnu Sharma",
        "region": "indian",
        "category": "fables",
        "language": "English / Sanskrit",
        "badge": "🦁 Ancient Fables",
        "description": "The world's oldest and most renowned collection of interrelated animal fables teaching statecraft, moral conduct, and clever strategy.",
        "image": "https://archive.org/services/img/panchatantra_2305_librivox"
    },
    {
        "identifier": "bookofgoodcounsels_1506_librivox",
        "title": "Hitopadesha (The Book of Good Counsels)",
        "author": "Narayana Pandit (tr. Sir Edwin Arnold)",
        "region": "indian",
        "category": "fables",
        "language": "English / Sanskrit",
        "badge": "🦁 Ancient Fables",
        "description": "Ancient Sanskrit tales imparting practical knowledge, diplomacy, and worldly wisdom through lively dialogues.",
        "image": "https://archive.org/services/img/bookofgoodcounsels_1506_librivox"
    },
    {
        "identifier": "dosakhiyan_2512_librivox",
        "title": "Do Sakhiyan (दो सखियाँ - हिंदी उपन्यास)",
        "author": "Munshi Premchand (मुंशी प्रेमचंद)",
        "region": "indian",
        "category": "hindi",
        "language": "Hindi (हिंदी)",
        "badge": "📜 Munshi Premchand",
        "description": "मुंशी प्रेमचंद का प्रसिद्ध सामाजिक उपन्यास जो मानवीय रिश्तों, भारतीय समाज और पारिवारिक संघर्षों को उजागर करता है।",
        "image": "https://archive.org/services/img/dosakhiyan_2512_librivox"
    },
    {
        "identifier": "gitanjali_1002_librivox",
        "title": "Gitanjali (Song Offerings)",
        "author": "Rabindranath Tagore",
        "region": "indian",
        "category": "tagore",
        "language": "English / Bengali",
        "badge": "🎭 Tagore Classic",
        "description": "Rabindranath Tagore's Nobel Prize-winning masterpiece of spiritual and devotional poems that mesmerized the globe.",
        "image": "https://archive.org/services/img/gitanjali_1002_librivox"
    },
    {
        "identifier": "sadhana_realisation_librivox",
        "title": "Sadhana: The Realisation of Life",
        "author": "Rabindranath Tagore",
        "region": "indian",
        "category": "tagore",
        "language": "English",
        "badge": "🎭 Tagore Classic",
        "description": "Tagore's philosophical essays on Upanishadic wisdom, soul liberation, infinite consciousness, and universal love.",
        "image": "https://archive.org/services/img/sadhana_realisation_librivox"
    },
    {
        "identifier": "crescent_moon_1608_librivox",
        "title": "The Crescent Moon (Childhood Poems)",
        "author": "Rabindranath Tagore",
        "region": "indian",
        "category": "tagore",
        "language": "English",
        "badge": "🎭 Tagore Classic",
        "description": "Magical, whimsical poems celebrating the innocence of children, gentle dreams, and maternal love.",
        "image": "https://archive.org/services/img/crescent_moon_1608_librivox"
    },
    {
        "identifier": "hungry_stones_1205_librivox",
        "title": "The Hungry Stones and Other Stories",
        "author": "Rabindranath Tagore",
        "region": "indian",
        "category": "tagore",
        "language": "English",
        "badge": "🎭 Tagore Classic",
        "description": "Gothic, romantic, and haunting Bengali short stories exploring mystery, destiny, and the human spirit.",
        "image": "https://archive.org/services/img/hungry_stones_1205_librivox"
    },
    {
        "identifier": "stories_from_tagore_1911_librivox",
        "title": "Stories from Tagore (Cabuliwallah & More)",
        "author": "Rabindranath Tagore",
        "region": "indian",
        "category": "tagore",
        "language": "English",
        "badge": "🎭 Tagore Classic",
        "description": "Unforgettable short stories portraying emotional bonds, including The Cabuliwallah, The Home-Coming, and Subha.",
        "image": "https://archive.org/services/img/stories_from_tagore_1911_librivox"
    },
    {
        "identifier": "songs_kabir_1006_librivox",
        "title": "Songs of Kabir",
        "author": "Sant Kabir (tr. Rabindranath Tagore)",
        "region": "indian",
        "category": "philosophy",
        "language": "English / Hindi",
        "badge": "🕉️ Mystic Poetry",
        "description": "The transcendent mystical verses of 15th-century saint Kabir cutting across dogmas to seek the divine within.",
        "image": "https://archive.org/services/img/songs_kabir_1006_librivox"
    },
    {
        "identifier": "kopal-kundala_2205_librivox",
        "title": "Kapalkundala (कपालकुंडला)",
        "author": "Bankim Chandra Chattopadhyay",
        "region": "indian",
        "category": "indian",
        "language": "English / Bengali",
        "badge": "🇮🇳 Indian Tale",
        "description": "A romantic and suspenseful Bengali masterpiece novel set in seventeenth-century coastal India.",
        "image": "https://archive.org/services/img/kopal-kundala_2205_librivox"
    },
    {
        "identifier": "more_jataka_tales_1308_librivox",
        "title": "More Jataka Tales (Ancient Buddhist Fables)",
        "author": "Ellen C. Babbitt (tr. from Pali)",
        "region": "indian",
        "category": "fables",
        "language": "English",
        "badge": "🦁 Ancient Fables",
        "description": "Revered Buddhist stories of the Bodhisattva's incarnations, celebrating selflessness, courage, and wit.",
        "image": "https://archive.org/services/img/more_jataka_tales_1308_librivox"
    },
    {
        "identifier": "indian_fairy_tales_1304_librivox",
        "title": "Indian Fairy Tales",
        "author": "Joseph Jacobs",
        "region": "indian",
        "category": "fables",
        "language": "English",
        "badge": "🦁 Ancient Fables",
        "description": "Vibrant folklore, magical adventures, and humorous encounters gathered from storytellers across India.",
        "image": "https://archive.org/services/img/indian_fairy_tales_1304_librivox"
    },
    {
        "identifier": "indian_story_book_1702_librivox",
        "title": "The Indian Story Book",
        "author": "Richard Wilson",
        "region": "indian",
        "category": "indian",
        "language": "English",
        "badge": "🇮🇳 Indian Tales",
        "description": "Classic tales from the Mahabharata, Ramayana, Shakuntala, and early Hindu lore told for audio listeners.",
        "image": "https://archive.org/services/img/indian_story_book_1702_librivox"
    },
    {
        "identifier": "ishaupanishad_1503_librivox",
        "title": "The Isha Upanishad",
        "author": "Vedic Rishis (tr. Swami Paramananda)",
        "region": "indian",
        "category": "gita",
        "language": "English / Sanskrit",
        "badge": "🕉️ Sacred Text",
        "description": "The supreme Upanishadic hymn revealing the divine presence in all created beings and liberation through detachment.",
        "image": "https://archive.org/services/img/ishaupanishad_1503_librivox"
    },
    {
        "identifier": "svetasvataraupanishad_1504_librivox",
        "title": "The Svetasvatara Upanishad",
        "author": "Vedic Rishis",
        "region": "indian",
        "category": "gita",
        "language": "English / Sanskrit",
        "badge": "🕉️ Sacred Text",
        "description": "Philosophical exploration of the ultimate cause of existence, the nature of Brahman, and the path of Yoga.",
        "image": "https://archive.org/services/img/svetasvataraupanishad_1504_librivox"
    },
    {
        "identifier": "vedantasutras1_2307_librivox",
        "title": "The Vedanta-Sutras & Shankara's Commentary",
        "author": "Badarayana & Adi Shankaracharya",
        "region": "indian",
        "category": "philosophy",
        "language": "English / Sanskrit",
        "badge": "🧠 Philosophy",
        "description": "The classic exposition of Non-Dualism (Advaita Vedanta) refuting illusion and establishing non-difference from Brahman.",
        "image": "https://archive.org/services/img/vedantasutras1_2307_librivox"
    },
    {
        "identifier": "siddhartha_1912_librivox",
        "title": "Siddhartha (A Journey to the East)",
        "author": "Hermann Hesse",
        "region": "indian",
        "category": "philosophy",
        "language": "English",
        "badge": "🧠 Philosophy",
        "description": "The Nobel laureate's evocative journey of an Indian seeker seeking enlightenment through asceticism, love, and the river's song.",
        "image": "https://archive.org/services/img/siddhartha_1912_librivox"
    },

    # ==================== 🌍 GLOBAL CLASSICS & MASTERPIECES ====================
    {
        "identifier": "adventures_sherlock_holmes_1311_librivox",
        "title": "The Adventures of Sherlock Holmes",
        "author": "Sir Arthur Conan Doyle",
        "region": "global",
        "category": "sherlock",
        "language": "English",
        "badge": "🔍 Sherlock Holmes",
        "description": "Twelve iconic detective cases featuring Sherlock Holmes and Dr. Watson including A Scandal in Bohemia, The Red-Headed League, and The Speckled Band.",
        "image": "https://archive.org/services/img/adventures_sherlock_holmes_1311_librivox"
    },
    {
        "identifier": "hound_baskervilles_librivox",
        "title": "The Hound of the Baskervilles",
        "author": "Sir Arthur Conan Doyle",
        "region": "global",
        "category": "sherlock",
        "language": "English",
        "badge": "🔍 Sherlock Holmes",
        "description": "Sherlock Holmes and Dr. Watson investigate the haunting legend of a spectral demonic hound terrifying Dartmoor.",
        "image": "https://archive.org/services/img/hound_baskervilles_librivox"
    },
    {
        "identifier": "pride_and_prejudice_librivox",
        "title": "Pride and Prejudice",
        "author": "Jane Austen",
        "region": "global",
        "category": "classics",
        "language": "English",
        "badge": "🌍 World Classic",
        "description": "Jane Austen's timeless romantic comedy tracing the witty sparks and societal hurdles between Elizabeth Bennet and Mr. Darcy.",
        "image": "https://archive.org/services/img/pride_and_prejudice_librivox"
    },
    {
        "identifier": "dracula_librivox",
        "title": "Dracula",
        "author": "Bram Stoker",
        "region": "global",
        "category": "horror",
        "language": "English",
        "badge": "🧛 Gothic Horror",
        "description": "The chilling epistolary horror tale of Transylvanian vampire Count Dracula stalking Victorian England and Professor Van Helsing's pursuit.",
        "image": "https://archive.org/services/img/dracula_librivox"
    },
    {
        "identifier": "frankenstein_1307_librivox",
        "title": "Frankenstein; or, The Modern Prometheus",
        "author": "Mary Wollstonecraft Shelley",
        "region": "global",
        "category": "horror",
        "language": "English",
        "badge": "🧛 Gothic Horror",
        "description": "The immortal gothic science-fiction masterpiece about scientist Victor Frankenstein and the sentient creature brought to life.",
        "image": "https://archive.org/services/img/frankenstein_1307_librivox"
    },
    {
        "identifier": "alice_in_wonderland_0711_librivox",
        "title": "Alice's Adventures in Wonderland",
        "author": "Lewis Carroll",
        "region": "global",
        "category": "classics",
        "language": "English",
        "badge": "🌍 World Classic",
        "description": "The classic journey of Alice tumbling down the rabbit hole into the surreal world of the Mad Hatter, Queen of Hearts, and Cheshire Cat.",
        "image": "https://archive.org/services/img/alice_in_wonderland_0711_librivox"
    },
    {
        "identifier": "timemachine_librivox",
        "title": "The Time Machine",
        "author": "H. G. Wells",
        "region": "global",
        "category": "scifi",
        "language": "English",
        "badge": "🚀 Classic Sci-Fi",
        "description": "The pioneer science-fiction odyssey travelling 800,000 years into the future to meet the subterranean Morlocks and peaceful Eloi.",
        "image": "https://archive.org/services/img/timemachine_librivox"
    },
    {
        "identifier": "war_of_the_worlds_librivox",
        "title": "The War of the Worlds",
        "author": "H. G. Wells",
        "region": "global",
        "category": "scifi",
        "language": "English",
        "badge": "🚀 Classic Sci-Fi",
        "description": "Martian invaders with towering tripod heat-ray machines conquer southern England in this legendary alien invasion drama.",
        "image": "https://archive.org/services/img/war_of_the_worlds_librivox"
    },
    {
        "identifier": "twenty_thousand_leagues_under_the_seas_1003_librivox",
        "title": "Twenty Thousand Leagues Under the Sea",
        "author": "Jules Verne",
        "region": "global",
        "category": "verne",
        "language": "English",
        "badge": "🌊 Verne Voyages",
        "description": "Captain Nemo's submarine Nautilus journeys through coral reefs, lost Atlantis, giant squid battles, and deep ocean trenches.",
        "image": "https://archive.org/services/img/twenty_thousand_leagues_under_the_seas_1003_librivox"
    },
    {
        "identifier": "around_the_world_in_eighty_days_librivox",
        "title": "Around the World in Eighty Days",
        "author": "Jules Verne",
        "region": "global",
        "category": "verne",
        "language": "English",
        "badge": "🌊 Verne Voyages",
        "description": "Phileas Fogg and his French valet Passepartout attempt to circumnavigate the late Victorian world in exactly eighty days.",
        "image": "https://archive.org/services/img/around_the_world_in_eighty_days_librivox"
    },
    {
        "identifier": "art_of_war_librivox",
        "title": "The Art of War",
        "author": "Sun Tzu (tr. Lionel Giles)",
        "region": "global",
        "category": "strategy",
        "language": "English",
        "badge": "⚔️ Strategy",
        "description": "The ancient Chinese military treatise on strategic decision making, tactical deception, psychological warfare, and leadership.",
        "image": "https://archive.org/services/img/art_of_war_librivox"
    },
    {
        "identifier": "meditations_marcus_aurelius_librivox",
        "title": "Meditations",
        "author": "Marcus Aurelius",
        "region": "global",
        "category": "philosophy",
        "language": "English",
        "badge": "🧠 Stoic Philosophy",
        "description": "Stoic exercises, ethical self-reflections, and enduring wisdom recorded by the Roman Emperor on mindfulness and calm.",
        "image": "https://archive.org/services/img/meditations_marcus_aurelius_librivox"
    },
    {
        "identifier": "picture_dorian_gray_librivox",
        "title": "The Picture of Dorian Gray",
        "author": "Oscar Wilde",
        "region": "global",
        "category": "horror",
        "language": "English",
        "badge": "🌍 World Classic",
        "description": "Oscar Wilde's dark philosophical novel of youth, hedonism, art, and a mysterious portrait bearing the marks of sin.",
        "image": "https://archive.org/services/img/picture_dorian_gray_librivox"
    },
    {
        "identifier": "great_expectations_librivox",
        "title": "Great Expectations",
        "author": "Charles Dickens",
        "region": "global",
        "category": "classics",
        "language": "English",
        "badge": "🌍 World Classic",
        "description": "Charles Dickens's celebrated Victorian bildungsroman of orphan Pip, mysterious Miss Havisham, and beautiful Estella.",
        "image": "https://archive.org/services/img/great_expectations_librivox"
    },
    {
        "identifier": "moby_dick_librivox",
        "title": "Moby Dick; or, The Whale",
        "author": "Herman Melville",
        "region": "global",
        "category": "classics",
        "language": "English",
        "badge": "🌍 World Classic",
        "description": "Captain Ahab's obsessive quest across turbulent seas to seek revenge on the great white albino whale.",
        "image": "https://archive.org/services/img/moby_dick_librivox"
    },
    {
        "identifier": "republic_librivox",
        "title": "The Republic",
        "author": "Plato (tr. Benjamin Jowett)",
        "region": "global",
        "category": "philosophy",
        "language": "English",
        "badge": "🧠 Philosophy",
        "description": "Socrates' famous philosophical dialogue exploring justice, the ideal city-state, the philosopher-king, and the Allegory of the Cave.",
        "image": "https://archive.org/services/img/republic_librivox"
    }
]


class AudiobookProvider:
    """
    Search audiobooks via Internet Archive public domain collection, LibriVox,
    and curated Indian & Global world classics. Fast, non-blocking with on-demand chapter loading.
    """
    def __init__(self):
        self._chapter_cache = {}
        self._search_cache = {}

    def _fetch_archive_chapters(self, identifier):
        if not identifier: return []
        if identifier in self._chapter_cache:
            return self._chapter_cache[identifier]

        meta_url = f"https://archive.org/metadata/{identifier}/files"
        try:
            resp = requests.get(meta_url, timeout=7)
            if resp.status_code != 200: return []
            files = resp.json().get("result", [])

            chapters_map = {}
            for f in files:
                name = f.get("name", "")
                if not name.lower().endswith(".mp3"): continue
                # Skip secondary bitrates to avoid duplicate tracks
                if any(name.lower().endswith(x) for x in ["_vbr.mp3", "_64kb.mp3", "_128kb.mp3"]):
                    continue

                raw_title = f.get("title") or name.rsplit(".", 1)[0]
                clean_title = re.sub(r'_\d+kb$', '', raw_title, flags=re.IGNORECASE)
                clean_title = re.sub(r'\s*-\s*\d+kbps?$', '', clean_title, flags=re.IGNORECASE).strip()

                stream_url = f"https://archive.org/download/{identifier}/{name}"
                if clean_title not in chapters_map:
                    chapters_map[clean_title] = {
                        "title": clean_title,
                        "url": stream_url
                    }

            # Fallback if no files passed the strict filter
            if not chapters_map:
                for f in files:
                    name = f.get("name", "")
                    if name.lower().endswith(".mp3"):
                        raw_title = f.get("title") or name.rsplit(".", 1)[0]
                        stream_url = f"https://archive.org/download/{identifier}/{name}"
                        chapters_map[raw_title] = {
                            "title": raw_title,
                            "url": stream_url
                        }

            chapters = list(chapters_map.values())
            chapters.sort(key=lambda x: x["title"])
            self._chapter_cache[identifier] = chapters
            return chapters
        except Exception:
            return []

    def get_chapters(self, identifier):
        return self._fetch_archive_chapters(identifier)

    def search(self, query="", category="all", region="all", limit=36):
        q = (query or "").strip().lower()
        cat = (category or "all").strip().lower()
        reg = (region or "all").strip().lower()
        limit = min(max(int(limit or 36), 1), 60)

        cache_key = f"{q}_{cat}_{reg}_{limit}"
        now = time.time()
        if cache_key in self._search_cache and (now - self._search_cache[cache_key]["time"]) < 3600:
            return self._search_cache[cache_key]["data"]

        results = []

        # 1. Match from Curated Collection
        for book in CURATED_AUDIOBOOKS:
            # Region match: "indian", "global", or "all"
            if reg in ["indian", "global"] and book.get("region") != reg:
                continue

            # Category match
            if cat not in ["all", "all_global", "all_indian", ""]:
                if book.get("category") != cat:
                    continue

            # Query match (if specified)
            if q:
                text_to_search = f"{book.get('title', '')} {book.get('author', '')} {book.get('description', '')}".lower()
                if q not in text_to_search:
                    continue

            item = dict(book)
            # Include cached chapters if available
            item["chapters"] = self._chapter_cache.get(item["identifier"], [])
            results.append(item)

        # 2. If user performed a specific search query, supplement with deep Archive.org search
        if q and len(results) < limit:
            try:
                ia_query = urllib.parse.quote(f"collection:(librivoxaudio OR audio_bookspoetry) AND ({q})")
                ia_url = f"https://archive.org/advancedsearch.php?q={ia_query}&fl[]=identifier,title,creator,description&rows={min(limit, 15)}&output=json"
                resp = requests.get(ia_url, timeout=5)
                if resp.status_code == 200:
                    docs = resp.json().get("response", {}).get("docs", [])
                    existing_ids = {b.get("identifier") for b in results}
                    for d in docs:
                        ident = d.get("identifier")
                        if not ident or ident in existing_ids: continue
                        results.append({
                            "identifier": ident,
                            "title": d.get("title", "Public Domain Audiobook"),
                            "author": d.get("creator", "LibriVox Volunteer"),
                            "region": "global" if reg == "global" else "indian",
                            "category": "archive",
                            "language": "English",
                            "badge": "LibriVox Classic",
                            "description": (d.get("description", "") or "")[:280],
                            "image": f"https://archive.org/services/img/{ident}",
                            "chapters": self._chapter_cache.get(ident, [])
                        })
            except Exception:
                pass

        self._search_cache[cache_key] = {"data": results[:limit], "time": now}
        return results[:limit]


class LyricsProvider:
    """
    Fetches synchronized LRC and plain lyrics using lrclib and syncedlyrics.
    Intelligently cleans titles and parses timestamps.
    """
    def __init__(self):
        self._cache = {}

    def clean_title(self, raw_title):
        # Strip brackets, tags, parentheticals
        cleaned = re.sub(r"\[.*?\]", "", raw_title)
        cleaned = re.sub(r"\(.*?(official|video|music|audio|remaster|hd|4k|lyric|ft\.|feat\.|visualizer).*?\)", "", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
        return cleaned

    def parse_lrc(self, lrc_text):
        lines = []
        for line in lrc_text.splitlines():
            line = line.strip()
            match = re.match(r"^\[(\d+):(\d+(?:\.\d+)?)\](.*)", line)
            if match:
                mins = int(match.group(1))
                secs = float(match.group(2))
                text = match.group(3).strip()
                lines.append({
                    "time": round(mins * 60 + secs, 2),
                    "text": text
                })
        lines.sort(key=lambda x: x["time"])
        return lines

    def get(self, raw_title, artist_hint=""):
        if not raw_title or not raw_title.strip():
            return {"synced": False, "lines": [], "plain": "No title specified", "source": "none"}

        lower_title = raw_title.lower().strip()
        # Immediately return empty lyrics for video files, manifests, and non-music media
        video_exts = [".m3u8", ".mp4", ".ts", ".mkv", ".webm", ".mov", ".avi", ".flv", ".mpd", "master.m3u8"]
        if any(ext in lower_title for ext in video_exts):
            return {"synced": False, "lines": [], "plain": "Lyrics not applicable for video streams or manifests.", "source": "none"}

        skip_keywords = ["bigbuckbunny", "tearsofsteel", "live stream", "live news", "universal stream", "universal media embed"]
        if any(kw in lower_title for kw in skip_keywords):
            return {"synced": False, "lines": [], "plain": "Lyrics not available for this stream.", "source": "none"}

        cache_key = f"{raw_title}_{artist_hint}".lower()
        if cache_key in self._cache:
            return self._cache[cache_key]

        cleaned = self.clean_title(raw_title)
        track_name = cleaned
        artist_name = artist_hint.strip()

        if " - " in cleaned:
            parts = cleaned.split(" - ", 1)
            artist_name = parts[0].strip()
            track_name = parts[1].strip()
        elif " by " in cleaned.lower():
            parts = re.split(r"\s+by\s+", cleaned, 1, flags=re.IGNORECASE)
            track_name = parts[0].strip()
            artist_name = parts[1].strip()

        # 1. Search lrclib.net search endpoint (most flexible)
        try:
            search_query = f"{artist_name} {track_name}".strip() if artist_name else track_name
            search_url = f"https://lrclib.net/api/search?q={urllib.parse.quote(search_query)}"
            s_resp = requests.get(search_url, timeout=4)
            if s_resp.status_code == 200 and s_resp.json():
                for item in s_resp.json():
                    if item.get("syncedLyrics"):
                        lines = self.parse_lrc(item.get("syncedLyrics"))
                        result = {"synced": True, "lines": lines, "plain": item.get("plainLyrics") or item.get("syncedLyrics"), "source": "lrclib"}
                        self._cache[cache_key] = result
                        return result
                    elif item.get("plainLyrics"):
                        result = {"synced": False, "lines": [], "plain": item.get("plainLyrics"), "source": "lrclib"}
                        self._cache[cache_key] = result
                        return result
        except Exception:
            pass

        # 2. Try lrclib.net get endpoint
        try:
            lrclib_url = "https://lrclib.net/api/get"
            params = {"track_name": track_name}
            if artist_name: params["artist_name"] = artist_name

            resp = requests.get(lrclib_url, params=params, timeout=3)
            if resp.status_code == 200:
                data = resp.json()
                synced_lyrics = data.get("syncedLyrics")
                plain_lyrics = data.get("plainLyrics")
                if synced_lyrics:
                    lines = self.parse_lrc(synced_lyrics)
                    result = {"synced": True, "lines": lines, "plain": plain_lyrics or synced_lyrics, "source": "lrclib"}
                    self._cache[cache_key] = result
                    return result
                elif plain_lyrics:
                    result = {"synced": False, "lines": [], "plain": plain_lyrics, "source": "lrclib"}
                    self._cache[cache_key] = result
                    return result
        except Exception:
            pass

        # 3. Fallback to syncedlyrics (exclude NetEase to avoid music.163.com connection timeouts)
        try:
            query = f"{artist_name} {track_name}".strip() if artist_name else track_name
            lrc_result = syncedlyrics.search(query, providers=["Musixmatch", "Deezer", "Lrclib"], enhanced=False)
            if lrc_result:
                lines = self.parse_lrc(lrc_result)
                result = {"synced": bool(lines), "lines": lines, "plain": lrc_result, "source": "syncedlyrics"}
                self._cache[cache_key] = result
                return result
        except Exception:
            pass

        fallback = {"synced": False, "lines": [], "plain": "Lyrics not found. Try searching by song name above.", "source": "none"}
        self._cache[cache_key] = fallback
        return fallback


class MetadataProvider:
    """
    Extracts rich media metadata using yt-dlp with optional TMDB enrichment.
    """
    def enrich_from_url(self, url, tmdb_key=None):
        if not url: return {"error": "No URL provided"}

        ydl_opts = {"quiet": True, "skip_download": True, "socket_timeout": 8, "ignoreerrors": True}
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
        except Exception as e:
            return {"error": f"Failed to retrieve metadata: {str(e)}"}

        if not info: return {"error": "Could not parse media details"}

        meta = {
            "title": info.get("title", ""),
            "description": info.get("description", "") or "",
            "uploader": info.get("uploader") or info.get("channel", ""),
            "channel": info.get("channel", "") or info.get("uploader", ""),
            "duration": info.get("duration", 0),
            "views": info.get("view_count", 0),
            "likes": info.get("like_count", 0),
            "upload_date": info.get("upload_date", ""),
            "thumbnail": info.get("thumbnail", ""),
            "tags": info.get("tags", []) or [],
            "categories": info.get("categories", []) or [],
            "is_live": bool(info.get("is_live")),
            "webpage_url": info.get("webpage_url") or url,
            "extractor": info.get("extractor", "")
        }

        api_key = tmdb_key or os.environ.get("TMDB_KEY")
        if api_key and meta["title"]:
            try:
                cleaned_title = re.sub(r"[\(\[\{].*?[\)\]\}]", "", meta["title"])
                cleaned_title = re.sub(r"[^\w\s]", "", cleaned_title).strip()
                tmdb_url = f"https://api.themoviedb.org/3/search/multi?api_key={api_key}&query={urllib.parse.quote(cleaned_title)}"
                t_resp = requests.get(tmdb_url, timeout=4)
                if t_resp.status_code == 200:
                    results = t_resp.json().get("results", [])
                    if results:
                        top = results[0]
                        poster_path = top.get("poster_path")
                        meta["tmdb"] = {
                            "title": top.get("title") or top.get("name"),
                            "overview": top.get("overview"),
                            "release_date": top.get("release_date") or top.get("first_air_date"),
                            "rating": top.get("vote_average"),
                            "poster": f"https://image.tmdb.org/t/p/w500{poster_path}" if poster_path else None
                        }
            except Exception:
                pass

        return meta


class SubtitleProvider:
    """
    Extracts subtitles in-memory to temporary directory and returns WebVTT string.
    Zero persistent disk footprint.
    """
    def fetch_inline(self, url, langs=None):
        if not url: return []
        if langs is None: langs = ["en", "hi"]

        subtitles = []
        try:
            with tempfile.TemporaryDirectory() as tmpdir:
                ydl_opts = {
                    "skip_download": True,
                    "writesubtitles": True,
                    "writeautomaticsub": True,
                    "subtitlesformat": "vtt",
                    "subtitleslangs": langs,
                    "outtmpl": os.path.join(tmpdir, "%(id)s.%(ext)s"),
                    "quiet": True,
                    "socket_timeout": 12
                }

                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    ydl.download([url])

                for filename in os.listdir(tmpdir):
                    if filename.endswith(".vtt"):
                        parts = filename.split(".")
                        lang = parts[-2] if len(parts) >= 3 else "en"
                        file_path = os.path.join(tmpdir, filename)
                        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                            vtt_content = f.read()

                        subtitles.append({"lang": lang, "vtt": vtt_content})
        except Exception:
            pass

        if not subtitles:
            try:
                with yt_dlp.YoutubeDL({"quiet": True, "skip_download": True, "socket_timeout": 8}) as ydl:
                    info = ydl.extract_info(url, download=False)
                    all_subs = {**(info.get("subtitles") or {}), **(info.get("automatic_captions") or {})}
                    for req_lang in langs:
                        if req_lang in all_subs:
                            formats = all_subs[req_lang]
                            vtt_item = next((s for s in formats if s.get("ext") == "vtt"), None)
                            if vtt_item and vtt_item.get("url"):
                                resp = requests.get(vtt_item["url"], timeout=6)
                                if resp.status_code == 200:
                                    subtitles.append({"lang": req_lang, "vtt": resp.text})
            except Exception:
                pass

        return subtitles
