import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import VideoCardSkeleton from '../components/VideoCardSkeleton';
import { searchVideos, getCategories } from '../utils/api';

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    
    getCategories().then(data => {
      const cats = data.results || data;
      const cat = cats.find(c => c.slug === slug);
      if (cat) {
        setCategory(cat);
        document.title = `${cat.name} — VidVault`;
      }
    }).catch(() => {});

    searchVideos(`category=${slug}&page=1&page_size=20`)
      .then(data => {
        setVideos(data.results);
        setTotal(data.total);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const loadMore = () => {
    const nextPage = page + 1;
    searchVideos(`category=${slug}&page=${nextPage}&page_size=20`)
      .then(data => {
        setVideos(prev => [...prev, ...data.results]);
        setPage(nextPage);
      });
  };

  return (
    <div className="page" id="category-page">
      {/* Category Hero */}
      <section className="category-hero">
        <div className="container">
          <div className="category-hero-inner">
            {category && (
              <>
                <span className="category-icon">{category.icon}</span>
                <div>
                  <h1>{category.name}</h1>
                  <p>{category.description}</p>
                  <span className="badge badge-primary" style={{ marginTop: 8 }}>
                    {category.video_count || total} Videos
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="page-section">
        <div className="container">
          <div className="video-grid">
            {loading ? <VideoCardSkeleton count={8} /> :
              videos.map((video, i) => (
                <VideoCard key={video.id} video={video} index={i} />
              ))
            }
          </div>

          {videos.length === 0 && !loading && (
            <div className="empty-state">
              <h3>No videos in this category yet</h3>
              <p>Check back later or browse other categories</p>
              <Link to="/" className="btn btn-primary">Go Home</Link>
            </div>
          )}

          {videos.length < total && (
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <button className="btn btn-secondary" onClick={loadMore}>Load More</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
