"""
Seed script for VidVault.
Run: python manage.py shell < seed_data.py
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from categories.models import Category
from videos.models import Video
import json

# Create superuser
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@vidvault.com', 'admin123')
    print('✅ Admin user created (admin / admin123)')

# Create categories
categories_data = [
    {'name': 'Education', 'icon': '📚', 'description': 'Learn new skills and expand your knowledge'},
    {'name': 'Tech', 'icon': '💻', 'description': 'Technology tutorials and reviews'},
    {'name': 'Entertainment', 'icon': '🎬', 'description': 'Fun and entertaining content'},
    {'name': 'Islamic', 'icon': '🕌', 'description': 'Islamic lectures and nasheeds'},
    {'name': 'Tutorials', 'icon': '🎓', 'description': 'Step-by-step guides and how-tos'},
    {'name': 'Business', 'icon': '💼', 'description': 'Business and entrepreneurship'},
    {'name': 'Design', 'icon': '🎨', 'description': 'Graphic design and creative arts'},
    {'name': 'Programming', 'icon': '⌨️', 'description': 'Coding and software development'},
]

for cat_data in categories_data:
    cat, created = Category.objects.get_or_create(
        name=cat_data['name'],
        defaults=cat_data
    )
    if created:
        print(f'✅ Category: {cat.name}')

# Create sample videos
videos_data = [
    {
        'youtube_id': 'rfscVS0vtbw',
        'youtube_url': 'https://www.youtube.com/watch?v=rfscVS0vtbw',
        'title': 'Learn Python - Full Course for Beginners',
        'description': 'This course will give you a full introduction into all of the core concepts in Python. Follow along with the videos and you\'ll be a python programmer in no time!',
        'thumbnail': 'https://img.youtube.com/vi/rfscVS0vtbw/maxresdefault.jpg',
        'duration': '4:26:52',
        'channel_name': 'freeCodeCamp',
        'category': 'Programming',
        'tags': '["python", "programming", "beginner", "tutorial"]',
        'views': 45200,
        'is_featured': True,
    },
    {
        'youtube_id': 'PkZNo7MFNFg',
        'youtube_url': 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
        'title': 'Learn JavaScript - Full Course for Beginners',
        'description': 'This complete 134-part JavaScript tutorial for beginners will teach you everything you need to know to get started with the JavaScript programming language.',
        'thumbnail': 'https://img.youtube.com/vi/PkZNo7MFNFg/maxresdefault.jpg',
        'duration': '3:26:42',
        'channel_name': 'freeCodeCamp',
        'category': 'Programming',
        'tags': '["javascript", "web development", "beginner"]',
        'views': 38900,
        'is_featured': True,
    },
    {
        'youtube_id': 'qz0aGYrrlhU',
        'youtube_url': 'https://www.youtube.com/watch?v=qz0aGYrrlhU',
        'title': 'HTML Tutorial - How to Make a Super Simple Website',
        'description': 'Learn HTML basics and create your first website in this beginner-friendly tutorial.',
        'thumbnail': 'https://img.youtube.com/vi/qz0aGYrrlhU/maxresdefault.jpg',
        'duration': '1:02:03',
        'channel_name': 'freeCodeCamp',
        'category': 'Tech',
        'tags': '["html", "css", "web design", "beginner"]',
        'views': 22400,
        'is_featured': False,
    },
    {
        'youtube_id': 'w7ejDZ8SWv8',
        'youtube_url': 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
        'title': 'React JS Crash Course',
        'description': 'Get started with React in this crash course. We will be building a task tracker app.',
        'thumbnail': 'https://img.youtube.com/vi/w7ejDZ8SWv8/maxresdefault.jpg',
        'duration': '1:48:48',
        'channel_name': 'Traversy Media',
        'category': 'Programming',
        'tags': '["react", "javascript", "frontend"]',
        'views': 31500,
        'is_featured': True,
    },
    {
        'youtube_id': 'jS4aFq5-91M',
        'youtube_url': 'https://www.youtube.com/watch?v=jS4aFq5-91M',
        'title': 'Django Course - Python Web Framework Beginner Tutorial',
        'description': 'Learn the Python Django framework by building a full stack web application.',
        'thumbnail': 'https://img.youtube.com/vi/jS4aFq5-91M/maxresdefault.jpg',
        'duration': '3:45:40',
        'channel_name': 'freeCodeCamp',
        'category': 'Programming',
        'tags': '["django", "python", "web development", "backend"]',
        'views': 28700,
        'is_featured': True,
    },
    {
        'youtube_id': 'RGOj5yH7evk',
        'youtube_url': 'https://www.youtube.com/watch?v=RGOj5yH7evk',
        'title': 'Git and GitHub for Beginners - Crash Course',
        'description': 'Learn the basics of Git and GitHub. No prior experience required.',
        'thumbnail': 'https://img.youtube.com/vi/RGOj5yH7evk/maxresdefault.jpg',
        'duration': '1:08:29',
        'channel_name': 'freeCodeCamp',
        'category': 'Tech',
        'tags': '["git", "github", "version control"]',
        'views': 19800,
        'is_featured': False,
    },
    {
        'youtube_id': 'YeFvM4hnTBs',
        'youtube_url': 'https://www.youtube.com/watch?v=YeFvM4hnTBs',
        'title': 'Adobe Photoshop Tutorial for Beginners',
        'description': 'Everything you need to know to get started with Adobe Photoshop.',
        'thumbnail': 'https://img.youtube.com/vi/YeFvM4hnTBs/maxresdefault.jpg',
        'duration': '2:10:37',
        'channel_name': 'Envato Tuts+',
        'category': 'Design',
        'tags': '["photoshop", "graphic design", "adobe"]',
        'views': 15600,
        'is_featured': False,
    },
    {
        'youtube_id': 'HVjjoMvutma',
        'youtube_url': 'https://www.youtube.com/watch?v=HVjjoMvutma',
        'title': 'Digital Marketing Full Course for Beginners',
        'description': 'Complete digital marketing course covering SEO, social media, and more.',
        'thumbnail': 'https://img.youtube.com/vi/HVjjoMvutma/maxresdefault.jpg',
        'duration': '4:32:01',
        'channel_name': 'Simplilearn',
        'category': 'Business',
        'tags': '["digital marketing", "seo", "social media"]',
        'views': 12300,
        'is_featured': False,
    },
    {
        'youtube_id': 'pTFZrS8GHPE',
        'youtube_url': 'https://www.youtube.com/watch?v=pTFZrS8GHPE',
        'title': 'Figma Tutorial for UI Design',
        'description': 'Learn Figma from scratch. A complete beginner guide to designing beautiful interfaces.',
        'thumbnail': 'https://img.youtube.com/vi/pTFZrS8GHPE/maxresdefault.jpg',
        'duration': '2:47:12',
        'channel_name': 'DesignCourse',
        'category': 'Design',
        'tags': '["figma", "ui design", "ux design"]',
        'views': 17200,
        'is_featured': False,
    },
    {
        'youtube_id': '3JluqTojuME',
        'youtube_url': 'https://www.youtube.com/watch?v=3JluqTojuME',
        'title': 'Data Structures Easy to Advanced Course',
        'description': 'A complete computer science course on data structures and algorithms.',
        'thumbnail': 'https://img.youtube.com/vi/3JluqTojuME/maxresdefault.jpg',
        'duration': '8:03:22',
        'channel_name': 'freeCodeCamp',
        'category': 'Education',
        'tags': '["data structures", "algorithms", "computer science"]',
        'views': 25100,
        'is_featured': True,
    },
    {
        'youtube_id': 'Ke90Tje7VS0',
        'youtube_url': 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
        'title': 'React Native Tutorial for Beginners',
        'description': 'Build mobile apps with React Native. Full crash course for beginners.',
        'thumbnail': 'https://img.youtube.com/vi/Ke90Tje7VS0/maxresdefault.jpg',
        'duration': '2:06:33',
        'channel_name': 'Programming with Mosh',
        'category': 'Programming',
        'tags': '["react native", "mobile", "javascript"]',
        'views': 14700,
        'is_featured': False,
    },
    {
        'youtube_id': 'CxGSnA-kRYI',
        'youtube_url': 'https://www.youtube.com/watch?v=CxGSnA-kRYI',
        'title': 'Freelancing Full Course - Earn Money Online',
        'description': 'Complete guide to freelancing - from getting started to scaling your business.',
        'thumbnail': 'https://img.youtube.com/vi/CxGSnA-kRYI/maxresdefault.jpg',
        'duration': '1:45:00',
        'channel_name': 'Azad Chaiwala',
        'category': 'Business',
        'tags': '["freelancing", "earn money", "online business"]',
        'views': 33200,
        'is_featured': False,
    },
    {
        'youtube_id': 'WGJJIrtnfpk',
        'youtube_url': 'https://www.youtube.com/watch?v=WGJJIrtnfpk',
        'title': 'CSS Flexbox Tutorial',
        'description': 'Learn CSS Flexbox in 20 minutes with practical examples.',
        'thumbnail': 'https://img.youtube.com/vi/WGJJIrtnfpk/maxresdefault.jpg',
        'duration': '0:20:35',
        'channel_name': 'Web Dev Simplified',
        'category': 'Tutorials',
        'tags': '["css", "flexbox", "web design"]',
        'views': 11500,
        'is_featured': False,
    },
    {
        'youtube_id': 'CvUiKWv2-C0',
        'youtube_url': 'https://www.youtube.com/watch?v=CvUiKWv2-C0',
        'title': 'Quran Recitation - Beautiful Voice',
        'description': 'Beautiful Quran recitation that will touch your heart.',
        'thumbnail': 'https://img.youtube.com/vi/CvUiKWv2-C0/maxresdefault.jpg',
        'duration': '1:30:00',
        'channel_name': 'Islamic Knowledge',
        'category': 'Islamic',
        'tags': '["quran", "recitation", "islamic"]',
        'views': 42100,
        'is_featured': False,
    },
    {
        'youtube_id': 'kJQP7kiw5Fk',
        'youtube_url': 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
        'title': 'Top 10 Movies You Must Watch in 2025',
        'description': 'A curated list of the best movies released this year that you absolutely must see.',
        'thumbnail': 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
        'duration': '0:15:32',
        'channel_name': 'Movie Central',
        'category': 'Entertainment',
        'tags': '["movies", "entertainment", "review"]',
        'views': 56700,
        'is_featured': False,
    },
    {
        'youtube_id': '1Rs2ND1ryYc',
        'youtube_url': 'https://www.youtube.com/watch?v=1Rs2ND1ryYc',
        'title': 'CSS Grid Layout Full Course',
        'description': 'Master CSS Grid layout with this comprehensive tutorial. Build real-world layouts.',
        'thumbnail': 'https://img.youtube.com/vi/1Rs2ND1ryYc/maxresdefault.jpg',
        'duration': '1:04:15',
        'channel_name': 'freeCodeCamp',
        'category': 'Tutorials',
        'tags': '["css", "grid", "web layout"]',
        'views': 9800,
        'is_featured': False,
    },
]

for v_data in videos_data:
    cat_name = v_data.pop('category')
    try:
        category = Category.objects.get(name=cat_name)
    except Category.DoesNotExist:
        category = None

    video, created = Video.objects.get_or_create(
        youtube_id=v_data['youtube_id'],
        defaults={**v_data, 'category': category}
    )
    if created:
        print(f'✅ Video: {video.title[:50]}...')

print(f'\n🎉 Seeding complete! {Video.objects.count()} videos, {Category.objects.count()} categories')
