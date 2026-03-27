import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import VideoCard from '../components/VideoCard';
import VideoCardSkeleton from '../components/VideoCardSkeleton';
import { searchVideos, getCategories } from '../utils/api';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState(searchParams.get('sort') || 'latest');
  const [category, setCategory] = useState(searchParams.get('category') || '');

  useEffect(() => {
    document.title = query ? `Search: ${query} — VidVault` : 'Explore — VidVault';
    getCategories().then(data => setCategories(data.results || data)).catch(() => {});
  }, []);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const s = searchParams.get('sort') || 'latest';
    const c = searchParams.get('category') || '';
    setQuery(q);
    setSort(s);
    setCategory(c);
    fetchResults(q, s, c, 1);
  }, [searchParams]);

  const fetchResults = (q, s, c, p) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (s) params.set('sort', s);
    if (c) params.set('category', c);
    params.set('page', p);
    params.set('page_size', 20);

    searchVideos(params.toString())
      .then(data => {
        if (p === 1) setResults(data.results);
        else setResults(prev => [...prev, ...data.results]);
        setTotal(data.total);
        setPage(p);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (sort) params.set('sort', sort);
    if (category) params.set('category', category);
    setSearchParams(params);
  };

  const handleFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  const popularTags = ['Python', 'JavaScript', 'Web Development', 'Design', 'Freelancing', 'React', 'Django'];

  return (
    <div className="page" id="search-page">
      {/* Search Hero */}
      <section className="search-hero">
        <div className="container">
          <h1>Explore Videos</h1>
          <form className="search-input-lg" onSubmit={handleSearch}>
            <Search size={22} className="icon" />
            <input
              type="text"
              placeholder="Search videos, categories, topics..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              id="search-main"
            />
          </form>
          <div className="search-tags">
            {popularTags.map(tag => (
              <button key={tag} type="button" className="search-tag"
                onClick={() => { setQuery(tag); handleFilter('q', tag); }}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filters + Results */}
      <section className="page-section">
        <div className="container">
          <div className="filter-bar">
            <select className="filter-select" value={category}
              onChange={e => handleFilter('category', e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.slug}>{cat.icon} {cat.name}</option>
              ))}
            </select>
            <select className="filter-select" value={sort}
              onChange={e => handleFilter('sort', e.target.value)}>
              <option value="latest">Newest First</option>
              <option value="views">Most Viewed</option>
              <option value="title">A-Z</option>
            </select>
          </div>

          <p className="results-header">
            {total > 0 ? `Showing ${results.length} of ${total} results` : (loading ? 'Searching...' : 'No results found')}
            {query && ` for "${query}"`}
          </p>

          <div className="video-grid">
            {loading && results.length === 0 ? (
              <VideoCardSkeleton count={8} />
            ) : (
              results.map((video, i) => (
                <VideoCard key={video.id} video={video} index={i} />
              ))
            )}
          </div>

          {results.length === 0 && !loading && (
            <div className="empty-state">
              <Search size={48} />
              <h3>No videos found</h3>
              <p>Try different keywords or browse categories</p>
              <Link to="/" className="btn btn-primary">Browse Home</Link>
            </div>
          )}

          {results.length < total && (
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <button className="btn btn-secondary" onClick={() => fetchResults(query, sort, category, page + 1)}>
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
