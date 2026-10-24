import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Star,
  Clock,
  CheckCircle2,
  Check,
  Award,
  ExternalLink,
  ArrowRight,
  Plus,
  MessageSquare,
  Building2,
  MapPin,
  IndianRupee,
  Briefcase,
} from 'lucide-react';
import api, { errMsg } from '../api.js';
import Spinner from '../components/Spinner.jsx';
import Alert from '../components/Alert.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterTab, setFilterTab] = useState('ALL');

  const load = () => {
    setLoading(true);
    api
      .get('/applications/me')
      .then((res) => setApps(res.data))
      .catch((err) => setError(errMsg(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <Spinner label="Loading your job applications &amp; status…" />;

  const shortlistedApps = apps.filter((a) => a.status === 'Shortlisted');
  const reviewApps = apps.filter((a) => a.status === 'Under Review');
  const submittedApps = apps.filter((a) => a.status === 'Submitted');

  const filtered =
    filterTab === 'SHORTLISTED'
      ? shortlistedApps
      : filterTab === 'REVIEW'
      ? reviewApps
      : filterTab === 'SUBMITTED'
      ? submittedApps
      : apps;

  const getStepState = (status, stepIndex) => {
    if (status === 'Rejected') {
      if (stepIndex === 0) return 'completed';
      if (stepIndex === 1) return 'completed';
      return 'rejected';
    }

    if (status === 'Selected') return 'completed';

    if (status === 'Shortlisted' || status === 'Interview Scheduled') {
      if (stepIndex <= 1) return 'completed';
      if (stepIndex === 2) return 'shortlisted';
      return '';
    }

    if (status === 'Under Review') {
      if (stepIndex === 0) return 'completed';
      if (stepIndex === 1) return 'active';
      return '';
    }

    if (stepIndex === 0) return 'active';
    return '';
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="row space-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1>My Applications &amp; Status Tracker</h1>
          <p className="muted">
            Track real-time hiring updates, company shortlisting, and recruiter feedback
          </p>
        </div>
        <Link
          to="/jobs"
          className="btn btn-outline"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} />
          <span>Explore More Vacancies</span>
        </Link>
      </div>

      <Alert onClose={() => setError('')}>{error}</Alert>

      {/* Top Metrics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setFilterTab('ALL')}>
          <div className="num" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <FileText size={22} color="#2563eb" />
            <span>{apps.length}</span>
          </div>
          <div className="desc">Total Applied</div>
        </div>

        <div
          className="stat-card"
          style={{
            cursor: 'pointer',
            borderColor: '#10b981',
            background: shortlistedApps.length > 0 ? '#f0fdf4' : '#ffffff',
            boxShadow: shortlistedApps.length > 0 ? 'var(--shadow-shortlist)' : 'var(--shadow-sm)',
          }}
          onClick={() => setFilterTab('SHORTLISTED')}
        >
          <div
            className="num"
            style={{
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Star size={22} fill="currentColor" />
            <span>{shortlistedApps.length}</span>
          </div>
          <div className="desc" style={{ color: '#065f46' }}>
            Shortlisted by Companies
          </div>
        </div>

        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setFilterTab('REVIEW')}>
          <div
            className="num"
            style={{
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Clock size={22} />
            <span>{reviewApps.length}</span>
          </div>
          <div className="desc">Under Review</div>
        </div>

        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setFilterTab('SUBMITTED')}>
          <div
            className="num"
            style={{
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={22} />
            <span>{submittedApps.length}</span>
          </div>
          <div className="desc">Submitted</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="row gap-8" style={{ marginBottom: '20px' }}>
        <button
          className={`btn btn-sm ${filterTab === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilterTab('ALL')}
        >
          All Applications ({apps.length})
        </button>
        <button
          className={`btn btn-sm ${filterTab === 'SHORTLISTED' ? 'btn-success' : 'btn-outline'}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          onClick={() => setFilterTab('SHORTLISTED')}
        >
          <Star size={13} fill="currentColor" />
          <span>Shortlisted ({shortlistedApps.length})</span>
        </button>
        <button
          className={`btn btn-sm ${filterTab === 'REVIEW' ? 'btn-primary' : 'btn-outline'}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          onClick={() => setFilterTab('REVIEW')}
        >
          <Clock size={13} />
          <span>In Review ({reviewApps.length})</span>
        </button>
        <button
          className={`btn btn-sm ${filterTab === 'SUBMITTED' ? 'btn-primary' : 'btn-outline'}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          onClick={() => setFilterTab('SUBMITTED')}
        >
          <CheckCircle2 size={13} />
          <span>Submitted ({submittedApps.length})</span>
        </button>
      </div>

      {apps.length === 0 ? (
        <div className="card empty-state">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <Briefcase size={44} color="#94a3b8" />
          </div>
          <h3>No applications yet</h3>
          <p className="muted">
            You haven’t applied to any company vacancies yet. Explore vacancies and apply with 1 click!
          </p>
          <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '14px' }}>
            Browse Opportunities Now
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card empty-state">
          <h3>No applications in this category</h3>
          <p className="muted">Select "All Applications" to view all your tracked submissions.</p>
          <button className="btn btn-outline" onClick={() => setFilterTab('ALL')} style={{ marginTop: '12px' }}>
            View All Applications
          </button>
        </div>
      ) : (
        filtered.map((a) => {
          const isShortlisted = a.status === 'Shortlisted' || a.status === 'Interview Scheduled';
          const appliedDate = new Date(a.appliedAt).toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });

          return (
            <div
              key={a._id}
              className={`status-tracker-card ${isShortlisted ? 'is-shortlisted' : ''}`}
            >
              {/* Card Header */}
              <div className="row space-between" style={{ alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                  <div className="row gap-8" style={{ marginBottom: '4px' }}>
                    <span className="badge badge-gray">{a.jobId?.type === 'internship' ? 'Internship' : 'Full-Time'}</span>
                    <span className="muted small">Applied on {appliedDate}</span>
                  </div>

                  <h2 style={{ fontSize: '1.35rem', marginBottom: '4px' }}>
                    {a.jobId ? (
                      <Link to={`/jobs/${a.jobId._id}`} style={{ color: '#0f172a' }}>
                        {a.jobId.title}
                      </Link>
                    ) : (
                      <em>Listing Closed</em>
                    )}
                  </h2>

                  <div
                    style={{
                      color: '#475569',
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Building2 size={14} color="#64748b" />
                      <span>{a.jobId?.company || 'Company'}</span>
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} color="#64748b" />
                      <span>{a.jobId?.location || 'India'}</span>
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <IndianRupee size={14} color="#64748b" />
                      <span>{a.jobId?.stipendOrSalary || 'Competitive CTC'}</span>
                    </span>
                  </div>
                </div>

                <div>
                  <StatusBadge status={a.status} />
                </div>
              </div>

              {/* Celebration Callout if Shortlisted */}
              {isShortlisted && (
                <div className="celebration-box">
                  <div className="celebration-icon" style={{ display: 'flex', alignItems: 'center' }}>
                    <Award size={36} color="#ffffff" strokeWidth={2.2} />
                  </div>
                  <div>
                    <div className="celebration-title">
                      Congratulations! You have been Shortlisted by {a.jobId?.company || 'the company'}!
                    </div>
                    <div className="celebration-desc">
                      Your profile and credentials stood out. The hiring team has marked your application as shortlisted.
                    </div>
                  </div>
                </div>
              )}

              {/* Recruiter Feedback Message */}
              {a.recruiterFeedback && (
                <div className={`recruiter-note-box ${isShortlisted ? 'green' : ''}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MessageSquare size={15} color={isShortlisted ? '#059669' : '#185adf'} />
                    <strong>Recruiter Note from {a.jobId?.company || 'Employer'}:</strong>
                  </div>
                  <p style={{ margin: '4px 0 0', color: '#1e293b' }}>{a.recruiterFeedback}</p>
                </div>
              )}

              {/* 4-Step Visual Stepper */}
              <div className="stepper">
                <div className={`step-item ${getStepState(a.status, 0)}`}>
                  <div className="step-circle">
                    <Check size={16} strokeWidth={2.5} />
                  </div>
                  <div className="step-label">Application Submitted</div>
                </div>

                <div className={`step-item ${getStepState(a.status, 1)}`}>
                  <div className="step-circle">
                    <Clock size={16} strokeWidth={2.5} />
                  </div>
                  <div className="step-label">Resume Under Review</div>
                </div>

                <div className={`step-item ${getStepState(a.status, 2)}`}>
                  <div className="step-circle">
                    <Star size={16} fill="currentColor" strokeWidth={2.5} />
                  </div>
                  <div className="step-label">Shortlisted by Company</div>
                </div>

                <div className={`step-item ${getStepState(a.status, 3)}`}>
                  <div className="step-circle">
                    <Award size={16} strokeWidth={2.5} />
                  </div>
                  <div className="step-label">
                    {a.status === 'Rejected' ? 'Status Concluded' : 'Interview / Offer'}
                  </div>
                </div>
              </div>

              {/* Application Details Strip */}
              <div
                className="row space-between"
                style={{
                  paddingTop: '14px',
                  borderTop: '1px solid #f1f5f9',
                  marginTop: '12px',
                  fontSize: '0.85rem',
                }}
              >
                <div className="row gap-16">
                  {a.resumeUrl && (
                    <a
                      href={a.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bold"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <FileText size={14} />
                      <span>View Sent Resume</span>
                      <ExternalLink size={12} />
                    </a>
                  )}

                  {a.coverLetter && (
                    <details>
                      <summary style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>
                        Cover note details
                      </summary>
                      <p style={{ marginTop: '6px', color: '#475569', maxWidth: '600px' }}>
                        {a.coverLetter}
                      </p>
                    </details>
                  )}
                </div>

                <div>
                  {a.jobId && (
                    <Link
                      to={`/jobs/${a.jobId._id}`}
                      className="btn btn-outline btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    >
                      <span>View Job Description</span>
                      <ArrowRight size={13} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
