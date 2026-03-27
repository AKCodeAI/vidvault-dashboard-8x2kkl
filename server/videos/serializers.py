from rest_framework import serializers
from .models import Video
from categories.serializers import CategorySerializer


class VideoSerializer(serializers.ModelSerializer):
    category_detail = CategorySerializer(source='category', read_only=True)
    tags_list = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = [
            'id', 'youtube_id', 'youtube_url', 'title', 'description',
            'thumbnail', 'duration', 'channel_name', 'category', 'category_detail',
            'tags', 'tags_list', 'views', 'is_featured', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'views']

    def get_tags_list(self, obj):
        return obj.get_tags_list()


class VideoListSerializer(serializers.ModelSerializer):
    """Lighter serializer for list views."""
    category_name = serializers.CharField(source='category.name', read_only=True, default='Uncategorized')
    tags_list = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = [
            'id', 'youtube_id', 'title', 'thumbnail', 'duration',
            'channel_name', 'category', 'category_name', 'tags_list',
            'views', 'is_featured', 'status', 'created_at'
        ]

    def get_tags_list(self, obj):
        return obj.get_tags_list()
