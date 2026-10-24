import { Link } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  Building2,
  Clock,
  CheckCircle2,
  Check,
  Star,
  ArrowRight,
  IndianRupee,
} from 'lucide-react';

const getCompanyColor = (name = '') => {
  const colors = [
    'linear-gradient(135deg, #185adf, #0b3ba3)',
    'linear-gradient(135deg, #f97316, #c2410c)',
    'linear-gradient(135deg, #059669, #047857)',
    'linear-gradient(135deg, #7c3aed, #5b21b6)',
    'linear-gradient(135deg, #db2777, #9d174d)',
    'linear-gradient(135deg, #0284c7, #0369a1)',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export default function JobCard({ job, isApplied = false, isShortlisted = false }) {
  const initials = (job.company || 'C')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const daysAgo = Math.max(
    0,
    Math.floor((Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24))
  );

  return (
    <article className="job-card">
      <div className="job-card-header">
        <div className="company-logo-avatar" style={{ background: getCompanyColor(job.company) }}>
          {initials}
        </div>
        <div className="job-title-area">
          <h3 className="job-card-title">
            <Link to={`/jobs/${job._id}`}>{job.title}</Link>
          </h3>
          <div className="company-subname">
            <span>{job.company}</span>
            <CheckCircle2 size={14} color="#059669" fill="#dcfce7" title="Verified Company" />
            <span className="badge badge-gray" style={{ fontSize: '0.72rem', padding: '1px 6px' }}>
              {job.type === 'internship' ? 'Internship' : 'Full-Time'}
            </span>
          </div>
        </div>
      </div>

      <div className="job-meta-row">
        <span className="job-meta-item" title="Experience Required">
          <Briefcase size={13} color="#64748b" />
          <span>{job.experience || '0-2 Yrs'}</span>
        </span>
        <span className="job-meta-item" title="Salary / Stipend">
          <IndianRupee size={13} color="#64748b" />
          <span>{job.stipendOrSalary || 'Competitive CTC'}</span>
        </span>
        <span className="job-meta-item" title="Job Location">
          <MapPin size={13} color="#64748b" />
          <span>{job.location}</span>
        </span>
        <span className="job-meta-item" title="Work Mode">
          <Building2 size={13} color="#64748b" />
          <span>{job.workMode || 'On-site'}</span>
        </span>
      </div>

      <p className="job-desc-snippet">{job.description}</p>

      <div className="chips-list">
        {(job.skills || []).slice(0, 4).map((s) => (
          <span key={s} className="chip">
            {s}
          </span>
        ))}
        {(job.skills || []).length > 4 && (
          <span className="chip muted" style={{ background: '#f1f5f9' }}>
            +{job.skills.length - 4} more
          </span>
        )}
      </div>

      <div className="job-card-footer">
        <span className="posted-time" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <Clock size={12} color="#94a3b8" />
          <span>{daysAgo === 0 ? 'Posted today' : `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`}</span>
        </span>

        {isShortlisted ? (
          <span className="badge-shortlisted-glow">
            <Star size={12} fill="currentColor" />
            <span>Shortlisted!</span>
          </span>
        ) : isApplied ? (
          <span className="badge badge-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Check size={12} strokeWidth={2.5} />
            <span>Applied</span>
          </span>
        ) : (
          <Link
            to={`/jobs/${job._id}`}
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span>View &amp; Apply</span>
            <ArrowRight size={13} />
          </Link>
        )}
      </div>
    </article>
  );
}
