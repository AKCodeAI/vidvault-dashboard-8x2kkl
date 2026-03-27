import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader, Wand2 } from 'lucide-react';
import { fetchYouTubeData, createVideo, updateVideo, getVideo, getCategories, isLoggedIn } from '../utils/api';

export default function AdminAddVideo() {
  const { id } = useParams(); // edit mode if id exists
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [form, setForm] = useState({
    youtube_id: '', youtube_url: '', title: '', description: '',
    thumbnail: '', duration: '', channel_name: '',
    category: '', tags: '[]', is_featured: false, status: 'published',
  });

  useEffect(() => {
    if (!isLoggedIn()) { navigate('/admin/login'); return; }
    document.title = id ? 'Edit Video — VidVault' : 'Add Video — VidVault';
    getCategories().then(data => setCategories(data.results || data)).catch(() => {});

    if (id) {
      getVideo(id).then(video => {
        setForm({
          youtube_id: video.youtube_id, youtube_url: video.youtube_url,
          title: video.title, description: video.description || '',
          thumbnail: video.thumbnail || '', duration: video.duration || '',
          channel_name: video.channel_name || '',
          category: video.category || '', tags: video.tags || '[]',
          is_featured: video.is_featured, status: video.status,
        });
        setYoutubeUrl(video.youtube_url);
      }).catch(() => alert('Video not found'));
    }
  }, [id]);

  const handleFetch = async () => {
    if (!youtubeUrl) return;
    setFetching(true);
    try {
      const data = await fetchYouTubeData(youtubeUrl);
      setForm(prev => ({
        ...prev,
        youtube_id: data.youtube_id,
        youtube_url: data.youtube_url,
        title: data.title || prev.title,
        channel_name: data.channel_name || prev.channel_name,
        thumbnail: data.thumbnail || prev.thumbnail,
      }));
    } catch (err) {
      alert('Failed to fetch: ' + err.message);
    }
    setFetching(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.youtube_id || !form.title) {
      alert('YouTube URL and title are required');
      return;
    }
    setSaving(true);
    try {
      const data = { ...form, category: form.category || null };
      if (id) {
        await updateVideo(id, data);
      } else {
        await createVideo(data);
      }
      navigate('/admin');
    } catch (err) {
      alert('Failed to save: ' + err.message);
    }
    setSaving(false);
  };

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="page" id="admin-add-video">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <Link to="/admin" className="admin-sidebar-link">
            <ArrowLeft size={18} /> Back to Dashboard
          </Link>
        </aside>

        <main className="admin-content">
          <div className="admin-header">
            <h1>{id ? 'Edit Video' : 'Add New Video'}</h1>
          </div>

          <form className="admin-form" onSubmit={handleSubmit}>
            {/* YouTube URL */}
            <div className="form-group">
              <label>YouTube Video URL</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="form-input" type="url" placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} id="video-url" />
                <button type="button" className="btn btn-primary" onClick={handleFetch} disabled={fetching}
                  style={{ minWidth: 120 }}>
                  {fetching ? <Loader size={16} className="spin" /> : <Wand2 size={16} />}
                  {fetching ? 'Fetching...' : 'Auto-Fetch'}
                </button>
              </div>
            </div>

            {/* Preview */}
            {form.youtube_id && (
              <div className="form-group">
                <label>Preview</label>
                <div style={{ width: 480, maxWidth: '100%', aspectRatio: '16/9', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#000' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${form.youtube_id}`}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    title="Preview"
                  />
                </div>
              </div>
            )}

            {/* Title */}
            <div className="form-group">
              <label>Title</label>
              <input className="form-input" type="text" placeholder="Video title"
                value={form.title} onChange={e => updateForm('title', e.target.value)} required id="video-title" />
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-input" placeholder="Video description"
                value={form.description} onChange={e => updateForm('description', e.target.value)} id="video-desc" />
            </div>

            {/* Row: Category + Duration */}
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select className="form-input" value={form.category}
                  onChange={e => updateForm('category', e.target.value)} id="video-category">
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input className="form-input" type="text" placeholder="e.g. 1:30:00"
                  value={form.duration} onChange={e => updateForm('duration', e.target.value)} id="video-duration" />
              </div>
            </div>

            {/* Row: Channel + Tags */}
            <div className="form-row">
              <div className="form-group">
                <label>Channel Name</label>
                <input className="form-input" type="text" placeholder="Channel name"
                  value={form.channel_name} onChange={e => updateForm('channel_name', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Tags (JSON array)</label>
                <input className="form-input" type="text" placeholder='["tag1", "tag2"]'
                  value={form.tags} onChange={e => updateForm('tags', e.target.value)} />
              </div>
            </div>

            {/* Thumbnail */}
            <div className="form-group">
              <label>Thumbnail URL</label>
              <input className="form-input" type="url" placeholder="Auto-fetched from YouTube"
                value={form.thumbnail} onChange={e => updateForm('thumbnail', e.target.value)} />
              {form.thumbnail && (
                <img src={form.thumbnail} alt="Thumbnail preview"
                  style={{ width: 200, borderRadius: 'var(--radius-sm)', marginTop: 8 }}
                  onError={e => { e.target.style.display = 'none'; }} />
              )}
            </div>

            {/* Toggles */}
            <div className="form-row">
              <div className="form-group">
                <label>Status</label>
                <select className="form-input" value={form.status}
                  onChange={e => updateForm('status', e.target.value)}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.is_featured}
                    onChange={e => updateForm('is_featured', e.target.checked)} />
                  Featured (show in hero carousel)
                </label>
              </div>
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={saving} id="video-submit">
                {saving ? 'Saving...' : (id ? 'Update Video' : 'Publish Video')}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin')}>
                Cancel
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
