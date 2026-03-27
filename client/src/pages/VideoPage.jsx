import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Share2, Bookmark, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { getVideo, getVideos, incrementView } from '../utils/api';
import { formatViews, timeAgo } from '../utils/formatters';
import { useBookmarks } from '../context/BookmarkContext';
import VideoCardSkeleton from '../components/VideoCardSkeleton';

export default function VideoPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDesc, setShowDesc] = useState(false);
  const [liked, setLiked] = useState(false);
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    Promise.all([
      getVideo(id),
      getVideos('page_size=8'),
    ]).then(([vid, rel]) => {
      setVideo(vid);
      document.title = `${vid.title} — VidVault`;
      const relVideos = (rel.results || rel).filter(v => v.id !== vid.id);
      setRelated(relVideos.slice(0, 8));
      setLoading(false);
      incrementView(id).catch(() => {});
    }).catch(() => setLoading(false));
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: video.title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied!');
    }
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;
  if (!video) return <div className="page"><div className="container"><h2>Video not found</h2></div></div>;

  const saved = isBookmarked(video.id);
  const tags = video.tags_list || [];

  return (
    <div className="page" id="video-page">
      <div className="video-page-layout">
        <div>
          {/* Player */}
          <div className="video-player-container">
            <iframe
              src={`https://www.youtube.com/embed/${video.youtube_id}?autoplay=1&rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Info */}
          <div className="video-info">
            <h1>{video.title}</h1>
            <p className="video-info-meta">
              {formatViews(video.views)} • {video.duration} • {timeAgo(video.created_at)}
            </p>

            {/* Actions */}
            <div className="video-actions">
              <button className={liked ? 'active' : ''} onClick={() => setLiked(!liked)}>
                <ThumbsUp size={18} /> {liked ? 'Liked' : 'Like'}
              </button>
              <button onClick={handleShare}>
                <Share2 size={18} /> Share
              </button>
              <button
                className={saved ? 'active' : ''}
                onClick={() => saved ? removeBookmark(video.id) : addBookmark(video)}
              >
                <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
                {saved ? 'Saved' : 'Save'}
              </button>
              <a href={video.youtube_url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '8px 16px', borderRadius: 'var(--radius-full)', background: 'var(--color-surface-elevated)', color: 'var(--color-text-secondary)', fontSize: 14, fontWeight: 500 }}>
                <ExternalLink size={16} /> YouTube
              </a>
            </div>

            {/* Channel */}
            {video.channel_name && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 0', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 }}>
                  {video.channel_name[0]}
                </div>
                <div>
                  <strong style={{ fontSize: 15 }}>{video.channel_name}</strong>
                  {video.category_detail && (
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                      {video.category_detail.icon} {video.category_detail.name}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {video.description && (
              <div className="video-description">
                <div style={{
                  display: '-webkit-box',
                  WebkitLineClamp: showDesc ? 'unset' : 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: showDesc ? 'visible' : 'hidden',
                }}>
                  {video.description}
                </div>
                <button
                  onClick={() => setShowDesc(!showDesc)}
                  style={{ color: 'var(--color-primary)', fontWeight: 500, marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  {showDesc ? <><ChevronUp size={16} /> Show less</> : <><ChevronDown size={16} /> Show more</>}
                </button>
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="video-tags">
                {tags.map(tag => (
                  <Link key={tag} to={`/search?q=${tag}`} className="badge badge-primary">{tag}</Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        <aside className="related-sidebar">
          <h3>Related Videos</h3>
          {related.map(rv => (
            <Link key={rv.id} to={`/video/${rv.id}`} className="related-card">
              <div className="related-card-thumb">
                <img src={rv.thumbnail} alt={rv.title} loading="lazy"
                  onError={e => { e.target.src = `https://img.youtube.com/vi/${rv.youtube_id}/hqdefault.jpg`; }}
                />
              </div>
              <div className="related-card-info">
                <h4>{rv.title}</h4>
                <p>{rv.channel_name}</p>
                <p>{formatViews(rv.views)} • {rv.duration}</p>
              </div>
            </Link>
          ))}
        </aside>
      </div>
    </div>
  );
}
