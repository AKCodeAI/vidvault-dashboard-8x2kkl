from rest_framework import serializers
from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    video_count = serializers.ReadOnlyField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'description', 'video_count', 'created_at']
        read_only_fields = ['slug', 'created_at']
