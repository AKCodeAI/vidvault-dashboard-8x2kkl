import { Link } from 'react-router-dom';
import { Bookmark, Trash2 } from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';
import VideoCard from '../components/VideoCard';

export default function BookmarksPage() {
  const { bookmarks, clearAll } = useBookmarks();

  document.title = 'Bookmarks — VidVault';

  return (
    <div className="page" id="bookmarks-page">
      <section className="page-section">
        <div className="container">
          <div className="bookmarks-header">
            <div>
              <h1>My Bookmarks</h1>
              <span className="badge badge-primary" style={{ marginTop: 8 }}>
                {bookmarks.length} saved
              </span>
            </div>
            {bookmarks.length > 0 && (
              <button className="btn btn-secondary" style={{ color: 'var(--color-error)' }}
                onClick={() => { if (confirm('Clear all bookmarks?')) clearAll(); }}>
                <Trash2 size={16} /> Clear All
              </button>
            )}
          </div>

          {bookmarks.length > 0 ? (
            <div className="video-grid">
              {bookmarks.map((video, i) => (
                <VideoCard key={video.id} video={video} index={i} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Bookmark size={48} />
              <h3>No saved videos yet</h3>
              <p>Click the bookmark icon on any video to save it here</p>
              <Link to="/" className="btn btn-primary">Browse Videos</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
