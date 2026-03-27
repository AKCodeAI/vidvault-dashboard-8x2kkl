import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { formatViews, timeAgo } from '../utils/formatters';

export default function VideoCard({ video, index = 0 }) {
  const navigate = useNavigate();

  return (
    <article
      className="video-card animate-in"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={() => navigate(`/video/${video.id}`)}
      id={`video-card-${video.id}`}
    >
      <div className="video-card-thumbnail">
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          onError={e => { e.target.src = `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`; }}
        />
        <div className="video-card-play">
          <div className="video-card-play-icon">
            <Play size={22} fill="currentColor" />
          </div>
        </div>
        {video.duration && (
          <span className="video-card-duration">{video.duration}</span>
        )}
      </div>
      <div className="video-card-body">
        <h3 className="video-card-title">{video.title}</h3>
        <div className="video-card-meta">
          <span className="channel">{video.channel_name || 'Unknown Channel'}</span>
          <span>•</span>
          <span>{formatViews(video.views)}</span>
          <span>•</span>
          <span>{timeAgo(video.created_at)}</span>
        </div>
        {video.category_name && (
          <span className="video-card-category">{video.category_name}</span>
        )}
      </div>
    </article>
  );
}
