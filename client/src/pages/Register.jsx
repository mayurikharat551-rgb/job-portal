import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  User,
  Building2,
  Lock,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { errMsg } from '../api.js';
import Alert from '../components/Alert.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole = searchParams.get('role') === 'employer' ? 'employer' : 'student';

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: initialRole,
    companyName: '',
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const setRoleTab = (r) => {
    setForm({ ...form, role: r });
    setErrors({});
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.role === 'employer' && !form.companyName.trim()) {
      e.companyName = 'Company name is required for recruiter accounts';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setError('');
    if (!validate()) return;
    setBusy(true);
    try {
      const user = await register(form);
      navigate(user.role === 'student' ? '/profile' : '/manage', { replace: true });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        {/* Role Tabs */}
        <div className="auth-role-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${form.role === 'student' ? 'active' : ''}`}
            onClick={() => setRoleTab('student')}
          >
            <User size={15} />
            <span>I am a Candidate</span>
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${form.role === 'employer' ? 'active' : ''}`}
            onClick={() => setRoleTab('employer')}
          >
            <Building2 size={15} />
            <span>I am an Employer / Company</span>
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {form.role === 'employer' ? (
              <>
                <Building2 size={22} color="#f97316" />
                <span>Register Company Account</span>
              </>
            ) : (
              <>
                <UserCheck size={22} color="#185adf" />
                <span>Create Free Candidate Profile</span>
              </>
            )}
          </h2>
          <p className="muted small">
            {form.role === 'employer'
              ? 'Post vacancies, screen applicants, and shortlist top talent directly.'
              : 'Discover curated vacancies from top companies and track your shortlisting.'}
          </p>
        </div>

        <Alert onClose={() => setError('')}>{error}</Alert>

        <form onSubmit={onSubmit} noValidate>
          <label>
            Full Name *
            <input
              name="name"
              placeholder={form.role === 'employer' ? 'e.g. Riya Recruiter' : 'e.g. Aarav Sharma'}
              value={form.name}
              onChange={onChange}
              autoComplete="name"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>

          {form.role === 'employer' && (
            <label>
              Company / Organization Name *
              <input
                name="companyName"
                placeholder="e.g. TechNova Solutions"
                value={form.companyName}
                onChange={onChange}
              />
              {errors.companyName && <span className="field-error">{errors.companyName}</span>}
            </label>
          )}

          <label>
            Email Address *
            <input
              name="email"
              type="email"
              placeholder={form.role === 'employer' ? 'recruiter@company.com' : 'your.email@example.com'}
              value={form.email}
              onChange={onChange}
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>

          <label>
            Password (min. 6 characters) *
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={onChange}
              autoComplete="new-password"
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </label>

          <button
            type="submit"
            className={`btn btn-block ${form.role === 'employer' ? 'btn-orange' : 'btn-primary'}`}
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
                ? 'Creating Account…'
                : form.role === 'employer'
                ? 'Register as Employer'
                : 'Register as Candidate'}
            </span>
          </button>
        </form>

        <p className="muted text-center small" style={{ marginTop: '18px' }}>
          Already have an account?{' '}
          <Link
            to={`/login?role=${form.role}`}
            style={{
              fontWeight: '700',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>Log in here</span>
            <ArrowRight size={13} />
          </Link>
        </p>
      </div>
    </div>
  );
}
