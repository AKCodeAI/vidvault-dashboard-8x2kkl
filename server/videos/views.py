from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q
from .models import Video
from .serializers import VideoSerializer, VideoListSerializer
from .youtube_utils import fetch_youtube_metadata


class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.select_related('category').all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'tags', 'channel_name']
    ordering_fields = ['created_at', 'views', 'title']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return VideoListSerializer
        return VideoSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        qs = super().get_queryset()

        # Filter by status for non-admin
        if not self.request.user.is_authenticated:
            qs = qs.filter(status='published')

        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category__slug=category)

        # Filter by tag
        tag = self.request.query_params.get('tag')
        if tag:
            qs = qs.filter(tags__icontains=tag)

        # Filter featured
        featured = self.request.query_params.get('featured')
        if featured == 'true':
            qs = qs.filter(is_featured=True)

        return qs

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured videos for hero carousel."""
        videos = Video.objects.filter(
            is_featured=True, status='published'
        ).select_related('category')[:5]
        serializer = VideoListSerializer(videos, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def trending(self, request):
        """Get trending videos (most viewed)."""
        videos = Video.objects.filter(
            status='published'
        ).select_related('category').order_by('-views')[:12]
        serializer = VideoListSerializer(videos, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def latest(self, request):
        """Get latest videos."""
        videos = Video.objects.filter(
            status='published'
        ).select_related('category').order_by('-created_at')[:20]
        serializer = VideoListSerializer(videos, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def increment_view(self, request, pk=None):
        """Increment view count."""
        video = self.get_object()
        video.increment_views()
        return Response({'views': video.views})

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Get videos grouped by category (for homepage sections)."""
        from categories.models import Category
        categories = Category.objects.all()
        result = []
        for cat in categories:
            videos = Video.objects.filter(
                category=cat, status='published'
            ).select_related('category').order_by('-created_at')[:8]
            if videos.exists():
                result.append({
                    'category': {
                        'id': cat.id,
                        'name': cat.name,
                        'slug': cat.slug,
                        'icon': cat.icon,
                    },
                    'videos': VideoListSerializer(videos, many=True).data
                })
        return Response(result)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Dashboard stats for admin."""
        from django.db.models import Sum
        from categories.models import Category

        total_videos = Video.objects.count()
        published = Video.objects.filter(status='published').count()
        total_views = Video.objects.aggregate(Sum('views'))['views__sum'] or 0
        total_categories = Category.objects.count()
        featured = Video.objects.filter(is_featured=True).count()

        return Response({
            'total_videos': total_videos,
            'published_videos': published,
            'total_views': total_views,
            'total_categories': total_categories,
            'featured_videos': featured,
        })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def youtube_fetch(request):
    """Auto-fetch YouTube video metadata from URL."""
    url = request.data.get('url', '')
    if not url:
        return Response(
            {'error': 'YouTube URL is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    metadata = fetch_youtube_metadata(url)
    if not metadata:
        return Response(
            {'error': 'Could not extract video ID from URL'},
            status=status.HTTP_400_BAD_REQUEST
        )

    return Response(metadata)


@api_view(['GET'])
def search_videos(request):
    """Full-text search for videos."""
    query = request.query_params.get('q', '').strip()
    category = request.query_params.get('category', '')
    sort_by = request.query_params.get('sort', 'relevance')
    page = int(request.query_params.get('page', 1))
    page_size = int(request.query_params.get('page_size', 20))

    qs = Video.objects.filter(status='published').select_related('category')

    if query:
        qs = qs.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query) |
            Q(tags__icontains=query) |
            Q(channel_name__icontains=query)
        )

    if category:
        qs = qs.filter(category__slug=category)

    # Sorting
    if sort_by == 'latest':
        qs = qs.order_by('-created_at')
    elif sort_by == 'views':
        qs = qs.order_by('-views')
    elif sort_by == 'title':
        qs = qs.order_by('title')
    else:
        qs = qs.order_by('-created_at')

    total = qs.count()
    start = (page - 1) * page_size
    end = start + page_size
    videos = qs[start:end]

    serializer = VideoListSerializer(videos, many=True)
    return Response({
        'results': serializer.data,
        'total': total,
        'page': page,
        'page_size': page_size,
        'total_pages': (total + page_size - 1) // page_size,
    })
