import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Users,
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  ExternalLink,
  Star,
  Check,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import api, { errMsg } from '../api.js';
import Spinner from '../components/Spinner.jsx';
import Alert from '../components/Alert.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

const STATUSES = ['Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];

export default function Applicants() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterTab, setFilterTab] = useState('ALL');

  // Shortlisting Modal State
  const [shortlistModalApp, setShortlistModalApp] = useState(null);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    api
      .get(`/applications/job/${id}`)
      .then((res) => setData(res.data))
      .catch((err) => setError(errMsg(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const updateApplicantStatus = async (appId, status, recruiterFeedback = '') => {
    setError('');
    setSuccess('');
    try {
      const res = await api.patch(`/applications/${appId}/status`, {
        status,
        recruiterFeedback,
      });

      setData((d) => ({
        ...d,
        applications: d.applications.map((a) =>
          a._id === appId
            ? {
                ...a,
                status: res.data.status,
                recruiterFeedback: res.data.recruiterFeedback,
                shortlistedAt: res.data.shortlistedAt,
              }
            : a
        ),
      }));

      setSuccess(`Candidate successfully updated to "${status}"!`);
      setShortlistModalApp(null);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setUpdating(false);
    }
  };

  const openShortlistModal = (app) => {
    setShortlistModalApp(app);
    setFeedbackNote(
      app.recruiterFeedback ||
        `Congratulations ${app.userId?.name || 'Candidate'}! Your application for "${
          data?.job?.title
        }" has been shortlisted. Our technical team was impressed with your skills and will contact you for Round 1 assessment.`
    );
  };

  const handleConfirmShortlist = async (e) => {
    e.preventDefault();
    if (!shortlistModalApp) return;
    setUpdating(true);
    await updateApplicantStatus(shortlistModalApp._id, 'Shortlisted', feedbackNote);
  };

  if (loading) return <Spinner label="Loading candidate applications for this vacancy…" />;

  const applications = data?.applications || [];
  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;
  const inReviewCount = applications.filter((a) => a.status === 'Under Review').length;

  const filteredApps =
    filterTab === 'SHORTLISTED'
      ? applications.filter((a) => a.status === 'Shortlisted')
      : filterTab === 'REVIEW'
      ? applications.filter((a) => a.status === 'Under Review')
      : filterTab === 'SUBMITTED'
      ? applications.filter((a) => a.status === 'Submitted')
      : applications;

  return (
    <div className="container">
      <div style={{ marginBottom: '14px' }}>
        <Link
          to="/manage"
          className="muted small"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          <ArrowLeft size={14} />
          <span>Back to Manage Listings</span>
        </Link>
      </div>

      <div className="row space-between" style={{ marginBottom: '18px' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={26} color="#185adf" />
            <span>Applicants Review &amp; Shortlist</span>
          </h1>
          <p className="muted" style={{ margin: 0 }}>
            Vacancy: <strong>{data?.job?.title}</strong> ({data?.job?.company} · {data?.job?.location})
          </p>
        </div>

        <div className="row gap-8">
          <span className="badge badge-blue">{applications.length} Total Applicants</span>
          <span
            className="badge badge-green"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Star size={12} fill="currentColor" />
            <span>{shortlistedCount} Shortlisted</span>
          </span>
        </div>
      </div>

      <Alert onClose={() => setError('')}>{error}</Alert>
      <Alert type="success" onClose={() => setSuccess('')}>
        {success}
      </Alert>

      {/* Filter Tabs */}
      <div className="row gap-8" style={{ marginBottom: '20px' }}>
        <button
          className={`btn btn-sm ${filterTab === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilterTab('ALL')}
        >
          All Candidates ({applications.length})
        </button>
        <button
          className={`btn btn-sm ${filterTab === 'SHORTLISTED' ? 'btn-success' : 'btn-outline'}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          onClick={() => setFilterTab('SHORTLISTED')}
        >
          <Star size={13} fill="currentColor" />
          <span>Shortlisted ({shortlistedCount})</span>
        </button>
        <button
          className={`btn btn-sm ${filterTab === 'REVIEW' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilterTab('REVIEW')}
        >
          In Review ({inReviewCount})
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="card empty-state">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <Users size={44} color="#94a3b8" />
          </div>
          <h3>No candidates have applied yet</h3>
          <p className="muted">
            Applications will appear here in real-time as job seekers discover and apply to this vacancy.
          </p>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="card empty-state">
          <h3>No candidates found in this status</h3>
          <button className="btn btn-outline" onClick={() => setFilterTab('ALL')} style={{ marginTop: '12px' }}>
            Show All Candidates
          </button>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Candidate Profile</th>
                <th>Education &amp; Experience</th>
                <th>Key Skills</th>
                <th>Resume</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Recruiter Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((a) => {
                const isShortlisted = a.status === 'Shortlisted';

                return (
                  <tr key={a._id} style={{ background: isShortlisted ? '#f0fdf4' : 'inherit' }}>
                    <td>
                      <div className="bold" style={{ fontSize: '1rem', color: '#0f172a' }}>
                        {a.userId?.name || 'Anonymous User'}
                      </div>
                      <div className="muted small" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={12} />
                        <span>{a.userId?.email}</span>
                      </div>
                      {a.userId?.phone && (
                        <div className="muted small" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={12} />
                          <span>{a.userId.phone}</span>
                        </div>
                      )}
                      {a.userId?.headline && (
                        <div className="small" style={{ color: '#2563eb', marginTop: '2px' }}>
                          {a.userId.headline}
                        </div>
                      )}
                    </td>

                    <td>
                      <div>{a.userId?.education || 'Degree not specified'}</div>
                      <div className="muted small">
                        Exp: {a.userId?.experienceYears || 'Fresher'}
                      </div>
                      {a.coverLetter && (
                        <details style={{ marginTop: '6px' }}>
                          <summary className="small" style={{ cursor: 'pointer', color: '#6366f1' }}>
                            Read Cover Pitch
                          </summary>
                          <p
                            className="small"
                            style={{
                              padding: '8px',
                              background: '#f8fafc',
                              borderRadius: '6px',
                              border: '1px solid #e2e8f0',
                              marginTop: '4px',
                            }}
                          >
                            {a.coverLetter}
                          </p>
                        </details>
                      )}
                    </td>

                    <td>
                      <div className="chips-list" style={{ margin: 0 }}>
                        {(a.userId?.skills || []).map((s) => (
                          <span key={s} className="chip">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td>
                      {a.resumeUrl ? (
                        <a
                          href={a.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline btn-sm"
                          style={{
                            borderColor: '#2563eb',
                            color: '#2563eb',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <FileText size={13} />
                          <span>Open Resume</span>
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="muted small">No resume attached</span>
                      )}
                    </td>

                    <td>
                      <StatusBadge status={a.status} />
                      {a.recruiterFeedback && (
                        <div
                          className="small muted"
                          style={{
                            maxWidth: '220px',
                            marginTop: '6px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                          title={a.recruiterFeedback}
                        >
                          <MessageSquare size={12} />
                          <span>"{a.recruiterFeedback}"</span>
                        </div>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div className="row gap-8" style={{ justifyContent: 'flex-end' }}>
                        {/* Direct Shortlist Button */}
                        <button
                          className={`btn btn-sm ${isShortlisted ? 'btn-success' : 'btn-primary'}`}
                          style={{
                            background: isShortlisted ? '#059669' : '#185adf',
                            color: '#ffffff',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                          onClick={() => openShortlistModal(a)}
                          title="Shortlist candidate and send feedback note"
                        >
                          {isShortlisted ? (
                            <>
                              <Check size={13} strokeWidth={2.5} />
                              <span>Shortlisted</span>
                            </>
                          ) : (
                            <>
                              <Star size={13} fill="currentColor" />
                              <span>Shortlist</span>
                            </>
                          )}
                        </button>

                        {/* Quick Status Dropdown */}
                        <select
                          value={a.status}
                          onChange={(e) => updateApplicantStatus(a._id, e.target.value)}
                          style={{ width: 'auto', padding: '5px 8px', fontSize: '0.8rem', margin: 0 }}
                          aria-label={`Change status for ${a.userId?.name}`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Recruiter Shortlist Modal */}
      {shortlistModalApp && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '20px',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '560px',
              width: '100%',
              background: '#ffffff',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              borderRadius: '16px',
            }}
          >
            <div className="row space-between" style={{ marginBottom: '14px' }}>
              <h2
                style={{
                  margin: 0,
                  color: '#065f46',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Star size={20} fill="#10b981" color="#059669" />
                <span>Shortlist Candidate: {shortlistModalApp.userId?.name}</span>
              </h2>
              <button
                type="button"
                className="alert-close"
                onClick={() => setShortlistModalApp(null)}
              >
                ×
              </button>
            </div>

            <p className="muted small">
              Shortlisting this candidate will immediately notify them in their <strong>"My Applications"</strong>{' '}
              dashboard with a celebratory banner and your personalized recruiter note!
            </p>

            <form onSubmit={handleConfirmShortlist}>
              <label>
                Recruiter Feedback &amp; Next Steps for Candidate:
                <textarea
                  rows="4"
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  placeholder="e.g. Profile shortlisted for Round 1 Technical Interview! Great hands-on projects..."
                  required
                />
              </label>

              <div className="row gap-12" style={{ justifyContent: 'flex-end', marginTop: '16px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShortlistModalApp(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={updating}
                  style={{
                    background: '#059669',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Star size={14} fill="currentColor" />
                  <span>{updating ? 'Saving Status…' : 'Confirm Shortlisting'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
