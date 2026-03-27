import { Link } from 'react-router-dom';
import { Film, MessageCircle, Camera, Code, Mail, ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="navbar-logo" style={{ marginBottom: 0 }}>
                <span>Vid</span>Vault
              </div>
              <p>Your ultimate destination for curated YouTube content. Browse, discover, and save the best videos across multiple categories.</p>
              <div className="footer-social">
                <a href="#" aria-label="YouTube"><Film size={18} /></a>
                <a href="#" aria-label="Twitter"><MessageCircle size={18} /></a>
                <a href="#" aria-label="Instagram"><Camera size={18} /></a>
                <a href="#" aria-label="GitHub"><Code size={18} /></a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Quick Links</h4>
              <Link to="/">Home</Link>
              <Link to="/search">Explore</Link>
              <Link to="/bookmarks">Bookmarks</Link>
              <Link to="/admin/login">Admin</Link>
            </div>

            <div className="footer-col">
              <h4>Categories</h4>
              <Link to="/category/education">Education</Link>
              <Link to="/category/tech">Tech</Link>
              <Link to="/category/programming">Programming</Link>
              <Link to="/category/design">Design</Link>
              <Link to="/category/business">Business</Link>
            </div>

            <div className="footer-col">
              <h4>Contact</h4>
              <a href="mailto:contact@vidvault.com"><Mail size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />contact@vidvault.com</a>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: 8, fontSize: 14 }}>
                Pakistan 🇵🇰
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} VidVault. All rights reserved.</span>
            <span>Built with ❤️ in Pakistan</span>
          </div>
        </div>
      </footer>

      <button
        className={`back-to-top ${showTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <ArrowUp size={20} />
      </button>
    </>
  );
}
