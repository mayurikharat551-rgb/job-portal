import { Link, useLocation } from 'react-router-dom';
import {
  CheckCircle2,
  FileText,
  Briefcase,
  Target,
  ArrowRight,
} from 'lucide-react';

export default function ThankYou() {
  const { state } = useLocation();

  return (
    <div className="container" style={{ maxWidth: '640px', margin: '40px auto' }}>
      <div className="card text-center" style={{ padding: '40px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckCircle2 size={44} color="#059669" strokeWidth={2.5} />
          </div>
        </div>

        <h1 style={{ color: '#059669', marginBottom: '8px' }}>Application Sent Successfully!</h1>

        {state?.title ? (
          <p style={{ fontSize: '1.05rem', color: '#1e293b' }}>
            Your application for <strong>{state.title}</strong> has been transmitted directly to{' '}
            <strong>{state.company}</strong>'s hiring team.
          </p>
        ) : (
          <p style={{ fontSize: '1.05rem', color: '#1e293b' }}>
            Your application has been received by the company recruiter.
          </p>
        )}

        <div
          style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '12px',
            padding: '16px',
            margin: '24px 0',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              fontWeight: '700',
              color: '#065f46',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Target size={16} color="#059669" />
            <span>What happens next?</span>
          </div>
          <ol style={{ paddingLeft: '20px', fontSize: '0.88rem', color: '#15803d', lineHeight: '1.7' }}>
            <li>The employer reviews your resume and profile skills.</li>
            <li>If your profile matches, the company will mark you as <strong>Shortlisted</strong>.</li>
            <li>You can check your status anytime on your <strong>My Applications</strong> tracker.</li>
          </ol>
        </div>

        <div className="row" style={{ justifyContent: 'center', gap: '12px' }}>
          <Link
            to="/applications"
            className="btn btn-primary btn-lg"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <FileText size={16} />
            <span>Track Application Status</span>
          </Link>
          <Link
            to="/jobs"
            className="btn btn-outline btn-lg"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Briefcase size={16} />
            <span>Browse More Vacancies</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
