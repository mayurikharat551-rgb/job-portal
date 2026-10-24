import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  FileText,
  Building2,
  GraduationCap,
  Home as HomeIcon,
  RotateCcw,
  Briefcase,
} from 'lucide-react';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import JobCard from '../components/JobCard.jsx';
import Spinner from '../components/Spinner.jsx';
import Alert from '../components/Alert.jsx';

export default function Home() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    type: searchParams.get('type') || '',
    location: searchParams.get('location') || '',
    skills: searchParams.get('skills') || '',
    experience: searchParams.get('experience') || '',
    workMode: searchParams.get('workMode') || '',
  });

  const [applied, setApplied] = useState({
    q: searchParams.get('q') || '',
    type: searchParams.get('type') || '',
    location: searchParams.get('location') || '',
    skills: searchParams.get('skills') || '',
    experience: searchParams.get('experience') || '',
    workMode: searchParams.get('workMode') || '',
  });

  const [page, setPage] = useState(1);
  const [data, setData] = useState({ jobs: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [myAppsMap, setMyAppsMap] = useState({});

  useEffect(() => {
    if (user?.role === 'student') {
      api
        .get('/applications/me')
        .then((res) => {
          const map = {};
          (res.data || []).forEach((a) => {
            if (a.jobId?._id) map[a.jobId._id] = a.status;
          });
          setMyAppsMap(map);
        })
        .catch(() => {});
    }
  }, [user]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { ...applied, page };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const res = await api.get('/jobs', { params });
      setData(res.data);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  }, [applied, page]);

  useEffect(() => {
    load();
  }, [load]);

  const onChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const onSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setApplied(filters);
  };

  const onClear = () => {
    const empty = { q: '', type: '', location: '', skills: '', experience: '', workMode: '' };
    setFilters(empty);
    setApplied(empty);
    setPage(1);
  };

  const setQuickFilter = (key, val) => {
    const next = { ...filters, [key]: val };
    setFilters(next);
    setApplied(next);
    setPage(1);
  };

  const hasFilters = Object.values(applied).some(Boolean);

  return (
    <div className="container">
      <div className="row space-between" style={{ marginBottom: '20px' }}>
        <div>
          <h1>Explore Vacancies &amp; Jobs</h1>
          <p className="muted">
            Find the right vacancy across top engineering, product, and business roles
          </p>
        </div>

        {user?.role === 'student' && (
          <Link
            to="/applications"
            className="btn btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <FileText size={15} />
            <span>Track My Applications ({Object.keys(myAppsMap).length})</span>
          </Link>
        )}
      </div>

      {/* Filter Matrix Card */}
      <div className="filters-matrix">
        <form onSubmit={onSearch}>
          <div className="filters-row">
            <input
              name="q"
              placeholder="Search title, company, skills"
              value={filters.q}
              onChange={onChange}
            />

            <select name="type" value={filters.type} onChange={onChange} aria-label="Role Type">
              <option value="">All Types</option>
              <option value="job">Full-Time Job</option>
              <option value="internship">Internship</option>
            </select>

            <select
              name="experience"
              value={filters.experience}
              onChange={onChange}
              aria-label="Experience"
            >
              <option value="">Experience (Any)</option>
              <option value="Fresher">Freshers (0-1 Yrs)</option>
              <option value="0-2">0 - 2 Years</option>
              <option value="1-3">1 - 3 Years</option>
            </select>

            <select
              name="workMode"
              value={filters.workMode}
              onChange={onChange}
              aria-label="Work Mode"
            >
              <option value="">Work Mode (Any)</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <Filter size={14} />
              <span>Filter</span>
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClear}
              disabled={!hasFilters && !Object.values(filters).some(Boolean)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <RotateCcw size={13} />
              <span>Clear</span>
            </button>
          </div>
        </form>

        {/* Quick Filter Badges */}
        <div className="row gap-8" style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
          <span className="small muted">Quick Filter:</span>
          <button
            type="button"
            className="trend-chip"
            style={{
              color: '#185adf',
              background: '#eff6ff',
              borderColor: '#bfdbfe',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
            onClick={() => setQuickFilter('workMode', 'Remote')}
          >
            <HomeIcon size={12} />
            <span>Remote</span>
          </button>
          <button
            type="button"
            className="trend-chip"
            style={{
              color: '#059669',
              background: '#ecfdf5',
              borderColor: '#a7f3d0',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
            onClick={() => setQuickFilter('experience', 'Fresher')}
          >
            <GraduationCap size={12} />
            <span>Freshers</span>
          </button>
          <button
            type="button"
            className="trend-chip"
            style={{
              color: '#ea580c',
              background: '#fff7ed',
              borderColor: '#fed7aa',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
            onClick={() => setQuickFilter('type', 'internship')}
          >
            <Briefcase size={12} />
            <span>Internships</span>
          </button>
          <button
            type="button"
            className="trend-chip"
            style={{
              color: '#7c3aed',
              background: '#f5f3ff',
              borderColor: '#ddd6fe',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
            onClick={() => setQuickFilter('q', 'TechNova')}
          >
            <Building2 size={12} />
            <span>TechNova Solutions</span>
          </button>
        </div>
      </div>

      <Alert onClose={() => setError('')}>{error}</Alert>

      {loading ? (
        <Spinner label="Loading vacancies from companies…" />
      ) : data.jobs.length === 0 ? (
        <div className="card empty-state">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <Search size={44} color="#94a3b8" />
          </div>
          <h3>No matching vacancies found</h3>
          <p className="muted">Try adjusting your keywords or clearing the filters.</p>
          {hasFilters && (
            <button className="btn btn-outline" onClick={onClear} style={{ marginTop: '12px' }}>
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="row space-between" style={{ marginBottom: '16px' }}>
            <span className="muted small">
              Showing <strong>{data.jobs.length}</strong> of <strong>{data.total}</strong> active vacancies
            </span>
          </div>

          <div className="job-cards-grid">
            {data.jobs.map((j) => (
              <JobCard
                key={j._id}
                job={j}
                isApplied={Boolean(myAppsMap[j._id])}
                isShortlisted={myAppsMap[j._id] === 'Shortlisted'}
              />
            ))}
          </div>

          {data.pages > 1 && (
            <div className="row space-between" style={{ marginTop: '32px', justifyContent: 'center' }}>
              <button
                className="btn btn-outline btn-sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              >
                ← Previous Page
              </button>
              <span className="small muted">
                Page {page} of {data.pages}
              </span>
              <button
                className="btn btn-outline btn-sm"
                disabled={page >= data.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next Page →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
