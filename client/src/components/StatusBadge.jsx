import {
  Star,
  FileText,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  Sparkles,
  Briefcase,
  GraduationCap,
} from 'lucide-react';

export default function StatusBadge({ status }) {
  if (status === 'Shortlisted') {
    return (
      <span className="badge-shortlisted-glow">
        <Star size={13} fill="currentColor" strokeWidth={2} />
        <span>Shortlisted by Company</span>
      </span>
    );
  }

  const map = {
    Submitted: {
      label: 'Application Submitted',
      cls: 'badge-blue',
      icon: <FileText size={12} strokeWidth={2.2} />,
    },
    'Under Review': {
      label: 'Under Review',
      cls: 'badge-amber',
      icon: <Clock size={12} strokeWidth={2.2} />,
    },
    'Interview Scheduled': {
      label: 'Interview Scheduled',
      cls: 'badge-purple',
      icon: <Calendar size={12} strokeWidth={2.2} />,
    },
    Selected: {
      label: 'Selected / Hired',
      cls: 'badge-green',
      icon: <CheckCircle2 size={12} strokeWidth={2.2} />,
    },
    Rejected: {
      label: 'Archived / Not Selected',
      cls: 'badge-gray',
      icon: <XCircle size={12} strokeWidth={2.2} />,
    },
    active: {
      label: 'Active Opening',
      cls: 'badge-green',
      icon: <Sparkles size={12} strokeWidth={2.2} />,
    },
    closed: {
      label: 'Closed',
      cls: 'badge-gray',
      icon: <XCircle size={12} strokeWidth={2.2} />,
    },
    job: {
      label: 'Full-Time Job',
      cls: 'badge-blue',
      icon: <Briefcase size={12} strokeWidth={2.2} />,
    },
    internship: {
      label: 'Internship',
      cls: 'badge-orange',
      icon: <GraduationCap size={12} strokeWidth={2.2} />,
    },
  };

  const item = map[status] || {
    label: status,
    cls: 'badge-gray',
    icon: <Briefcase size={12} />,
  };

  return (
    <span className={`badge ${item.cls}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
      {item.icon}
      <span>{item.label}</span>
    </span>
  );
}
