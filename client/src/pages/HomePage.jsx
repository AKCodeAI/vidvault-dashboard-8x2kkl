import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Zap, Sparkles } from 'lucide-react';
import HeroCarousel from '../components/HeroCarousel';
import VideoCard from '../components/VideoCard';
import VideoCardSkeleton from '../components/VideoCardSkeleton';
import { getFeaturedVideos, getTrendingVideos, getLatestVideos, getVideosByCategory } from '../utils/api';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [categoryVideos, setCategoryVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'VidVault — Premium Video Portal';
    Promise.all([
      getFeaturedVideos().catch(() => []),
      getTrendingVideos().catch(() => []),
      getLatestVideos().catch(() => []),
      getVideosByCategory().catch(() => []),
    ]).then(([feat, trend, lat, cats]) => {
      setFeatured(feat);
      setTrending(trend);
      setLatest(lat);
      setCategoryVideos(cats);
      setLoading(false);
    });
  }, []);

  return (
    <div className="page" id="home-page">
      {/* Hero */}
      {featured.length > 0 && <HeroCarousel videos={featured} />}

      {/* Trending */}
      <section className="page-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title"><TrendingUp size={28} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--color-warning)' }} />Trending Now</h2>
            <Link to="/search?sort=views" className="section-link">See All <ArrowRight size={16} /></Link>
          </div>
          <div className="horizontal-scroll">
            {loading ? <VideoCardSkeleton count={4} /> :
              trending.map((video, i) => (
                <div key={video.id} style={{ width: 280 }}>
                  <VideoCard video={video} index={i} />
                </div>
              ))
            }
          </div>
        </div>
      </section>

      {/* Latest */}
      <section className="page-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title"><Zap size={28} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--color-secondary)' }} />Latest Uploads</h2>
            <Link to="/search?sort=latest" className="section-link">See All <ArrowRight size={16} /></Link>
          </div>
          <div className="video-grid">
            {loading ? <VideoCardSkeleton count={8} /> :
              latest.slice(0, 8).map((video, i) => (
                <VideoCard key={video.id} video={video} index={i} />
              ))
            }
          </div>
        </div>
      </section>

      {/* Category Sections */}
      {categoryVideos.map((catGroup, ci) => (
        <section className="page-section" key={catGroup.category.id}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                <span style={{ marginRight: 8 }}>{catGroup.category.icon}</span>
                {catGroup.category.name}
              </h2>
              <Link to={`/category/${catGroup.category.slug}`} className="section-link">
                Explore All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="horizontal-scroll">
              {catGroup.videos.map((video, i) => (
                <div key={video.id} style={{ width: 280 }}>
                  <VideoCard video={video} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-row">
            <div className="stats-item animate-in">
              <Sparkles size={28} style={{ color: 'var(--color-primary)', marginBottom: 8 }} />
              <h3>500+</h3>
              <p>Videos</p>
            </div>
            <div className="stats-item animate-in stagger-1">
              <h3>8+</h3>
              <p>Categories</p>
            </div>
            <div className="stats-item animate-in stagger-2">
              <h3>100K+</h3>
              <p>Monthly Viewers</p>
            </div>
            <div className="stats-item animate-in stagger-3">
              <h3>Daily</h3>
              <p>Updates</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
