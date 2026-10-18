import sys
import os

# Add parent directory to sys.path so app and its modules are discoverable on Vercel
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app import app

# Vercel Serverless WSGI entrypoint
handler = app
