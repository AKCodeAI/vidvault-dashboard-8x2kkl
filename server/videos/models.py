import json
from django.db import models
from categories.models import Category


class Video(models.Model):
    STATUS_CHOICES = [
        ('published', 'Published'),
        ('draft', 'Draft'),
    ]

    youtube_id = models.CharField(max_length=20, unique=True)
    youtube_url = models.URLField()
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True, default='')
    thumbnail = models.URLField(blank=True, default='')
    duration = models.CharField(max_length=20, blank=True, default='')
    channel_name = models.CharField(max_length=200, blank=True, default='')
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='videos'
    )
    tags = models.TextField(blank=True, default='[]')  # JSON array
    views = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='published')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def get_tags_list(self):
        try:
            return json.loads(self.tags)
        except (json.JSONDecodeError, TypeError):
            return []

    def set_tags_list(self, tags_list):
        self.tags = json.dumps(tags_list)

    def increment_views(self):
        self.views += 1
        self.save(update_fields=['views'])
