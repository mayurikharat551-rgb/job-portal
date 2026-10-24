import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Plus,
  Users,
  Star,
  Briefcase,
  Sparkles,
  Edit3,
  Trash2,
  Power,
  MapPin,
  Calendar,
} from 'lucide-react';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';
import Alert from '../components/Alert.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function ManageJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = () =>
    api
      .get('/jobs/mine/list')
      .then((res) => setJobs(res.data))
      .catch((err) => setError(errMsg(err)))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const toggle = async (job) => {
    setError('');
    try {
      await api.patch(`/jobs/${job._id}/close`, {
        status: job.status === 'active' ? 'closed' : 'active',
      });
      setSuccess(job.status === 'active' ? 'Listing closed.' : 'Listing reopened.');
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  const remove = async (job) => {
    if (!window.confirm(`Delete "${job.title}" and all its applications? This cannot be undone.`)) return;
    setError('');
    try {
      await api.delete(`/jobs/${job._id}`);
      setSuccess('Listing deleted.');
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  if (loading) return <Spinner label="Loading company vacancies…" />;

  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicantCount || 0), 0);
  const totalShortlisted = jobs.reduce((sum, j) => sum + (j.shortlistedCount || 0), 0);

  return (
    <div className="container">
      {/* Recruiter Header */}
      <div className="row space-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 size={26} color="#185adf" />
            <span>Recruiter Zone – Manage Vacancies</span>
          </h1>
          <p className="muted">
            Logged in as <strong>{user?.companyName || user?.name}</strong>. Create vacancies, review
            resumes, and shortlist candidates.
          </p>
        </div>
        <Link
          to="/manage/new"
          className="btn btn-orange btn-lg"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Post New Vacancy</span>
        </Link>
      </div>

      <Alert onClose={() => setError('')}>{error}</Alert>
      <Alert type="success" onClose={() => setSuccess('')}>
        {success}
      </Alert>

      {/* Recruiter Stats Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div className="stat-card">
          <div className="num" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Briefcase size={22} color="#185adf" />
            <span>{jobs.length}</span>
          </div>
          <div className="desc">Posted Vacancies</div>
        </div>

        <div className="stat-card">
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
            <Users size={22} />
            <span>{totalApplicants}</span>
          </div>
          <div className="desc">Total Applications Received</div>
        </div>

        <div className="stat-card" style={{ borderColor: '#10b981', background: '#f0fdf4' }}>
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
            <span>{totalShortlisted}</span>
          </div>
          <div className="desc" style={{ color: '#065f46' }}>
            Candidates Shortlisted
          </div>
        </div>

        <div className="stat-card">
          <div
            className="num"
            style={{
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Sparkles size={22} />
            <span>{jobs.filter((j) => j.status === 'active').length}</span>
          </div>
          <div className="desc">Active Openings</div>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="card empty-state">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <Briefcase size={44} color="#94a3b8" />
          </div>
          <h3>No vacancies posted yet</h3>
          <p className="muted">
            Send your first vacancy to job seekers now to start receiving applications.
          </p>
          <Link
            to="/manage/new"
            className="btn btn-orange"
            style={{ marginTop: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Create First Vacancy</span>
          </Link>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Job Title &amp; Department</th>
                <th>Work Mode &amp; Exp</th>
                <th>Status</th>
                <th>Deadline</th>
                <th>Applicants</th>
                <th>Shortlisted</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j._id}>
                  <td>
                    <strong>{j.title}</strong>
                    <div className="muted small" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Building2 size={12} />
                      <span>{j.company}</span>
                      <span>·</span>
                      <MapPin size={12} />
                      <span>{j.location}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-gray">{j.workMode || 'On-site'}</span>
                    <div className="muted small">{j.experience || '0-2 Yrs'}</div>
                  </td>
                  <td>
                    <StatusBadge status={j.status} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} color="#64748b" />
                      <span>{new Date(j.deadline).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-blue">
                      {j.applicantCount || 0} applicant{(j.applicantCount || 0) === 1 ? '' : 's'}
                    </span>
                  </td>
                  <td>
                    {(j.shortlistedCount || 0) > 0 ? (
                      <span
                        className="badge badge-green"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Star size={11} fill="currentColor" />
                        <span>{j.shortlistedCount} Shortlisted</span>
                      </span>
                    ) : (
                      <span className="muted small">0 Shortlisted</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="row gap-8" style={{ justifyContent: 'flex-end' }}>
                      <Link
                        to={`/manage/${j._id}/applicants`}
                        className="btn btn-primary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                        title="Review candidate resumes and shortlist"
                      >
                        <Users size={13} />
                        <span>Review &amp; Shortlist ({j.applicantCount})</span>
                      </Link>
                      <Link
                        to={`/manage/${j._id}/edit`}
                        className="btn btn-outline btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </Link>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        onClick={() => toggle(j)}
                      >
                        <Power size={13} />
                        <span>{j.status === 'active' ? 'Close' : 'Reopen'}</span>
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        onClick={() => remove(j)}
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
