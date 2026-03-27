import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Sun, Moon, Bookmark, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { isLoggedIn } from '../utils/api';

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/search', label: 'Explore' },
    { to: '/bookmarks', label: 'Bookmarks' },
  ];

  return (
    <nav className="navbar" id="main-nav">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span>Vid</span>Vault
        </Link>

        <ul className="navbar-links">
          {navLinks.map(link => (
            <li key={link.to}>
              <NavLink to={link.to} end={link.to === '/'}>
                {link.label}
              </NavLink>
            </li>
          ))}
          {isLoggedIn() && (
            <li>
              <NavLink to="/admin">
                <Shield size={14} style={{ marginRight: 4 }} />
                Admin
              </NavLink>
            </li>
          )}
        </ul>

        <div className="navbar-actions">
          <form className="navbar-search" onSubmit={handleSearch}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              id="nav-search"
            />
          </form>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme" id="theme-toggle">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="mobile-nav">
          {navLinks.map(link => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={() => setMobileOpen(false)}>
              {link.label}
            </NavLink>
          ))}
          {isLoggedIn() && (
            <NavLink to="/admin" onClick={() => setMobileOpen(false)}>Admin Panel</NavLink>
          )}
        </div>
      )}
    </nav>
  );
}
