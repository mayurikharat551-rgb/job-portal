import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  MapPin,
  IndianRupee,
  Briefcase,
  Calendar,
  Star,
  CheckCircle2,
  Send,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';
import Alert from '../components/Alert.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ resumeUrl: '', coverLetter: '' });
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const [myApp, setMyApp] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/jobs/${id}`)
      .then((res) => setJob(res.data))
      .catch((err) => setError(errMsg(err)))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user?.role !== 'student') return;
    setForm((f) => ({ ...f, resumeUrl: user.resumeUrl || '' }));
    api
      .get('/applications/me')
      .then((res) => {
        const found = (res.data || []).find((a) => a.jobId?._id === id);
        if (found) setMyApp(found);
      })
      .catch(() => {});
  }, [user, id]);

  const submit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (form.resumeUrl && !/^https?:\/\/\S+$/i.test(form.resumeUrl)) {
      setFormError('Resume must be a valid URL starting with http:// or https://');
      return;
    }
    setBusy(true);
    try {
      const res = await api.post(`/jobs/${id}/apply`, form);
      setMyApp(res.data);
      navigate('/thank-you', { state: { title: job.title, company: job.company } });
    } catch (err) {
      setFormError(errMsg(err));
      if (err?.response?.status === 409) {
        setMyApp({ status: 'Submitted' });
      }
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Spinner label="Loading vacancy details…" />;
  if (error) return <Alert>{error}</Alert>;
  if (!job) return null;

  const expired = new Date(job.deadline) < new Date();
  const closed = job.status === 'closed' || expired;

  return (
    <div className="container" style={{ maxWidth: '880px', margin: '0 auto' }}>
      <div style={{ marginBottom: '14px' }}>
        <Link
          to="/jobs"
          className="muted small"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          <ArrowLeft size={14} />
          <span>Back to all vacancies</span>
        </Link>
      </div>

      <div className="card" style={{ padding: '32px' }}>
        <div className="row space-between" style={{ marginBottom: '12px' }}>
          <div className="row gap-8">
            <StatusBadge status={job.type} />
            <span className="badge badge-gray">{job.workMode || 'On-site'}</span>
            <span className="badge badge-gray">{job.experience || '0-2 Yrs'} Exp</span>
          </div>
          <StatusBadge status={closed ? 'closed' : 'active'} />
        </div>

        <h1 style={{ fontSize: '1.9rem', marginBottom: '6px' }}>{job.title}</h1>
        <div
          style={{
            fontSize: '1.05rem',
            color: '#334155',
            fontWeight: '600',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <Building2 size={16} color="#185adf" />
            <span>{job.company}</span>
          </span>
          <span>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <MapPin size={16} color="#64748b" />
            <span>{job.location}</span>
          </span>
        </div>

        <div className="job-meta-row" style={{ fontSize: '0.92rem', padding: '12px 16px' }}>
          <span className="job-meta-item">
            <IndianRupee size={15} color="#64748b" />
            <span>{job.stipendOrSalary || 'Competitive CTC'}</span>
          </span>
          <span className="job-meta-item">
            <Briefcase size={15} color="#64748b" />
            <span>{job.experience || '0-2 Yrs'}</span>
          </span>
          <span className="job-meta-item">
            <MapPin size={15} color="#64748b" />
            <span>{job.location}</span>
          </span>
          <span className="job-meta-item">
            <Calendar size={15} color="#64748b" />
            <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
          </span>
        </div>

        {/* Existing Application Notice */}
        {myApp && (
          <div
            className={`card ${myApp.status === 'Shortlisted' ? 'is-shortlisted' : ''}`}
            style={{
              background: myApp.status === 'Shortlisted' ? '#f0fdf4' : '#eff6ff',
              border: `1.5px solid ${myApp.status === 'Shortlisted' ? '#10b981' : '#bfdbfe'}`,
              margin: '20px 0',
              padding: '18px 24px',
            }}
          >
            <div className="row space-between">
              <div>
                <h4
                  style={{
                    color: myApp.status === 'Shortlisted' ? '#065f46' : '#1e40af',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {myApp.status === 'Shortlisted' ? (
                    <>
                      <Star size={18} fill="#10b981" color="#059669" />
                      <span>You have been Shortlisted by this company!</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} color="#2563eb" />
                      <span>You have already applied to this vacancy</span>
                    </>
                  )}
                </h4>
                <div style={{ marginTop: '4px' }}>
                  <span className="small muted">Application status: </span>
                  <StatusBadge status={myApp.status} />
                </div>
                {myApp.recruiterFeedback && (
                  <div className="recruiter-note-box green" style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MessageSquare size={14} color="#059669" />
                      <strong>Company Feedback:</strong>
                    </div>
                    <p style={{ margin: '4px 0 0' }}>{myApp.recruiterFeedback}</p>
                  </div>
                )}
              </div>
              <Link to="/applications" className="btn btn-primary btn-sm">
                Check Full Status Tracker →
              </Link>
            </div>
          </div>
        )}

        <hr style={{ margin: '24px 0' }} />

        <h3>About the Vacancy &amp; Company</h3>
        <p style={{ whiteSpace: 'pre-line', color: '#334155' }}>{job.description}</p>

        {job.responsibilities?.length > 0 && (
          <>
            <h3 style={{ marginTop: '24px' }}>Key Roles &amp; Responsibilities</h3>
            <ul style={{ paddingLeft: '22px', color: '#334155', lineHeight: '1.8' }}>
              {job.responsibilities.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </>
        )}

        <h3 style={{ marginTop: '24px' }}>Required Skills &amp; Qualifications</h3>
        <div className="chips-list">
          {(job.skills || []).map((s) => (
            <span key={s} className="chip">
              {s}
            </span>
          ))}
        </div>

        {job.eligibility && (
          <>
            <h3 style={{ marginTop: '24px' }}>Candidate Eligibility</h3>
            <p style={{ color: '#334155' }}>{job.eligibility}</p>
          </>
        )}

        <hr style={{ margin: '28px 0' }} />

        {/* Application CTA Area */}
        {closed ? (
          <Alert type="info">This vacancy deadline has passed and is no longer accepting applications.</Alert>
        ) : !user ? (
          <div className="card text-center" style={{ background: '#f8fafc', padding: '24px' }}>
            <h3>Interested in this role at {job.company}?</h3>
            <p className="muted">Log in or create a candidate account to apply with one click.</p>
            <div className="row" style={{ justifyContent: 'center', marginTop: '14px' }}>
              <Link to="/login" state={{ from: `/jobs/${id}` }} className="btn btn-primary btn-lg">
                Log In to Apply
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg">
                Register Free
              </Link>
            </div>
          </div>
        ) : user.role !== 'student' ? (
          <Alert type="info">
            You are logged in as an Employer/Admin ({user.companyName || user.name}). Only candidates can apply to
            vacancies.
          </Alert>
        ) : myApp ? (
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="muted">
              Application submitted on {new Date(myApp.appliedAt || Date.now()).toLocaleDateString()}
            </span>
            <Link to="/applications" className="btn btn-primary">
              View Application Progress Tracker
            </Link>
          </div>
        ) : !showForm ? (
          <div className="row space-between" style={{ alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: 0 }}>Ready to send your profile to {job.company}?</h4>
              <p className="muted small" style={{ margin: 0 }}>
                Your saved education and skills will be included automatically.
              </p>
            </div>
            <button
              className="btn btn-primary btn-lg"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              onClick={() => setShowForm(true)}
            >
              <Send size={16} />
              <span>Apply to Company Now</span>
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px' }}>
            <h3>Apply for {job.title} at {job.company}</h3>
            <p className="muted small">
              Applying as <strong>{user.name}</strong> ({user.email} · {user.phone || 'No phone set'})
            </p>

            <Alert onClose={() => setFormError('')}>{formError}</Alert>

            <label>
              Resume URL (Google Drive, LinkedIn, or Portfolio link)
              <input
                value={form.resumeUrl}
                placeholder="https://drive.google.com/file/d/your-resume/view"
                onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
                required
              />
              <span className="small muted">
                Provide a publicly accessible link or URL to your PDF resume.
              </span>
            </label>

            <label>
              Why are you a great fit for {job.company}? (Optional Cover Note)
              <textarea
                rows="4"
                maxLength="3000"
                placeholder="Highlight your relevant experience, projects, and why this vacancy interests you..."
                value={form.coverLetter}
                onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
              />
            </label>

            <div className="row gap-12" style={{ marginTop: '16px' }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={busy}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Send size={16} />
                <span>{busy ? 'Submitting to Recruiter…' : 'Confirm & Submit Application'}</span>
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
