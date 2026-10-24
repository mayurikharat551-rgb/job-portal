import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  User,
  Building2,
  Lock,
  Globe,
  ShieldCheck,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { errMsg } from '../api.js';
import Alert from '../components/Alert.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const initialTab = searchParams.get('role') === 'employer' ? 'employer' : 'student';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setError('');
    if (!validate()) return;
    setBusy(true);
    try {
      const user = await login(form.email, form.password);
      const dest =
        location.state?.from ||
        (user.role === 'student' ? '/applications' : user.role === 'admin' ? '/admin' : '/manage');
      navigate(dest, { replace: true });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  const fillDemo = (email, password = 'password123') => {
    setForm({ email, password });
    setError('');
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        {/* Role Tabs */}
        <div className="auth-role-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'student' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('student');
              setForm({ email: '', password: '' });
            }}
          >
            <User size={15} />
            <span>Candidate / Job Seeker</span>
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'employer' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('employer');
              setForm({ email: '', password: '' });
            }}
          >
            <Building2 size={15} />
            <span>Company / Employer</span>
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {activeTab === 'employer' ? (
              <>
                <Building2 size={22} color="#f97316" />
                <span>Company / Recruiter Login</span>
              </>
            ) : (
              <>
                <User size={22} color="#185adf" />
                <span>Candidate Login</span>
              </>
            )}
          </h2>
          <p className="muted small">
            {activeTab === 'employer'
              ? 'Log in to manage vacancies, view candidate applications & shortlist talent.'
              : 'Log in to apply for vacancies and track your shortlisted status.'}
          </p>
        </div>

        <Alert onClose={() => setError('')}>{error}</Alert>

        <form onSubmit={onSubmit} noValidate>
          <label>
            {activeTab === 'employer' ? 'Company Official Email' : 'Email Address'}
            <input
              name="email"
              type="email"
              placeholder={activeTab === 'employer' ? 'employer@jobportal.com' : 'student@jobportal.com'}
              value={form.email}
              onChange={onChange}
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={onChange}
              autoComplete="current-password"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </label>

          <button
            type="submit"
            className={`btn btn-block ${activeTab === 'employer' ? 'btn-orange' : 'btn-primary'}`}
            disabled={busy}
            style={{
              marginTop: '12px',
              padding: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Lock size={15} />
            <span>
              {busy
                ? 'Verifying Credentials…'
                : activeTab === 'employer'
                ? 'Log in as Employer'
                : 'Log in as Candidate'}
            </span>
          </button>
        </form>

        {/* Quick Demo Credentials Box */}
        <div className="demo-account-callout">
          <div className="title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={14} fill="#f59e0b" color="#f59e0b" />
            <span>1-Click Fill Demo Credentials:</span>
          </div>
          {activeTab === 'employer' ? (
            <div className="row gap-8">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                onClick={() => fillDemo('employer@jobportal.com')}
              >
                <Building2 size={13} />
                <span>TechNova Recruiter</span>
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                onClick={() => fillDemo('google.recruiter@jobportal.com')}
              >
                <Globe size={13} />
                <span>Google Cloud Recruiter</span>
              </button>
            </div>
          ) : (
            <div className="row gap-8">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                onClick={() => fillDemo('student@jobportal.com')}
              >
                <User size={13} />
                <span>Aarav (Shortlisted Candidate)</span>
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                onClick={() => fillDemo('priya@jobportal.com')}
              >
                <User size={13} />
                <span>Priya (Shortlisted Candidate)</span>
              </button>
            </div>
          )}
          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #cbd5e1' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{
                borderColor: '#8b5cf6',
                color: '#6d28d9',
                width: '100%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
              onClick={() => fillDemo('mayurikharat8080@gmail.com', '1234567890')}
            >
              <ShieldCheck size={14} />
              <span>Fill Admin Credentials (mayurikharat8080@gmail.com)</span>
            </button>
          </div>
        </div>

        <p className="muted text-center small" style={{ marginTop: '16px' }}>
          Don't have an account yet?{' '}
          <Link
            to={`/register?role=${activeTab}`}
            style={{
              fontWeight: '700',
              color: activeTab === 'employer' ? 'var(--accent-orange)' : 'var(--primary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>Register as {activeTab === 'employer' ? 'Company' : 'Candidate'} Free</span>
            <ArrowRight size={13} />
          </Link>
        </p>
      </div>
    </div>
  );
}
