import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { loginAdmin } from '../utils/api';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  document.title = 'Admin Login — VidVault';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginAdmin(username, password);
      navigate('/admin');
    } catch (err) {
      setError('Invalid username or password');
    }
    setLoading(false);
  };

  return (
    <div className="login-page" id="admin-login">
      <div className="login-card animate-in">
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Lock size={24} color="#fff" />
          </div>
        </div>
        <h1>Admin Login</h1>
        <p>Sign in to manage your video portal</p>

        {error && (
          <div className="badge badge-error" style={{ display: 'block', textAlign: 'center', padding: '10px 16px', marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input className="form-input" type="text" placeholder="Enter username"
              value={username} onChange={e => setUsername(e.target.value)} required id="login-username" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-input" type="password" placeholder="Enter password"
              value={password} onChange={e => setPassword(e.target.value)} required id="login-password" />
          </div>
          <button className="btn btn-primary btn-lg" type="submit" style={{ width: '100%' }} disabled={loading} id="login-submit">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
