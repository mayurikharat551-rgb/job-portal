import { Routes, Route, Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Welcome from './pages/Welcome.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import JobDetails from './pages/JobDetails.jsx';
import Applications from './pages/Applications.jsx';
import Profile from './pages/Profile.jsx';
import ThankYou from './pages/ThankYou.jsx';
import ManageJobs from './pages/ManageJobs.jsx';
import JobForm from './pages/JobForm.jsx';
import Applicants from './pages/Applicants.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Home />} />
          <Route path="/jobs/:id" element={<JobDetails />} />

          <Route
            path="/applications"
            element={
              <ProtectedRoute roles={['student']}>
                <Applications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/thank-you"
            element={
              <ProtectedRoute roles={['student']}>
                <ThankYou />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manage"
            element={
              <ProtectedRoute roles={['employer', 'admin']}>
                <ManageJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage/new"
            element={
              <ProtectedRoute roles={['employer', 'admin']}>
                <JobForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage/:id/edit"
            element={
              <ProtectedRoute roles={['employer', 'admin']}>
                <JobForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage/:id/applicants"
            element={
              <ProtectedRoute roles={['employer', 'admin']}>
                <Applicants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Professional Naukri-style 4-column Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div>
              <div className="footer-brand">
                <span className="brand-mark" style={{ fontSize: '0.9rem', padding: '2px 7px' }}>
                  JP
                </span>
                <span>job portal</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', maxWidth: '340px' }}>
                India's trusted career &amp; recruitment platform. Connecting millions of ambitious job seekers
                with world-class companies and recruiters.
              </p>
              <div style={{ marginTop: '14px', fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} color="#60a5fa" />
                <span>Tech Hubs: Bengaluru · Pune · Gurgaon · Hyderabad · Mumbai</span>
              </div>
            </div>

            <div className="footer-col">
              <h4>For Job Seekers</h4>
              <ul>
                <li>
                  <Link to="/jobs">Search Vacancies</Link>
                </li>
                <li>
                  <Link to="/jobs?type=internship">Internship Programs</Link>
                </li>
                <li>
                  <Link to="/applications">My Application Status</Link>
                </li>
                <li>
                  <Link to="/jobs?workMode=Remote">Remote Opportunities</Link>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>For Employers &amp; Companies</h4>
              <ul>
                <li>
                  <Link to="/manage/new">Post a Vacancy</Link>
                </li>
                <li>
                  <Link to="/manage">Recruiter Dashboard</Link>
                </li>
                <li>
                  <Link to="/login?role=employer">Company Login</Link>
                </li>
                <li>
                  <Link to="/register?role=employer">Register as Employer</Link>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Popular Roles</h4>
              <ul>
                <li>
                  <Link to="/jobs?q=React">MERN Stack Developers</Link>
                </li>
                <li>
                  <Link to="/jobs?q=Cloud">Cloud &amp; DevOps Engineers</Link>
                </li>
                <li>
                  <Link to="/jobs?q=Design">UI/UX Product Designers</Link>
                </li>
                <li>
                  <Link to="/jobs?experience=Fresher">Freshers &amp; Graduates</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div>© {new Date().getFullYear()} Job Portal Technologies Pvt. Ltd. All rights reserved.</div>
            <div className="row gap-16">
              <span className="muted">Privacy Policy</span>
              <span className="muted">Terms of Service</span>
              <span className="muted">Security &amp; Fraud Alert</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
