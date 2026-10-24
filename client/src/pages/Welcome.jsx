import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Briefcase,
  MapPin,
  Sparkles,
  Building2,
  GraduationCap,
  Star,
  CheckCircle2,
  ArrowRight,
  Code2,
  Palette,
  Server,
  Home as HomeIcon,
  Plus,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api.js';
import JobCard from '../components/JobCard.jsx';

export default function Welcome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [exp, setExp] = useState('');
  const [loc, setLoc] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/jobs', { params: { limit: 6 } })
      .then((res) => setFeaturedJobs(res.data.jobs || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('q', searchTerm.trim());
    if (exp) params.set('experience', exp);
    if (loc.trim()) params.set('location', loc.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  const handleTagClick = (tag) => {
    navigate(`/jobs?q=${encodeURIComponent(tag)}`);
  };

  return (
    <div>
      {/* Hero Header */}
      <section className="hero-wrapper">
        <div className="container hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>#1 Preferred Recruitment Platform</span>
            <span>·</span>
            <span>Over 10,000+ New Vacancies Added</span>
          </div>

          <h1 className="hero-title">
            Find your dream job &amp; get <span>shortlisted</span>
          </h1>
          <p className="hero-sub">
            Connect directly with verified companies, apply with one click, and track your
            application status in real time.
          </p>

          {/* Integrated Search Box */}
          <form className="hero-search-box" onSubmit={handleHeroSearch}>
            <div className="hero-input-field">
              <span className="icon">
                <Search size={18} color="#64748b" />
              </span>
              <input
                type="text"
                placeholder="Enter skills, job title, or company"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="hero-input-field">
              <span className="icon">
                <Briefcase size={18} color="#64748b" />
              </span>
              <select value={exp} onChange={(e) => setExp(e.target.value)}>
                <option value="">Experience (Any)</option>
                <option value="Fresher">Fresher (0-1 Yrs)</option>
                <option value="0-2 Yrs">0-2 Years</option>
                <option value="1-3 Yrs">1-3 Years</option>
                <option value="3-5 Yrs">3-5 Years</option>
              </select>
            </div>

            <div className="hero-input-field">
              <span className="icon">
                <MapPin size={18} color="#64748b" />
              </span>
              <input
                type="text"
                placeholder="Location (e.g. Pune, Bengaluru, Remote)"
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-orange hero-search-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Search size={16} strokeWidth={2.5} />
              <span>Search Jobs</span>
            </button>
          </form>

          {/* Trending search tags */}
          <div className="trending-chips">
            <span className="trending-label">Popular Searches:</span>
            <button
              type="button"
              className="trend-chip"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              onClick={() => handleTagClick('Remote')}
            >
              <HomeIcon size={12} />
              <span>Remote Jobs</span>
            </button>
            <button
              type="button"
              className="trend-chip"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              onClick={() => handleTagClick('React')}
            >
              <Code2 size={12} />
              <span>React Developer</span>
            </button>
            <button
              type="button"
              className="trend-chip"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              onClick={() => handleTagClick('Fresher')}
            >
              <GraduationCap size={12} />
              <span>Freshers Welcome</span>
            </button>
            <button
              type="button"
              className="trend-chip"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              onClick={() => handleTagClick('Node.js')}
            >
              <Server size={12} />
              <span>Node.js Backend</span>
            </button>
            <button
              type="button"
              className="trend-chip"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              onClick={() => handleTagClick('Design')}
            >
              <Palette size={12} />
              <span>Product Design</span>
            </button>
            <button
              type="button"
              className="trend-chip"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              onClick={() => handleTagClick('Internship')}
            >
              <Briefcase size={12} />
              <span>Internships</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Counter Strip */}
      <div className="container">
        <div className="stats-strip">
          <div className="stat-card">
            <div className="num">15,000+</div>
            <div className="desc">Active Vacancies</div>
          </div>
          <div className="stat-card">
            <div className="num">2,400+</div>
            <div className="desc">Verified Companies</div>
          </div>
          <div className="stat-card">
            <div className="num">48 Hours</div>
            <div className="desc">Avg. Shortlist Time</div>
          </div>
          <div className="stat-card">
            <div className="num">98.5%</div>
            <div className="desc">Positive Response Rate</div>
          </div>
        </div>
      </div>

      {/* Dual Portal Spotlight: Candidate vs Company */}
      <section className="container" style={{ marginTop: '56px' }}>
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
            border: '1.5px solid #c7d2fe',
          }}
        >
          <div className="row space-between" style={{ gap: '24px' }}>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <span className="badge badge-orange" style={{ marginBottom: '10px' }}>
                FOR COMPANIES &amp; EMPLOYERS
              </span>
              <h2>Looking to hire top talent for your company?</h2>
              <p className="muted">
                Post vacancies in less than 2 minutes. Receive structured applications with verified skills,
                screen candidate resumes, and shortlist top performers with custom recruiter feedback!
              </p>
              <div className="row gap-12" style={{ marginTop: '16px' }}>
                <Link
                  to="/manage/new"
                  className="btn btn-orange"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={16} strokeWidth={2.5} />
                  <span>Post a Vacancy Now</span>
                </Link>
                <Link
                  to="/login?role=employer"
                  className="btn btn-outline"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Building2 size={16} />
                  <span>Employer / Recruiter Login</span>
                </Link>
              </div>
            </div>

            <div
              style={{
                flex: '0 0 auto',
                background: '#ffffff',
                padding: '20px 24px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: 'var(--shadow-sm)',
                maxWidth: '380px',
              }}
            >
              <h4 style={{ color: '#0f172a', marginBottom: '8px' }}>
                Quick Hiring Workflow
              </h4>
              <ul style={{ paddingLeft: '18px', fontSize: '0.88rem', color: '#475569', lineHeight: '1.8' }}>
                <li>1. Company posts vacancy with CTC &amp; skills</li>
                <li>2. Vacancy appears in candidate search results</li>
                <li>3. Candidates submit 1-click applications</li>
                <li>4. Recruiter reviews &amp; marks <strong>Shortlisted</strong></li>
                <li>5. Candidates track real-time shortlisted status!</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Companies Logo / Badges Bar */}
      <section className="container" style={{ marginTop: '48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h3>Top Companies Hiring on Job Portal</h3>
          <p className="muted small">From world-class tech giants to fast-growing unicorns</p>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          {[
            'Google Cloud India',
            'TechNova Solutions',
            'Zomato Technologies',
            'Infosys Digital',
            'Tata Consultancy Labs',
            'CloudKart eCommerce',
          ].map((c) => (
            <div
              key={c}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '12px 20px',
                fontWeight: '700',
                fontSize: '0.92rem',
                color: '#334155',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Building2 size={16} color="#185adf" />
              <span>{c}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Featured Vacancies */}
      <section className="container" style={{ marginTop: '56px' }}>
        <div className="row space-between" style={{ marginBottom: '24px' }}>
          <div>
            <h2>Explore Latest Vacancies</h2>
            <p className="muted">Handpicked opportunities from top recruiting companies</p>
          </div>
          <Link
            to="/jobs"
            className="btn btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span>View All Vacancies</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="spinner-wrap">
            <div className="spinner"></div>
            <span>Loading vacancies…</span>
          </div>
        ) : (
          <div className="job-cards-grid">
            {featuredJobs.map((j) => (
              <JobCard key={j._id} job={j} />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '36px' }}>
          <Link
            to="/jobs"
            className="btn btn-primary btn-lg"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <span>Browse All 15,000+ Vacancies</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* How it Works / 4 Steps Section */}
      <section className="container" style={{ marginTop: '64px', marginBottom: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2>How Job Portal Connects You</h2>
          <p className="muted">Simple, transparent, and direct recruitment workflow</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div className="card text-center">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Building2 size={28} color="#185adf" />
              </div>
            </div>
            <h3>1. Company Posts Vacancies</h3>
            <p className="muted small">
              Recruiters publish detailed requirements, CTC, experience, and key skills.
            </p>
          </div>

          <div className="card text-center">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Search size={28} color="#2563eb" />
              </div>
            </div>
            <h3>2. User Discovers &amp; Applies</h3>
            <p className="muted small">
              Candidates search by role and location, applying in seconds with their profile.
            </p>
          </div>

          <div className="card text-center" style={{ borderColor: '#10b981', background: '#f0fdf4' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#dcfce7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Star size={28} color="#059669" fill="#10b981" />
              </div>
            </div>
            <h3 style={{ color: '#065f46' }}>3. Company Shortlists</h3>
            <p className="muted small" style={{ color: '#047857' }}>
              Recruiter screens applications and shortlists matching candidates with feedback!
            </p>
          </div>

          <div className="card text-center">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#f0fdf4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle2 size={28} color="#16a34a" />
              </div>
            </div>
            <h3>4. User Checks Status</h3>
            <p className="muted small">
              Real-time progress tracker updates from Applied to Shortlisted &amp; Interview.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
