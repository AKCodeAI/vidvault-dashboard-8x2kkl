import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
import { formatViews } from '../utils/formatters';
import { useBookmarks } from '../context/BookmarkContext';

export default function HeroCarousel({ videos }) {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  const next = useCallback(() => {
    setCurrent(c => (c + 1) % videos.length);
  }, [videos.length]);

  const prev = useCallback(() => {
    setCurrent(c => (c - 1 + videos.length) % videos.length);
  }, [videos.length]);

  useEffect(() => {
    if (videos.length <= 1) return;
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [next, videos.length]);

  if (!videos.length) return null;

  return (
    <section className="hero" id="hero-carousel">
      {videos.map((video, i) => (
        <div key={video.id} className={`hero-slide ${i === current ? 'active' : ''}`}>
          <img
            className="hero-slide-bg"
            src={video.thumbnail}
            alt={video.title}
            onError={e => { e.target.src = `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`; }}
          />
          <div className="hero-overlay" />
          <div className="hero-content-wrapper container">
            <div className="hero-content">
              <span className="hero-badge">
              {video.category_name || '⭐ Featured'}
            </span>
            <h1 className="hero-title">{video.title}</h1>
            <p className="hero-desc">{video.description}</p>
            <p className="hero-meta">
              {video.channel_name} • {formatViews(video.views)} • {video.duration}
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate(`/video/${video.id}`)}>
                <Play size={18} /> Watch Now
              </button>
              <button
                className="btn btn-ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  isBookmarked(video.id) ? removeBookmark(video.id) : addBookmark(video);
                }}
              >
                <Bookmark size={18} fill={isBookmarked(video.id) ? 'currentColor' : 'none'} />
                {isBookmarked(video.id) ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
          </div>
        </div>
      ))}

      {videos.length > 1 && (
        <>
          <button className="btn-icon" onClick={prev} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 3 }}>
            <ChevronLeft size={20} />
          </button>
          <button className="btn-icon" onClick={next} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 3 }}>
            <ChevronRight size={20} />
          </button>
          <div className="hero-dots">
            {videos.map((_, i) => (
              <button key={i} className={`hero-dot ${i === current ? 'active' : ''}`} onClick={() => setCurrent(i)} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
