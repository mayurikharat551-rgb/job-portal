import { useEffect, useState } from 'react';
import {
  User,
  Building2,
  Phone,
  GraduationCap,
  FileText,
  Save,
  CheckCircle2,
} from 'lucide-react';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Alert from '../components/Alert.jsx';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        education: user.education || '',
        skills: (user.skills || []).join(', '),
        summary: user.summary || '',
        resumeUrl: user.resumeUrl || '',
        companyName: user.companyName || '',
        headline: user.headline || '',
        experienceYears: user.experienceYears || 'Fresher',
      });
    }
  }, [user]);

  if (!form) return null;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (form.phone && !/^[0-9+\-\s()]{7,20}$/.test(form.phone)) e.phone = 'Enter a valid phone number';
    if (form.resumeUrl && !/^https?:\/\/\S+$/i.test(form.resumeUrl)) {
      e.resumeUrl = 'Enter a valid URL (starting with http:// or https://)';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setError('');
    setSuccess('');
    if (!validate()) return;
    setBusy(true);
    try {
      const { data } = await api.put('/users/me', form);
      setUser(data);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  const isEmployer = user?.role === 'employer';

  return (
    <div className="container" style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div className="card" style={{ padding: '32px' }}>
        <div className="row space-between" style={{ marginBottom: '16px' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isEmployer ? (
                <>
                  <Building2 size={24} color="#f97316" />
                  <span>Company Recruiter Profile</span>
                </>
              ) : (
                <>
                  <User size={24} color="#185adf" />
                  <span>Candidate Profile</span>
                </>
              )}
            </h1>
            <p className="muted small">
              {isEmployer
                ? 'Your company name and details will appear on your posted vacancies.'
                : 'Companies review this information when screening your applications for shortlisting.'}
            </p>
          </div>
          <span className="badge badge-blue">
            Role: {isEmployer ? 'Employer' : user?.role === 'admin' ? 'Admin' : 'Job Seeker'}
          </span>
        </div>

        <Alert onClose={() => setError('')}>{error}</Alert>
        <Alert type="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>

        <form onSubmit={onSubmit} noValidate>
          <label>
            Full Name *
            <input name="name" value={form.name} onChange={onChange} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>

          <label>
            Email Address (Read only)
            <input value={user.email} disabled style={{ background: '#f1f5f9', cursor: 'not-allowed' }} />
          </label>

          {isEmployer ? (
            <label>
              Company Name *
              <input name="companyName" value={form.companyName} onChange={onChange} />
            </label>
          ) : (
            <>
              <label>
                Professional Headline
                <input
                  name="headline"
                  placeholder="e.g. Full Stack MERN Developer | React & Node.js"
                  value={form.headline}
                  onChange={onChange}
                />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <label>
                  Phone Number
                  <input name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={onChange} />
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </label>

                <label>
                  Experience Level
                  <select name="experienceYears" value={form.experienceYears} onChange={onChange}>
                    <option value="Fresher">Fresher (0-1 Yrs)</option>
                    <option value="1-2 Yrs">1 - 2 Years</option>
                    <option value="2-4 Yrs">2 - 4 Years</option>
                    <option value="5+ Yrs">5+ Years</option>
                  </select>
                </label>
              </div>

              <label>
                College / Education
                <input
                  name="education"
                  placeholder="e.g. B.E. in Computer Engineering, 2026"
                  value={form.education}
                  onChange={onChange}
                />
              </label>

              <label>
                Key Technical Skills (comma separated)
                <input
                  name="skills"
                  placeholder="e.g. React, Node.js, MongoDB, JavaScript, Express"
                  value={form.skills}
                  onChange={onChange}
                />
              </label>

              <label>
                Resume URL (Google Drive / Portfolio PDF)
                <input
                  name="resumeUrl"
                  placeholder="https://drive.google.com/file/d/your-resume/view"
                  value={form.resumeUrl}
                  onChange={onChange}
                />
                {errors.resumeUrl && <span className="field-error">{errors.resumeUrl}</span>}
              </label>

              <label>
                Profile Summary
                <textarea
                  name="summary"
                  rows="4"
                  maxLength="1000"
                  placeholder="Tell recruiters about your background, projects, and career goals..."
                  value={form.summary}
                  onChange={onChange}
                />
              </label>
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={busy}
            style={{
              marginTop: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Save size={16} />
            <span>{busy ? 'Saving Changes…' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
