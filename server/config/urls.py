from django.urls import path, include, re_path
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from videos.views import VideoViewSet, youtube_fetch, search_videos
from categories.views import CategoryViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r'videos', VideoViewSet, basename='video')
router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/search/', search_videos, name='search'),
    path('api/youtube/fetch/', youtube_fetch, name='youtube-fetch'),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token-obtain'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    
    # Catch-all route to serve the React single-page application
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]
