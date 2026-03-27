import re
import requests


def extract_youtube_id(url):
    """Extract YouTube video ID from various URL formats."""
    patterns = [
        r'(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/)([a-zA-Z0-9_-]{11})',
        r'youtube\.com/shorts/([a-zA-Z0-9_-]{11})',
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


def fetch_youtube_metadata(url):
    """Fetch video metadata using YouTube oEmbed API."""
    video_id = extract_youtube_id(url)
    if not video_id:
        return None

    try:
        oembed_url = f'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json'
        response = requests.get(oembed_url, timeout=10)
        response.raise_for_status()
        data = response.json()

        return {
            'youtube_id': video_id,
            'youtube_url': f'https://www.youtube.com/watch?v={video_id}',
            'title': data.get('title', ''),
            'channel_name': data.get('author_name', ''),
            'thumbnail': f'https://img.youtube.com/vi/{video_id}/maxresdefault.jpg',
            'thumbnail_hq': f'https://img.youtube.com/vi/{video_id}/hqdefault.jpg',
        }
    except (requests.RequestException, ValueError):
        # Return basic info even if oEmbed fails
        return {
            'youtube_id': video_id,
            'youtube_url': f'https://www.youtube.com/watch?v={video_id}',
            'title': '',
            'channel_name': '',
            'thumbnail': f'https://img.youtube.com/vi/{video_id}/hqdefault.jpg',
            'thumbnail_hq': f'https://img.youtube.com/vi/{video_id}/hqdefault.jpg',
        }
