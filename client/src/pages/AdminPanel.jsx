import { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Users,
  FileText,
  Building2,
  Trash2,
  Search,
  Star,
  UserCheck,
} from 'lucide-react';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';
import Alert from '../components/Alert.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function AdminPanel() {
  const { user: me } = useAuth();
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  const load = () =>
    Promise.all([api.get('/users'), api.get('/applications')])
      .then(([u, a]) => {
        setUsers(u.data);
        setApps(a.data);
      })
      .catch((err) => setError(errMsg(err)))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const removeUser = async (u) => {
    if (!window.confirm(`Permanently delete ${u.name}? Their listings and applications will also be removed.`)) return;
    setError('');
    try {
      await api.delete(`/users/${u._id}`);
      setSuccess(`User "${u.name}" deleted successfully.`);
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  if (loading) return <Spinner label="Loading administration dashboard…" />;

  const candidatesCount = users.filter((u) => u.role === 'student').length;
  const employersCount = users.filter((u) => u.role === 'employer').length;
  const shortlistedCount = apps.filter((a) => a.status === 'Shortlisted').length;

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.companyName && u.companyName.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredApps = apps.filter(
    (a) =>
      (a.userId?.name && a.userId.name.toLowerCase().includes(search.toLowerCase())) ||
      (a.jobId?.title && a.jobId.title.toLowerCase().includes(search.toLowerCase())) ||
      (a.jobId?.company && a.jobId.company.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container">
      {/* Super Admin Security Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '24px',
          boxShadow: '0 8px 24px rgba(30, 27, 75, 0.25)',
        }}
      >
        <div className="row space-between">
          <div>
            <div className="row gap-8" style={{ marginBottom: '6px' }}>
              <span
                className="badge badge-green"
                style={{
                  background: '#10b981',
                  color: '#ffffff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <ShieldCheck size={14} />
                <span>Super Admin Secured</span>
              </span>
              <span className="small" style={{ color: '#c7d2fe' }}>
                Full System Administrative Access
              </span>
            </div>
            <h1 style={{ color: '#ffffff', fontSize: '1.8rem', margin: '4px 0' }}>
              Portal Control Center
            </h1>
            <p style={{ color: '#e0e7ff', margin: 0, fontSize: '0.92rem' }}>
              Logged in as: <strong>{me?.name || 'Mayuri Kharat'}</strong> (
              <span style={{ color: '#a5b4fc' }}>{me?.email || 'mayurikharat8080@gmail.com'}</span>)
            </p>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '10px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'right',
            }}
          >
            <div className="small" style={{ color: '#c7d2fe' }}>Active Admin Session</div>
            <div className="bold" style={{ color: '#ffffff', fontSize: '0.95rem' }}>
              Role: System Administrator
            </div>
          </div>
        </div>
      </div>

      {/* Admin Stats Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div className="stat-card">
          <div className="num" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Users size={22} color="#185adf" />
            <span>{users.length}</span>
          </div>
          <div className="desc">Total Registered Users</div>
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
            <UserCheck size={22} />
            <span>{candidatesCount}</span>
          </div>
          <div className="desc">Job Seekers / Candidates</div>
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
            <Building2 size={22} />
            <span>{employersCount}</span>
          </div>
          <div className="desc">Hiring Companies / Recruiters</div>
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
            <span>{shortlistedCount}</span>
          </div>
          <div className="desc" style={{ color: '#065f46' }}>
            Total Shortlisted Across Portal
          </div>
        </div>
      </div>

      {/* Tab Switcher & Search Bar */}
      <div className="row space-between" style={{ marginBottom: '16px' }}>
        <div className="row gap-8">
          <button
            className={`btn btn-sm ${tab === 'users' ? 'btn-primary' : 'btn-outline'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            onClick={() => setTab('users')}
          >
            <Users size={14} />
            <span>Manage Users ({users.length})</span>
          </button>
          <button
            className={`btn btn-sm ${tab === 'apps' ? 'btn-primary' : 'btn-outline'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            onClick={() => setTab('apps')}
          >
            <FileText size={14} />
            <span>All Applications ({apps.length})</span>
          </button>
        </div>

        <div style={{ minWidth: '260px' }}>
          <input
            placeholder={`Filter ${tab === 'users' ? 'users by name, email, company' : 'applications'}…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ margin: 0, padding: '7px 12px', fontSize: '0.88rem' }}
          />
        </div>
      </div>

      <Alert onClose={() => setError('')}>{error}</Alert>
      <Alert type="success" onClose={() => setSuccess('')}>
        {success}
      </Alert>

      {tab === 'users' ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User Details</th>
                <th>Role</th>
                <th>Company / Affiliation</th>
                <th>Registered On</th>
                <th style={{ textAlign: 'right' }}>Security Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u._id}>
                  <td>
                    <strong>{u.name}</strong>
                    <div className="muted small">{u.email}</div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        u.role === 'admin'
                          ? 'badge-purple'
                          : u.role === 'employer'
                          ? 'badge-orange'
                          : 'badge-blue'
                      }`}
                    >
                      {u.role === 'student' ? 'Candidate' : u.role}
                    </span>
                  </td>
                  <td>
                    {u.companyName ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                        <Building2 size={13} />
                        <span>{u.companyName}</span>
                      </span>
                    ) : (
                      <span className="muted small">—</span>
                    )}
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    {u._id !== me?._id && u.role !== 'admin' ? (
                      <button
                        className="btn btn-danger btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        onClick={() => removeUser(u)}
                      >
                        <Trash2 size={12} />
                        <span>Delete User</span>
                      </button>
                    ) : (
                      <span className="badge badge-gray">Protected Admin</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="card empty-state">
          <h3>No applications found</h3>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Applied Vacancy</th>
                <th>Company</th>
                <th>Applied Date</th>
                <th>Current Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((a) => (
                <tr key={a._id}>
                  <td>
                    <strong>{a.userId?.name || 'Deleted user'}</strong>
                    <div className="muted small">{a.userId?.email}</div>
                  </td>
                  <td>
                    <strong>{a.jobId?.title || 'Listing Removed'}</strong>
                  </td>
                  <td>
                    <span>{a.jobId?.company || '—'}</span>
                  </td>
                  <td>{new Date(a.appliedAt).toLocaleDateString()}</td>
                  <td>
                    <StatusBadge status={a.status} />
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
