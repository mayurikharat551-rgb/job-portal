import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Briefcase,
  Edit3,
  ArrowLeft,
  Send,
  Plus,
} from 'lucide-react';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Alert from '../components/Alert.jsx';
import Spinner from '../components/Spinner.jsx';

export default function JobForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    company: user?.companyName || '',
    description: '',
    responsibilities: '',
    type: 'job',
    location: '',
    skills: '',
    eligibility: '',
    stipendOrSalary: '',
    experience: '0-2 Yrs',
    workMode: 'On-site',
    department: 'Engineering',
    deadline: '',
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(editing);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!editing) return;
    api
      .get(`/jobs/${id}`)
      .then(({ data }) =>
        setForm({
          title: data.title,
          company: data.company,
          description: data.description,
          responsibilities: (data.responsibilities || []).join('\n'),
          type: data.type,
          location: data.location,
          skills: (data.skills || []).join(', '),
          eligibility: data.eligibility || '',
          stipendOrSalary: data.stipendOrSalary || '',
          experience: data.experience || '0-2 Yrs',
          workMode: data.workMode || 'On-site',
          department: data.department || 'Engineering',
          deadline: data.deadline ? data.deadline.slice(0, 10) : '',
        })
      )
      .catch((err) => setError(errMsg(err)))
      .finally(() => setLoading(false));
  }, [id, editing]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Job title is required';
    if (!form.company.trim()) e.company = 'Company name is required';
    if (!form.description.trim()) e.description = 'Job description is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (!form.deadline) e.deadline = 'Application deadline is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setBusy(true);

    const payload = {
      ...form,
      responsibilities: form.responsibilities
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (editing) {
        await api.put(`/jobs/${id}`, payload);
      } else {
        await api.post('/jobs', payload);
      }
      navigate('/manage');
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Spinner label="Loading vacancy details…" />;

  return (
    <div className="container" style={{ maxWidth: '820px', margin: '0 auto' }}>
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

      <div className="card" style={{ padding: '32px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {editing ? <Edit3 size={24} color="#185adf" /> : <Plus size={24} color="#f97316" />}
            <span>{editing ? 'Edit Vacancy' : 'Post a New Vacancy to Job Seekers'}</span>
          </h1>
          <p className="muted">
            Provide comprehensive details about the role, salary, skills, and expectations to attract
            top talent.
          </p>
        </div>

        <Alert onClose={() => setError('')}>{error}</Alert>

        <form onSubmit={onSubmit} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <label>
              Job Title / Designation *
              <input
                name="title"
                value={form.title}
                onChange={onChange}
                placeholder="e.g. MERN Stack Developer Intern"
              />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </label>

            <label>
              Company Name *
              <input
                name="company"
                value={form.company}
                onChange={onChange}
                placeholder="e.g. TechNova Solutions"
              />
              {errors.company && <span className="field-error">{errors.company}</span>}
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <label>
              Vacancy Type
              <select name="type" value={form.type} onChange={onChange}>
                <option value="job">Full-Time Job</option>
                <option value="internship">Internship</option>
              </select>
            </label>

            <label>
              Experience Required
              <select name="experience" value={form.experience} onChange={onChange}>
                <option value="Fresher (0-1 Yrs)">Fresher (0-1 Yrs)</option>
                <option value="0-2 Yrs">0-2 Years</option>
                <option value="1-3 Yrs">1-3 Years</option>
                <option value="3-5 Yrs">3-5 Years</option>
                <option value="5+ Yrs">5+ Years</option>
              </select>
            </label>

            <label>
              Work Mode
              <select name="workMode" value={form.workMode} onChange={onChange}>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <label>
              Location *
              <input
                name="location"
                value={form.location}
                onChange={onChange}
                placeholder="e.g. Pune, Bengaluru, or Remote"
              />
              {errors.location && <span className="field-error">{errors.location}</span>}
            </label>

            <label>
              Salary / Stipend Range
              <input
                name="stipendOrSalary"
                value={form.stipendOrSalary}
                onChange={onChange}
                placeholder="e.g. ₹6 – 9 LPA or ₹25,000 / month"
              />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <label>
              Department / Functional Area
              <input
                name="department"
                value={form.department}
                onChange={onChange}
                placeholder="e.g. Engineering, Product Design"
              />
            </label>

            <label>
              Application Deadline *
              <input
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={onChange}
              />
              {errors.deadline && <span className="field-error">{errors.deadline}</span>}
            </label>
          </div>

          <label>
            Required Skills (comma separated)
            <input
              name="skills"
              value={form.skills}
              onChange={onChange}
              placeholder="e.g. React, Node.js, Express, MongoDB, JavaScript"
            />
          </label>

          <label>
            Candidate Eligibility
            <input
              name="eligibility"
              value={form.eligibility}
              onChange={onChange}
              placeholder="e.g. B.E./B.Tech in Computer Science, MCA, or relevant experience"
            />
          </label>

          <label>
            Detailed Job Description *
            <textarea
              name="description"
              rows="5"
              value={form.description}
              onChange={onChange}
              placeholder="Describe the company mission, team culture, project scope, and what makes this vacancy special..."
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </label>

          <label>
            Key Roles &amp; Responsibilities (one per line)
            <textarea
              name="responsibilities"
              rows="4"
              value={form.responsibilities}
              onChange={onChange}
              placeholder="Develop clean and responsive UI components in React&#10;Build RESTful microservices in Node.js&#10;Collaborate with product managers and QA team"
            />
          </label>

          <div className="row gap-12" style={{ marginTop: '20px' }}>
            <button
              type="submit"
              className="btn btn-orange btn-lg"
              disabled={busy}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Send size={16} />
              <span>{busy ? 'Publishing Vacancy…' : editing ? 'Save Changes' : 'Publish Vacancy Now'}</span>
            </button>
            <Link to="/manage" className="btn btn-outline btn-lg">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
