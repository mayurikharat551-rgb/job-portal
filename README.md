# CareerBridge – Online Job & Internship Portal (MERN)

A full-stack job and internship portal built from the product requirements document
(`MERN_Job_Portal_PRD.docx`). Students can browse, search, filter and apply; employers
and admins can manage listings and application statuses.

**Stack:** MongoDB · Express.js · React (Vite) · Node.js

## Features (mapped to the PRD)

| PRD | Implemented |
| --- | --- |
| FR-01 Welcome page | `Welcome.jsx` landing page with CTAs |
| FR-02 Registration | Name/email/password, duplicate-email check, student or employer role |
| FR-03 Login / Logout | JWT auth, bcrypt password hashing |
| FR-04 / FR-05 Listings + search | Cards, keyword search, type/location/skills filters, clear filters, pagination |
| FR-06 Details | Description, responsibilities, skills, eligibility, deadline, Apply |
| FR-07 Apply | Resume URL + cover letter, duplicate applications blocked (unique index + check) |
| FR-08 Tracking | My Applications with Submitted / Under Review / Shortlisted / Rejected / Selected |
| FR-09 Profile | Contact, education, skills, summary, resume URL – persisted |
| FR-10 Listing management | Create, edit, close/reopen, delete (owner or admin) |
| FR-11 Application management | Applicants table with status updates |
| FR-12 Authorization | Server-side `protect` + `authorize(roles)` and ownership checks; client `ProtectedRoute` |
| FR-13 Feedback states | Validation messages, loading spinners, empty states, alerts |

Admin panel: view/delete users and view all application records.

### Decisions on the PRD's open questions
- **Employers** can register themselves (role chosen at sign-up). Admins are created by the seed script only.
- **Resumes** are provided as URLs for the MVP.
- **Sessions** use JWT sent as a Bearer token (stored in `localStorage`).

## Project structure

```
job-portal/
├── package.json            # root scripts (run both apps)
├── server/                 # Express API
│   ├── config/db.js
│   ├── models/             # User, Job, Application
│   ├── controllers/
│   ├── routes/
│   ├── middleware/         # auth, validate, error
│   ├── seed.js             # demo data
│   └── server.js
└── client/                 # React app (Vite)
    └── src/
        ├── components/     # Navbar, JobCard, ProtectedRoute, StatusBadge, Alert, Spinner
        ├── context/        # AuthContext
        ├── pages/          # Welcome, Login, Register, Home, JobDetails, Applications,
        │                   # Profile, ThankYou, ManageJobs, JobForm, Applicants, AdminPanel
        ├── api.js
        └── styles.css
```

## Getting started

**Prerequisites:** Node.js 18+ and MongoDB running locally (or a MongoDB Atlas URI).

```bash
# 1. Install everything
npm install
npm run install:all

# 2. Configure the server
cp server/.env.example server/.env      # then edit MONGO_URI / JWT_SECRET

# 3. (Optional) load demo data
npm run seed

# 4. Run API (http://localhost:5000) and client (http://localhost:5173)
npm run dev
```

### Demo accounts (after `npm run seed`, password `password123`)
| Role | Email |
| --- | --- |
| Admin | admin@jobportal.com |
| Employer | employer@jobportal.com |
| Student | student@jobportal.com |

## API reference

| Method | Route | Access |
| --- | --- | --- |
| POST | `/api/auth/register` | public |
| POST | `/api/auth/login` | public |
| GET | `/api/jobs?q=&type=&location=&skills=&page=` | public |
| GET | `/api/jobs/:id` | public |
| GET | `/api/jobs/mine/list` | employer/admin |
| POST | `/api/jobs` | employer/admin |
| PUT | `/api/jobs/:id` | owner/admin |
| PATCH | `/api/jobs/:id/close` | owner/admin |
| DELETE | `/api/jobs/:id` | owner/admin |
| POST | `/api/jobs/:id/apply` | student |
| GET | `/api/applications/me` | logged in |
| GET | `/api/applications/job/:jobId` | owner/admin |
| PATCH | `/api/applications/:id/status` | owner/admin |
| GET | `/api/applications` | admin |
| GET / PUT | `/api/users/me` | logged in |
| GET | `/api/users` | admin |
| DELETE | `/api/users/:id` | admin |

## Security notes
Passwords hashed with bcrypt (cost 12); input validated with express-validator; `helmet`,
CORS restricted to `CLIENT_URL`, and rate limiting on auth routes; secrets in `.env`.
Before deploying, set a strong `JWT_SECRET` and consider moving the token to an httpOnly cookie.

## Production build
```bash
npm run build                    # builds client/dist
NODE_ENV=production npm start --prefix server
```
