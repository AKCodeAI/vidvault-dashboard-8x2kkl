from django.contrib import admin
from .models import Video


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'views', 'is_featured', 'status', 'created_at']
    list_filter = ['status', 'is_featured', 'category']
    search_fields = ['title', 'description', 'channel_name']
    list_editable = ['is_featured', 'status']
