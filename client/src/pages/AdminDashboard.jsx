import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Film, FolderOpen, Plus, Trash2, Edit, LogOut } from 'lucide-react';
import { getStats, getVideos, deleteVideo, logoutAdmin, isLoggedIn } from '../utils/api';
import { formatViews, timeAgo } from '../utils/formatters';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) { navigate('/admin/login'); return; }
    document.title = 'Admin Dashboard — VidVault';
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      getStats().catch(() => null),
      getVideos('page_size=50').catch(() => ({ results: [] })),
    ]).then(([s, v]) => {
      setStats(s);
      setVideos(v.results || v);
      setLoading(false);
    });
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deleteVideo(id);
      setVideos(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;

  return (
    <div className="page" id="admin-dashboard">
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <Link to="/admin" className="admin-sidebar-link active">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/admin/add" className="admin-sidebar-link">
            <Plus size={18} /> Add Video
          </Link>
          <Link to="/" className="admin-sidebar-link">
            <Film size={18} /> View Site
          </Link>
          <button className="admin-sidebar-link" onClick={handleLogout} style={{ width: '100%', textAlign: 'left' }}>
            <LogOut size={18} /> Logout
          </button>
        </aside>

        {/* Content */}
        <main className="admin-content">
          <div className="admin-header">
            <h1>Dashboard</h1>
            <Link to="/admin/add" className="btn btn-primary">
              <Plus size={18} /> Add Video
            </Link>
          </div>

          {/* Stats */}
          {stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <p className="stat-card-label">Total Videos</p>
                <p className="stat-card-value">{stats.total_videos}</p>
              </div>
              <div className="stat-card" style={{ borderLeftColor: 'var(--color-success)' }}>
                <p className="stat-card-label">Published</p>
                <p className="stat-card-value">{stats.published_videos}</p>
              </div>
              <div className="stat-card" style={{ borderLeftColor: 'var(--color-secondary)' }}>
                <p className="stat-card-label">Total Views</p>
                <p className="stat-card-value">{formatViews(stats.total_views)}</p>
              </div>
              <div className="stat-card" style={{ borderLeftColor: 'var(--color-warning)' }}>
                <p className="stat-card-label">Categories</p>
                <p className="stat-card-value">{stats.total_categories}</p>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Views</th>
                  <th>Status</th>
                  <th>Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map(video => (
                  <tr key={video.id}>
                    <td>
                      <div className="admin-table-thumb">
                        <img src={video.thumbnail} alt="" loading="lazy"
                          onError={e => { e.target.src = `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`; }} />
                      </div>
                    </td>
                    <td style={{ maxWidth: 260 }}>
                      <strong style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {video.title}
                      </strong>
                    </td>
                    <td><span className="badge badge-secondary">{video.category_name || '—'}</span></td>
                    <td>{formatViews(video.views)}</td>
                    <td>
                      <span className={`badge ${video.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                        {video.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{timeAgo(video.created_at)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link to={`/admin/edit/${video.id}`} className="btn-icon" title="Edit">
                          <Edit size={16} />
                        </Link>
                        <button className="btn-icon" title="Delete" style={{ color: 'var(--color-error)' }}
                          onClick={() => handleDelete(video.id, video.title)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
