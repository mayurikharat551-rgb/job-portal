import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Briefcase,
  Search,
  FileText,
  Building2,
  Plus,
  ShieldCheck,
  User,
  LogOut,
  Zap,
  Star,
  Globe,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api.js';

export default function Navbar() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [shortlistedCount, setShortlistedCount] = useState(0);

  // Fetch candidate's shortlisted applications for live navbar badge
  useEffect(() => {
    if (user?.role === 'student') {
      api
        .get('/applications/me')
        .then((res) => {
          const shortlisted = (res.data || []).filter((a) => a.status === 'Shortlisted').length;
          setShortlistedCount(shortlisted);
        })
        .catch(() => {});
    } else {
      setShortlistedCount(0);
    }
  }, [user, location.pathname]);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  const close = () => setOpen(false);

  const quickLogin = async (email, password = 'password123') => {
    try {
      const u = await login(email, password);
      close();
      if (u.role === 'student') navigate('/applications');
      else if (u.role === 'employer') navigate('/manage');
      else if (u.role === 'admin') navigate('/admin');
    } catch (e) {
      console.error(e);
    }
  };

  const isEmployer = user && (user.role === 'employer' || user.role === 'admin');

  return (
    <>
      {/* Quick Demo Switcher Bar */}
      <div className="demo-bar">
        <div className="container demo-bar-inner">
          <div className="row gap-8">
            <span
              className="demo-tag"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <Zap size={12} fill="currentColor" />
              <span>1-Click Role Switcher</span>
            </span>
            <span className="small muted">Instant test logins:</span>
          </div>
          <div className="demo-buttons">
            <button
              className={`demo-btn ${user?.email === 'student@jobportal.com' ? 'active' : ''}`}
              onClick={() => quickLogin('student@jobportal.com')}
              title="Login as Aarav Sharma (Candidate with Shortlisted status)"
            >
              <User size={12} />
              <span>Aarav (Shortlisted Candidate)</span>
            </button>
            <button
              className={`demo-btn ${user?.email === 'employer@jobportal.com' ? 'active' : ''}`}
              onClick={() => quickLogin('employer@jobportal.com')}
              title="Login as TechNova Recruiter (Post vacancies & Shortlist candidates)"
            >
              <Building2 size={12} />
              <span>TechNova (Recruiter)</span>
            </button>
            <button
              className={`demo-btn ${user?.email === 'google.recruiter@jobportal.com' ? 'active' : ''}`}
              onClick={() => quickLogin('google.recruiter@jobportal.com')}
              title="Login as Google Cloud Recruiter"
            >
              <Globe size={12} />
              <span>Google Cloud (Recruiter)</span>
            </button>
            <button
              className={`demo-btn ${user?.email === 'mayurikharat8080@gmail.com' ? 'active' : ''}`}
              onClick={() => quickLogin('mayurikharat8080@gmail.com', '1234567890')}
              title="Login as Secured Super Admin (Mayuri Kharat)"
            >
              <ShieldCheck size={12} />
              <span>Mayuri (Admin)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header / Navbar */}
      <header className="navbar">
        <div className="container nav-inner">
          <div className="brand-group">
            <Link to="/" className="brand" onClick={close}>
              <span className="brand-mark" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Briefcase size={16} strokeWidth={2.5} />
                <span>JP</span>
              </span>
              <span>job portal</span>
            </Link>
          </div>

          <button
            className="nav-toggle"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            ☰
          </button>

          <nav className={`nav-links ${open ? 'open' : ''}`}>
            <NavLink to="/jobs" onClick={close}>
              <Search size={15} />
              <span>Browse Vacancies</span>
            </NavLink>

            {user?.role === 'student' && (
              <NavLink to="/applications" onClick={close}>
                <FileText size={15} />
                <span>My Applications</span>
                {shortlistedCount > 0 ? (
                  <span
                    className="nav-badge-pill"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    title={`${shortlistedCount} Shortlisted!`}
                  >
                    <Star size={11} fill="currentColor" />
                    <span>{shortlistedCount} Shortlisted</span>
                  </span>
                ) : null}
              </NavLink>
            )}

            {isEmployer && (
              <>
                <NavLink to="/manage" onClick={close}>
                  <Building2 size={15} />
                  <span>Recruiter Zone</span>
                </NavLink>
                <Link
                  to="/manage/new"
                  className="btn btn-orange btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  onClick={close}
                >
                  <Plus size={14} strokeWidth={2.5} />
                  <span>Post Vacancy</span>
                </Link>
              </>
            )}

            {user?.role === 'admin' && (
              <NavLink to="/admin" onClick={close}>
                <ShieldCheck size={15} />
                <span>Admin Panel</span>
              </NavLink>
            )}

            {user ? (
              <div className="row gap-8">
                <NavLink to="/profile" className="user-profile-badge" onClick={close}>
                  <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                  <span>{user.name.split(' ')[0]}</span>
                  <span className="small muted">
                    ({user.role === 'employer' ? user.companyName || 'Recruiter' : user.role === 'admin' ? 'Admin' : 'Candidate'})
                  </span>
                </NavLink>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  onClick={handleLogout}
                >
                  <LogOut size={13} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="row gap-8">
                <Link to="/login?role=student" className="btn btn-outline btn-sm" onClick={close}>
                  Candidate Login
                </Link>
                <Link
                  to="/login?role=employer"
                  className="recruiter-pill-btn"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  onClick={close}
                >
                  <Building2 size={14} />
                  <span>Company / Employer Login</span>
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={close}>
                  Register Free
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
