require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

const daysFromNow = (d) => new Date(Date.now() + d * 24 * 60 * 60 * 1000);

(async () => {
  await connectDB();
  await Promise.all([User.deleteMany(), Job.deleteMany(), Application.deleteMany()]);

  const hash = await User.hashPassword('password123');
  const adminHash = await User.hashPassword('1234567890');

  const [admin, employerTechNova, employerGoogle, employerZomato, studentAarav, studentPriya] =
    await User.create([
      {
        name: 'Mayuri Kharat (Admin)',
        email: 'mayurikharat8080@gmail.com',
        passwordHash: adminHash,
        role: 'admin',
      },
      {
        name: 'Riya Recruiter',
        email: 'employer@jobportal.com',
        passwordHash: hash,
        role: 'employer',
        companyName: 'TechNova Solutions',
        companyWebsite: 'https://technova.io',
        companyLocation: 'Pune / Remote',
        phone: '+91 98200 11223',
      },
      {
        name: 'Vikram Seth',
        email: 'google.recruiter@jobportal.com',
        passwordHash: hash,
        role: 'employer',
        companyName: 'Google Cloud India',
        companyWebsite: 'https://cloud.google.com',
        companyLocation: 'Bengaluru, Karnataka',
        phone: '+91 98111 22334',
      },
      {
        name: 'Ananya Sen',
        email: 'zomato.recruiter@jobportal.com',
        passwordHash: hash,
        role: 'employer',
        companyName: 'Zomato Technologies',
        companyWebsite: 'https://zomato.com/careers',
        companyLocation: 'Gurgaon, Haryana',
        phone: '+91 98444 55667',
      },
      {
        name: 'Aarav Sharma',
        email: 'student@jobportal.com',
        passwordHash: hash,
        role: 'student',
        education: 'B.E. Computer Engineering, 2026',
        skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Express', 'Tailwind CSS'],
        phone: '+91 98765 43210',
        headline: 'Aspiring Full Stack Engineer & Open Source Contributor',
        summary:
          'Passionate software developer proficient in MERN stack, RESTful APIs, and responsive design. Looking for an energetic engineering role.',
        resumeUrl: 'https://drive.google.com/file/d/aarav-sharma-mern-resume/view',
        experienceYears: 'Fresher (0-1 yrs)',
      },
      {
        name: 'Priya Patel',
        email: 'priya@jobportal.com',
        passwordHash: hash,
        role: 'student',
        education: 'B.Des & Interactive Media, 2025',
        skills: ['Figma', 'UI/UX Design', 'User Research', 'Prototyping', 'Design Systems'],
        phone: '+91 91234 56789',
        headline: 'Product Designer | Crafting intuitive user experiences',
        summary: 'Designed 8+ digital products with strong emphasis on accessibility, design systems, and visual delight.',
        resumeUrl: 'https://drive.google.com/file/d/priya-patel-design-portfolio/view',
        experienceYears: '1-2 Yrs',
      },
    ]);

  const jobs = await Job.create([
    {
      title: 'MERN Stack Developer Intern',
      company: 'TechNova Solutions',
      description:
        'Join TechNova’s fast-growing engineering team to build scalable web products. You will work closely with senior architects building modern UI components in React and performant REST APIs in Node.js/Express with MongoDB.',
      responsibilities: [
        'Develop responsive, accessible UI modules using modern React hooks and state management',
        'Build clean RESTful backend microservices in Express.js and optimize MongoDB queries',
        'Write clean modular code and participate in agile sprints and code reviews',
      ],
      type: 'internship',
      location: 'Pune / Remote',
      skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'],
      eligibility: 'Pre-final or Final year B.Tech/B.E./MCA students with solid JS foundations',
      stipendOrSalary: '₹25,000 / month',
      experience: 'Fresher (0-1 Yrs)',
      workMode: 'Hybrid',
      department: 'Engineering',
      openingsCount: 3,
      deadline: daysFromNow(28),
      createdBy: employerTechNova._id,
    },
    {
      title: 'Junior Frontend Developer',
      company: 'TechNova Solutions',
      description:
        'Looking for a passionate Frontend Engineer who has an eye for aesthetic detail, animations, and high performance web applications.',
      responsibilities: [
        'Transform Figma mockups into pixel-perfect responsive web interfaces',
        'Optimize client-side performance and ensure cross-browser responsiveness',
        'Integrate REST APIs and handle asynchronous data loading gracefully',
      ],
      type: 'job',
      location: 'Remote',
      skills: ['React', 'JavaScript', 'CSS3', 'HTML5', 'Git'],
      eligibility: 'Bachelor’s degree in Computer Science or self-taught developers with strong portfolio',
      stipendOrSalary: '₹6.5 – 8.5 LPA',
      experience: '0-2 Yrs',
      workMode: 'Remote',
      department: 'Frontend Engineering',
      openingsCount: 2,
      deadline: daysFromNow(21),
      createdBy: employerTechNova._id,
    },
    {
      title: 'Associate Cloud Engineer',
      company: 'Google Cloud India',
      description:
        'Accelerate innovation on the Google Cloud Platform. Help enterprises deploy, automate, and monitor mission-critical cloud infrastructure and containerized workloads.',
      responsibilities: [
        'Configure and manage cloud resources using Infrastructure as Code (Terraform)',
        'Monitor Kubernetes clusters and automated CI/CD pipelines',
        'Ensure security, reliability, and automated scalability of services',
      ],
      type: 'job',
      location: 'Bengaluru',
      skills: ['GCP', 'Docker', 'Kubernetes', 'Python', 'Linux'],
      eligibility: 'Degree in Engineering, MCA, or relevant cloud certifications (GCP Associate)',
      stipendOrSalary: '₹14 – 18 LPA',
      experience: '1-3 Yrs',
      workMode: 'On-site',
      department: 'Cloud Solutions',
      openingsCount: 5,
      deadline: daysFromNow(35),
      createdBy: employerGoogle._id,
    },
    {
      title: 'UI/UX Product Design Intern',
      company: 'Zomato Technologies',
      description:
        'Help craft delightful experiences for millions of food lovers and restaurant partners every day across India.',
      responsibilities: [
        'Conduct user research and usability testing sessions with actual users',
        'Design high-fidelity wireframes, interactive flows, and production-ready components in Figma',
        'Collaborate with product managers and engineers to ship real features',
      ],
      type: 'internship',
      location: 'Gurgaon',
      skills: ['Figma', 'UI Design', 'Wireframing', 'Prototyping', 'User Research'],
      eligibility: 'Design students or recent graduates with an active portfolio',
      stipendOrSalary: '₹30,000 / month',
      experience: 'Fresher (0-1 Yrs)',
      workMode: 'Hybrid',
      department: 'Product Design',
      openingsCount: 2,
      deadline: daysFromNow(18),
      createdBy: employerZomato._id,
    },
    {
      title: 'Backend Node.js Engineer',
      company: 'TechNova Solutions',
      description:
        'Architect high-throughput event-driven microservices. Work with Redis caching, MongoDB sharding, and real-time WebSockets.',
      responsibilities: [
        'Design and implement secure authentication, payment, and notification systems',
        'Monitor server performance, database query execution times, and memory usage',
        'Implement automated test suites using Jest and Supertest',
      ],
      type: 'job',
      location: 'Pune',
      skills: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Docker'],
      eligibility: '1-3 years backend experience with strong database indexing knowledge',
      stipendOrSalary: '₹8 – 12 LPA',
      experience: '1-3 Yrs',
      workMode: 'Hybrid',
      department: 'Backend Engineering',
      openingsCount: 2,
      deadline: daysFromNow(40),
      createdBy: employerTechNova._id,
    },
    {
      title: 'Data Analyst & BI Specialist',
      company: 'Zomato Technologies',
      description:
        'Transform millions of daily orders and logistics data into actionable business intelligence dashboards.',
      responsibilities: [
        'Write complex SQL queries and build automated ETL pipelines',
        'Create interactive dashboards in Tableau and PowerBI for leadership',
        'Identify delivery trend anomalies and recommend optimization strategies',
      ],
      type: 'job',
      location: 'Gurgaon',
      skills: ['SQL', 'Python', 'Tableau', 'Excel', 'Statistics'],
      eligibility: 'Proficiency in data wrangling and SQL with 0-2 years experience',
      stipendOrSalary: '₹7.5 – 10 LPA',
      experience: '0-2 Yrs',
      workMode: 'On-site',
      department: 'Business Analytics',
      openingsCount: 3,
      deadline: daysFromNow(25),
      createdBy: employerZomato._id,
    },
  ]);

  // Seed Applications with real statuses:
  // 1. Aarav shortlisted by TechNova!
  await Application.create({
    userId: studentAarav._id,
    jobId: jobs[0]._id, // TechNova MERN Stack Developer Intern
    resumeUrl: studentAarav.resumeUrl,
    coverLetter:
      'Dear TechNova Hiring Team,\n\nI have built multiple full-stack projects including real-time collaboration apps and e-commerce portals using React and Node.js. I would love to contribute to your engineering team as an intern!',
    status: 'Shortlisted',
    recruiterFeedback:
      '🎉 Congratulations Aarav! Your profile and GitHub repository submissions have been shortlisted for Round 1 Technical Assessment. Our team is coordinating interview time slots.',
    shortlistedAt: daysFromNow(-1),
  });

  // 2. Aarav under review by Google Cloud
  await Application.create({
    userId: studentAarav._id,
    jobId: jobs[2]._id, // Google Cloud Associate Cloud Engineer
    resumeUrl: studentAarav.resumeUrl,
    coverLetter:
      'I have hands-on experience deploying containerized applications with Docker and studying GCP fundamentals.',
    status: 'Under Review',
    recruiterFeedback: 'Your resume has passed preliminary screening and is currently being reviewed by the engineering hiring committee.',
  });

  // 3. Aarav submitted to Junior Frontend Developer
  await Application.create({
    userId: studentAarav._id,
    jobId: jobs[1]._id, // TechNova Junior Frontend Developer
    resumeUrl: studentAarav.resumeUrl,
    coverLetter: 'Passionate about responsive web interfaces and micro-interactions.',
    status: 'Submitted',
  });

  // 4. Priya shortlisted by Zomato for Design Intern!
  await Application.create({
    userId: studentPriya._id,
    jobId: jobs[3]._id, // Zomato UI/UX Product Design Intern
    resumeUrl: studentPriya.resumeUrl,
    coverLetter: 'Check out my Figma case studies focusing on food ordering heuristics and accessibility.',
    status: 'Shortlisted',
    recruiterFeedback: '🌟 Excellent visual storytelling and UX research in your case study! Shortlisted for Portfolio Review Round.',
    shortlistedAt: daysFromNow(-2),
  });

  console.log('---------------------------------------------------------');
  console.log('✅ SEED SUCCESSFUL! Demo accounts (password: password123):');
  console.log('1. Candidate / User:  student@jobportal.com  (Aarav Sharma - Shortlisted in TechNova!)');
  console.log('2. Candidate / User:  priya@jobportal.com    (Priya Patel - Shortlisted in Zomato!)');
  console.log('3. Company Recruiter: employer@jobportal.com (Riya Recruiter - TechNova Solutions)');
  console.log('4. Company Recruiter: google.recruiter@jobportal.com (Google Cloud India)');
  console.log('5. Admin:             admin@jobportal.com');
  console.log('---------------------------------------------------------');

  await mongoose.disconnect();
})().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
