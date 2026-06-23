import { usersStorage, skillsStorage, projectsStorage, experiencesStorage, achievementsStorage, portFolioStorage, caseStudiesStorage, certificationsStorage } from './lib/storage.js';
import { hashPassword } from './lib/auth.js';
import { fileURLToPath } from 'url';

async function backfillMissingRecords(storage, records, uniqueKey) {
  const existingRecords = await storage.findAll();
  const existingValues = new Set(existingRecords.map((record) => record[uniqueKey]));

  let insertedCount = 0;
  for (const record of records) {
    if (existingValues.has(record[uniqueKey])) {
      continue;
    }

    await storage.create(record);
    insertedCount += 1;
  }

  return insertedCount;
}

function getMissingFields(existingRecord, defaultRecord) {
  const patch = {};

  for (const [key, value] of Object.entries(defaultRecord)) {
    if (key === '_id' || key === 'createdAt' || key === 'updatedAt') {
      continue;
    }

    const currentValue = existingRecord[key];
    const isMissingArray = Array.isArray(value) && (!Array.isArray(currentValue) || currentValue.length === 0);
    const isMissingObject = value && typeof value === 'object' && !Array.isArray(value) && (!currentValue || typeof currentValue !== 'object');
    const isMissingPrimitive = currentValue === undefined || currentValue === null || currentValue === '';

    if (isMissingArray || isMissingObject || isMissingPrimitive) {
      patch[key] = value;
    }
  }

  return patch;
}

async function repairDefaultRecords(storage, records, uniqueKey) {
  const existingRecords = await storage.findAll();
  const recordMap = new Map(existingRecords.map((record) => [record[uniqueKey], record]));

  let updatedCount = 0;
  for (const record of records) {
    const existingRecord = recordMap.get(record[uniqueKey]);
    if (!existingRecord) {
      continue;
    }

    const patch = getMissingFields(existingRecord, record);
    if (Object.keys(patch).length === 0) {
      continue;
    }

    await storage.updateById(existingRecord._id, patch);
    updatedCount += 1;
  }

  return updatedCount;
}

async function mergeMissingSkillsIntoCategories(storage, categories) {
  const existingCategories = await storage.findAll();
  const categoryMap = new Map(existingCategories.map((category) => [category.category, category]));

  let updatedCount = 0;
  for (const category of categories) {
    const existingCategory = categoryMap.get(category.category);
    if (!existingCategory) {
      continue;
    }

    const existingSkills = Array.isArray(existingCategory.skills) ? existingCategory.skills : [];
    const existingSkillNames = new Set(existingSkills.map((skill) => skill.name));
    const missingSkills = category.skills.filter((skill) => !existingSkillNames.has(skill.name));

    if (missingSkills.length === 0) {
      continue;
    }

    await storage.updateById(existingCategory._id, {
      skills: [...existingSkills, ...missingSkills],
    });
    updatedCount += 1;
  }

  return updatedCount;
}

async function seedCollectionIfEmpty(storage, records, label) {
  const existingRecords = await storage.findAll();
  if (existingRecords.length > 0) {
    return false;
  }

  for (const record of records) {
    await storage.create(record);
  }

  console.log(`✅ ${label} data created`);
  return true;
}

// Bump this whenever the default content below changes. On the next cold start, an existing
// deployment whose stored content is older is refreshed once from these defaults; after that,
// edits made in the admin dashboard are left alone until the version changes again.
export const CONTENT_VERSION = '2026-09-cv-refresh';

const LINKS = {
  github: 'https://github.com/advitiyaranjan',
  linkedin: 'https://www.linkedin.com/in/advitiya-ranjan',
  twitter: 'https://x.com/advitiyaranjan',
  leetcode: 'https://leetcode.com/advitiyaranjan',
  website: 'https://advitiyaranjan.in',
  email: 'ranjanadvitiya@gmail.com',
};

const portfolioContent = {
  fullName: 'Advitiya Ranjan',
  title: 'Full Stack Developer & AI/ML Engineer',
  bio: 'I build scalable full-stack products with React, Node.js and TypeScript, and bring machine learning into them with PyTorch. Integrated B.Tech (IT) + MBA at IIITM Gwalior, GATE 2026 qualified and a Google Student Ambassador.',
  aboutDescription: "I'm pursuing an Integrated B.Tech (IT) + MBA at the Indian Institute of Information Technology and Management, Gwalior, where I work at the intersection of engineering and product thinking.\n\nI've shipped full-stack features as a Full Stack Developer Intern at Codec Technologies, analysed 50,000+ telemetry records in Deloitte's data analytics simulation, and now represent Google Gemini on campus as a Google Student Ambassador, running workshops for a 1,000+ strong student developer community.\n\nAlongside building, I qualified GATE 2026 in Computer Science (AIR 3460), have solved 500+ DSA problems, and hold certifications from Google, DeepLearning.AI, Meta and Cisco.",
  education: {
    institution: 'Indian Institute of Information Technology and Management, Gwalior',
    shortName: 'IIITM Gwalior',
    degree: 'Integrated B.Tech (IT) + M.B.A.',
    period: '2023 – 2028',
    cgpa: '7.96',
  },
  email: LINKS.email,
  phone: '+91 9430435643',
  location: 'IIITM Gwalior, Madhya Pradesh, India',
  resumeLink: '/Advitiya_Ranjan_Resume.pdf',
  socialLinks: {
    github: LINKS.github,
    linkedin: LINKS.linkedin,
    twitter: LINKS.twitter,
    leetcode: LINKS.leetcode,
    website: LINKS.website,
    email_link: `mailto:${LINKS.email}`,
  },
  stats: {
    projectsCompleted: 7,
    yearsExperience: 1,
    usersImpacted: 1,
    technologiesCount: 30,
  },
  heroHighlights: [
    { value: 'AIR 3460', label: 'GATE 2026 · CS' },
    { value: '500+', label: 'DSA problems' },
    { value: '1K+', label: 'Students reached' },
  ],
  aboutHighlights: [
    {
      id: 1,
      icon: 'Code',
      title: 'Full Stack Engineering',
      description: 'React, Next.js, Node.js, Express and TypeScript, from REST APIs and MongoDB schemas to deployed, responsive interfaces.',
    },
    {
      id: 2,
      icon: 'Lightbulb',
      title: 'AI & Machine Learning',
      description: 'PyTorch, TensorFlow and scikit-learn for deep learning, computer vision and practical ML features.',
    },
    {
      id: 3,
      icon: 'Users',
      title: 'Community & Leadership',
      description: 'Google Student Ambassador, Chairman of the IIITM Hindi Club and Social Media Head at Rotaract.',
    },
    {
      id: 4,
      icon: 'Target',
      title: 'Problem Solver',
      description: 'GATE 2026 AIR 3460 and 500+ DSA problems solved across LeetCode, Codeforces and GeeksforGeeks.',
    },
  ],
};

const skillCategories = [
  {
    category: 'Languages',
    skills: ['C/C++', 'Python', 'JavaScript (ES6+)', 'TypeScript', 'SQL', 'Solidity'].map((name) => ({ name })),
    order: 1,
  },
  {
    category: 'Frameworks & Libraries',
    skills: ['React.js', 'Next.js', 'Node.js', 'Express.js', 'PyTorch', 'TensorFlow', 'Scikit-learn', 'Web3.js', 'Hardhat', 'REST APIs'].map((name) => ({ name })),
    order: 2,
  },
  {
    category: 'AI & ML',
    skills: ['Machine Learning', 'Deep Learning', 'Neural Networks', 'Generative AI', 'Prompt Engineering', 'Computer Vision', 'Vertex AI'].map((name) => ({ name })),
    order: 3,
  },
  {
    category: 'Databases, Cloud & Tools',
    skills: ['MongoDB', 'MySQL', 'Firebase', 'Supabase', 'AWS', 'Google Cloud', 'Git', 'GitHub', 'Docker', 'Jira', 'Postman', 'Linux'].map((name) => ({ name })),
    order: 4,
  },
  {
    category: 'Core Fundamentals',
    skills: ['Data Structures & Algorithms', 'OOP', 'Operating Systems', 'Computer Networks', 'DBMS', 'Computer Architecture', 'System Design', 'SDLC', 'Agile & Scrum'].map((name) => ({ name })),
    order: 5,
  },
];

const projects = [
  {
    title: 'ViswaKart: E-commerce Platform',
    description: 'Full-stack e-commerce platform with Clerk authentication, a dynamic product catalogue, cart management and secure Stripe payments.',
    highlights: [
      'RESTful Node.js/Express APIs for products, orders and users, backed by MongoDB with optimised query indexing',
      'Frontend on Vercel and backend on Render, with sub-2s page loads and seamless cross-device responsiveness',
    ],
    techStack: ['React.js (Vite)', 'Node.js', 'Express', 'MongoDB', 'Clerk', 'Stripe'],
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop',
    githubLink: 'https://github.com/advitiyaranjan/ViswaKart',
    liveLink: 'https://ecom.advitiyaranjan.in',
    gradient: 'from-blue-500 to-cyan-500',
    color: 'blue',
    order: 1,
  },
  {
    title: 'Personal Portfolio',
    description: 'This site: a serverless React + TypeScript portfolio with a password-protected admin dashboard that manages every section without a separate database.',
    highlights: [
      'Serverless API on Vercel with JSON/Blob storage and a JWT-secured admin dashboard',
      'Futuristic UI with light and dark themes, responsive layouts and smooth transitions',
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Vercel'],
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=300&fit=crop',
    githubLink: 'https://github.com/advitiyaranjan/my-portfolio',
    liveLink: 'https://advitiyaranjan.in',
    gradient: 'from-indigo-500 to-blue-500',
    color: 'indigo',
    order: 2,
  },
  {
    title: 'AI-Powered Finance Tracker',
    description: 'Intelligent expense tracker with a React frontend and a Flask REST API for real-time transaction logging and categorisation.',
    highlights: [
      'PyTorch + scikit-learn model analyses spending patterns and generates personalised budget recommendations with 85%+ prediction accuracy',
      'Interactive Chart.js dashboards for monthly trends, category breakdowns and AI-generated savings insights',
    ],
    techStack: ['React', 'Python', 'Flask', 'PyTorch', 'Scikit-learn', 'Chart.js'],
    imageUrl: 'https://images.unsplash.com/photo-1533750349088-75e1b6b6a45f?w=500&h=300&fit=crop',
    githubLink: 'https://github.com/advitiyaranjan/ai-finance-tracker',
    liveLink: '',
    gradient: 'from-yellow-500 to-orange-500',
    color: 'yellow',
    order: 3,
  },
  {
    title: 'Predictive Pareto Dispatcher',
    description: 'Algorithmic dispatcher built at a national hackathon that dynamically balances operational cost against carbon emissions using Pareto optimisation.',
    highlights: [
      'Custom multi-objective optimisation formulas cut simulated operational losses by 30% while reducing emission overhead',
      'Stress-tested against 10,000+ synthetic dispatch scenarios under peak-load conditions',
    ],
    techStack: ['Python', 'Optimization Algorithms', 'System Architecture'],
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop',
    githubLink: '',
    liveLink: '',
    gradient: 'from-green-500 to-emerald-500',
    color: 'green',
    order: 4,
  },
];

const experiences = [
  {
    title: 'Student Ambassador',
    company: 'Google',
    type: 'Ambassador Program',
    location: 'IIITM Gwalior · On campus',
    description: 'Campus liaison between Google and the university, promoting Google Gemini and AI technologies to a student body of 1,000+.\nFacilitated 7 technical workshops and events, fostering a 1,000+ student developer community and increasing engagement with Google tools by an estimated 65%.',
    startDate: '2026-05-29',
    endDate: null,
    isCurrentRole: true,
    technologies: ['Google Gemini', 'Generative AI', 'Technical Workshops', 'Community Building'],
    credentialUrl: 'https://drive.google.com/file/d/1LNmxdqpx_Y6_zoEA7_6nLT1C6EzCv4Il/view',
    credentialLabel: 'Offer letter',
    gradient: 'from-blue-500 to-cyan-500',
    color: 'blue',
  },
  {
    title: 'Full Stack Developer Intern',
    company: 'Codec Technologies',
    type: 'Internship',
    location: 'Hybrid · India',
    description: 'Engineered and deployed scalable web features using React.js, Node.js and TypeScript, delivering 3+ full-stack projects during a 12-week AICTE & ICAC approved program.\nOptimised backend API performance and frontend responsiveness for an estimated 20% reduction in load times, with consistently high ratings across 12 weekly performance reviews.',
    startDate: '2026-03-28',
    endDate: '2026-06-28',
    isCurrentRole: false,
    technologies: ['React.js', 'Node.js', 'TypeScript', 'Express', 'REST APIs'],
    credentialUrl: 'https://drive.google.com/file/d/1IDCgjo2RUq7ne6ZfQtr1fahTAC9Gj8y7/view?usp=sharing',
    credentialLabel: 'Certificate',
    gradient: 'from-purple-500 to-pink-500',
    color: 'purple',
  },
  {
    title: 'Data Analyst',
    company: 'Deloitte',
    type: 'Job Simulation · Forage',
    location: 'Remote',
    description: 'Analysed 50,000+ telemetry records across multiple industrial locations using SQL and Tableau to track and visualise machine downtime.\nDelivered actionable insights for client business problems, streamlining data reporting and identifying patterns that could reduce operational inefficiencies by 90%.',
    startDate: '2026-03-01',
    endDate: '2026-03-29',
    isCurrentRole: false,
    technologies: ['SQL', 'Tableau', 'Data Analysis', 'Forensic Technology'],
    credentialUrl: 'https://drive.google.com/file/d/101aclxju0aURa327ZccXFLW8doXdL_Ew/view?usp=sharing',
    credentialLabel: 'Certificate',
    gradient: 'from-green-500 to-emerald-500',
    color: 'green',
  },
  {
    title: 'Blockchain & Governance Research',
    company: 'Working Group on Technology for Viksit Bharat',
    type: 'Research',
    location: 'India · Remote',
    description: 'Researched and prototyped blockchain-based governance systems to improve transparency, security and efficiency in public service delivery.\nDesigned use-cases for Decentralized Identity (DID) and smart contracts in citizen authentication, land records and subsidy automation.\nExplored AI-driven policy analytics, IoT-enabled infrastructure monitoring and integration with Digital Public Goods.',
    startDate: '2025-02-01',
    endDate: '2025-07-31',
    isCurrentRole: false,
    technologies: ['Blockchain', 'Smart Contracts', 'Decentralized Identity (DID)', 'AI Policy Analytics', 'IoT'],
    gradient: 'from-orange-500 to-red-500',
    color: 'orange',
  },
];

const achievements = [
  {
    icon: 'Award',
    title: 'GATE 2026 Qualified',
    subtitle: 'Computer Science & Information Technology',
    description: 'Secured All India Rank 3460 among 211,020 candidates with a GATE score of 589 and 50.41 marks out of 100, showing strong command of algorithms, operating systems, networks and DBMS.',
    details: ['AIR 3460', 'GATE Score 589', '50.41 / 100 marks', '211,020 candidates'],
    gradient: 'from-blue-500 to-cyan-500',
    color: 'blue',
    order: 1,
    link: 'https://drive.google.com/file/d/1hRbjxoTqNtuv89K-Rr839Qv8niUzSpeE/view?usp=drivesdk',
  },
  {
    icon: 'Target',
    title: 'National Youth Festival 2025 Finalist',
    subtitle: 'Tech for Viksit Bharat',
    description: 'Ranked among the top 1,000 of 30,00,000+ participants nationwide for an innovative, tech-driven solution to modernise public governance and citizen services.',
    details: ['Top 1,000 nationally', '30 lakh+ participants', 'Governance technology'],
    gradient: 'from-purple-500 to-pink-500',
    color: 'purple',
    order: 2,
  },
  {
    icon: 'Users',
    title: 'Chairman, IIITM Hindi Club',
    subtitle: 'Cultural & Literary Leadership',
    description: 'Led and organised 50+ cultural and literary events blending Hindi language promotion with modern digital platforms; managed a 20+ member core team and grew participation by over 60% year-on-year.',
    details: ['50+ events', '20+ member core team', '+60% YoY participation'],
    gradient: 'from-orange-500 to-red-500',
    color: 'orange',
    order: 3,
  },
  {
    icon: 'Megaphone',
    title: 'Social Media Head, Rotaract Club',
    subtitle: 'IIITM Gwalior',
    description: "Designed and executed digital outreach campaigns, content strategy and brand identity for community service initiatives, tripling the club's social media following and boosting volunteer recruitment.",
    details: ['3x social following', 'Content strategy', 'Brand identity'],
    gradient: 'from-purple-500 to-pink-500',
    color: 'purple',
    order: 4,
  },
  {
    icon: 'Code',
    title: 'Competitive Programming',
    subtitle: '500+ DSA Problems Solved',
    description: 'Solved 500+ data structures and algorithms problems across LeetCode, Codeforces and GeeksforGeeks, covering dynamic programming, graphs, trees, sorting and greedy algorithms.',
    details: ['LeetCode', 'Codeforces', 'GeeksforGeeks'],
    gradient: 'from-green-500 to-emerald-500',
    color: 'green',
    order: 5,
    link: LINKS.leetcode,
  },
];

const certifications = [
  {
    title: 'Google AI Professional Certificate',
    issuer: 'Google',
    platform: 'Coursera',
    issueDate: '2026-08-21',
    credentialId: 'O3NWLOUN6T5V',
    verifyUrl: 'https://coursera.org/verify/professional-cert/O3NWLOUN6T5V',
    description: 'Seven-course program on applying AI to brainstorming, research, writing, content creation, data analysis and app building, with a portfolio of 20+ AI-built artifacts.',
    modules: ['AI Fundamentals', 'AI for Research & Insights', 'AI for Data Analysis', 'AI for App Building'],
    order: 1,
  },
  {
    title: 'PyTorch for Deep Learning Professional Certificate',
    issuer: 'DeepLearning.AI',
    platform: 'Coursera',
    issueDate: '2026-08-30',
    credentialId: 'E8T0O3OA2FV4',
    verifyUrl: 'https://coursera.org/verify/professional-cert/E8T0O3OA2FV4',
    description: 'Three-course program from PyTorch fundamentals to advanced architectures and deployment, tackling computer vision and NLP with TorchVision and Hugging Face models.',
    modules: ['PyTorch Fundamentals', 'Techniques & Ecosystem Tools', 'Advanced Architectures & Deployment'],
    order: 2,
  },
  {
    title: 'Google Project Management Professional Certificate',
    issuer: 'Google',
    platform: 'Coursera',
    issueDate: '2026-08-24',
    credentialId: 'GM3C7IYE8SNL',
    verifyUrl: 'https://coursera.org/verify/professional-cert/GM3C7IYE8SNL',
    description: 'Seven-course program covering the full project lifecycle: initiating, planning and running traditional and Agile projects, risk management and stakeholder communication.',
    modules: ['Project Initiation', 'Project Planning', 'Agile Project Management', 'Capstone'],
    order: 3,
  },
  {
    title: 'Programming in Python',
    issuer: 'Meta',
    platform: 'Coursera',
    issueDate: '2026-08-28',
    credentialId: 'QQX1FFPDQTXM',
    verifyUrl: 'https://coursera.org/verify/QQX1FFPDQTXM',
    description: 'Core Python programming: object-oriented and functional paradigms, data structures, algorithms, file I/O and scripting best practices.',
    modules: ['OOP', 'Data Structures', 'Functional Programming', 'File I/O'],
    order: 4,
  },
  {
    title: 'Networking Basics',
    issuer: 'Cisco',
    platform: 'Cisco Networking Academy',
    issueDate: '2026-08-26',
    credentialId: '4b496569-0d5d-49e4-be15-d5a6feab9e48',
    verifyUrl: 'https://www.netacad.com/certificates/4b496569-0d5d-49e4-be15-d5a6feab9e48',
    description: 'Computer networking foundations: OSI and TCP/IP models, IP addressing and subnetting, routing and switching, and network security basics.',
    modules: ['OSI & TCP/IP', 'IP Addressing', 'Routing & Switching', 'Network Security'],
    order: 5,
  },
  {
    title: 'Google AI Essentials',
    issuer: 'Google',
    platform: 'Coursera',
    issueDate: '2026-05-20',
    credentialId: 'DL6WORWYKUR6',
    verifyUrl: 'https://coursera.org/verify/specialization/DL6WORWYKUR6',
    description: 'Five-course specialization on generative AI fundamentals, effective prompting, responsible AI use and boosting productivity with AI tools.',
    modules: ['Introduction to AI', 'Prompting', 'Responsible AI', 'AI Productivity'],
    order: 6,
  },
  {
    title: 'Data Analytics Job Simulation',
    issuer: 'Deloitte',
    platform: 'Forage',
    issueDate: '2026-03-29',
    credentialId: '',
    verifyUrl: 'https://drive.google.com/file/d/101aclxju0aURa327ZccXFLW8doXdL_Ew/view?usp=sharing',
    description: 'Completed practical tasks in data analysis and forensic technology.',
    modules: ['Data Analysis', 'Forensic Technology'],
    order: 7,
  },
];

async function applyContentUpdate() {
  const [portfolio] = await portFolioStorage.findAll();
  if (!portfolio || portfolio.contentVersion === CONTENT_VERSION) {
    return false;
  }

  await skillsStorage.replaceAll(skillCategories);
  await projectsStorage.replaceAll(projects);
  await experiencesStorage.replaceAll(experiences);
  await achievementsStorage.replaceAll(achievements);
  await certificationsStorage.replaceAll(certifications);

  // Keep what the refresh does not cover (profile photo, view count, extra social links).
  await portFolioStorage.updateById(portfolio._id, {
    ...portfolioContent,
    socialLinks: { ...(portfolio.socialLinks || {}), ...portfolioContent.socialLinks },
    contentVersion: CONTENT_VERSION,
    lastUpdated: new Date().toISOString(),
  });

  console.log(`✅ Content refreshed to ${CONTENT_VERSION}`);
  return true;
}

async function seedData() {
  console.log('🌱 Seeding data...');

  // Create default admin user from environment variables
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn('⚠️ ADMIN_EMAIL or ADMIN_PASSWORD env vars not set — skipping admin user creation.');
  } else {
    const existingUser = await usersStorage.findOne({ email: adminEmail });
    if (!existingUser) {
      const hashedPassword = await hashPassword(adminPassword);
      await usersStorage.create({
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Admin user created');
    }
  }

  if ((await portFolioStorage.findAll()).length === 0) {
    await portFolioStorage.create({
      ...portfolioContent,
      profileImage: '/images/profile.jpg',
      viewCount: 0,
      contentVersion: CONTENT_VERSION,
    });
    console.log('✅ Portfolio data created');
  }

  await seedCollectionIfEmpty(skillsStorage, skillCategories, 'Skills');
  await seedCollectionIfEmpty(projectsStorage, projects, 'Projects');
  await seedCollectionIfEmpty(experiencesStorage, experiences, 'Experiences');
  await seedCollectionIfEmpty(achievementsStorage, achievements, 'Achievements');
  await seedCollectionIfEmpty(certificationsStorage, certifications, 'Certifications');
  await applyContentUpdate();

  // Seed case studies
  const caseStudies = [
      {
        title: 'Blockchain-Based Governance Research',
        description: 'Comprehensive research and development of blockchain solutions for government transparency and citizen services.',
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
        challenge: 'Government systems lacked transparency, security, and efficiency in public service delivery. There was a need for innovative technological solutions to enhance citizen engagement and streamline processes.',
        solution: 'Developed comprehensive blockchain architecture combining DID, smart contracts, AI analytics, and IoT monitoring to create transparent, secure, and efficient digital governance systems.',
        results: 'National Youth Festival 2025 Finalist | 95% transparency increase | 100+ public services digitized | Zero fraud incidents',
        technologies: ['Blockchain', 'Solidity', 'Smart Contracts', 'DID', 'AI', 'IoT', 'Node.js'],
        link: 'https://github.com/advitiyaranjan',
        order: 1
      },
      {
        title: 'Campus Connect - Real-Time Student Platform',
        description: 'Full-stack platform enabling students to share academic resources, find internship opportunities, and connect with peers in real-time.',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
        challenge: 'Students at IIITM Gwalior were struggling to share academic resources, find internship opportunities, and connect with peers. No centralized platform existed for real-time communication and resource sharing.',
        solution: 'Launched comprehensive platform featuring real-time chat, note/paper sharing, event announcements, internship opportunities, and role-based permissions with Socket.io.',
        results: '100+ concurrent users | 5000+ resources shared | 250+ internship opportunities | 99.9% uptime',
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'JWT', 'Tailwind CSS'],
        link: 'https://github.com/advitiyaranjan/campus-connect',
        order: 2
      },
      {
        title: 'GATE 2026 Achievement - AIR 3460',
        description: 'Qualified in GATE 2026 (Graduate Aptitude Test in Engineering) with outstanding performance among 211,020 candidates.',
        imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=500&h=300&fit=crop',
        challenge: 'Competitive examination requiring mastery of computer science fundamentals, algorithms, data structures, and comprehensive technical knowledge across multiple domains.',
        solution: 'Systematic study of core CS concepts and advanced topics, rigorous practice with mock tests and problem solving, deep understanding of algorithms and data structures.',
        results: 'Qualified in GATE 2026 | AIR 3460 | Score 589/1000 | 50.41 marks',
        technologies: ['Data Structures', 'Algorithms', 'Database Systems', 'Operating Systems', 'Networks', 'Compiler Design'],
        link: null,
        order: 3
      }
    ];

  await seedCollectionIfEmpty(caseStudiesStorage, caseStudies, 'Case studies');

  console.log('✨ Data seeding complete!');
}

export default seedData;

const isDirectExecution = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectExecution) {
  seedData().catch(err => {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  });
}
