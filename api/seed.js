import { usersStorage, skillsStorage, projectsStorage, experiencesStorage, achievementsStorage, portFolioStorage, caseStudiesStorage } from './lib/storage.js';
import { hashPassword } from './lib/auth.js';
import { fileURLToPath } from 'url';

async function seedData() {
  console.log('🌱 Seeding data...');

  // Create default admin user
  const existingUser = await usersStorage.findOne({ email: 'advityaranjan1@gmail.com' });
  if (!existingUser) {
    const hashedPassword = await hashPassword('admin123');
    await usersStorage.create({
      name: 'Admin User',
      email: 'advityaranjan1@gmail.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('✅ Admin user created');
  }

  // Seed portfolio info
  if ((await portFolioStorage.findAll()).length === 0) {
    await portFolioStorage.create({
      fullName: 'Advitiya Ranjan',
      title: 'Full Stack Developer & Blockchain Engineer',
      bio: 'Building innovative solutions with React, Node.js, and Blockchain. GATE 2026 qualified with expertise in governance technologies, real-time systems, and emerging tech.',
      profileImage: '/images/profile.jpg',
      resumeLink: '',
      socialLinks: {
        github: 'https://github.com/advitiyaranjan',
        linkedin: 'https://www.linkedin.com/in/advitiya-ranjan',
        twitter: 'https://x.com/advitiyaranjan',
        email_link: 'mailto:advityaranjan1@gmail.com'
      }
    });
    console.log('✅ Portfolio data created');
  }

  // Seed skills
  if ((await skillsStorage.findAll()).length === 0) {
    const skillCategories = [
      {
        category: 'Frontend',
        skills: [
          { name: 'React', proficiency: 'expert', yearsOfExperience: 3 },
          { name: 'TypeScript', proficiency: 'advanced', yearsOfExperience: 2 },
          { name: 'Tailwind CSS', proficiency: 'expert', yearsOfExperience: 2 },
          { name: 'Next.js', proficiency: 'advanced', yearsOfExperience: 1 },
          { name: 'Vue.js', proficiency: 'intermediate', yearsOfExperience: 1 },
          { name: 'Redux', proficiency: 'advanced', yearsOfExperience: 2 }
        ],
        order: 1
      },
      {
        category: 'Backend',
        skills: [
          { name: 'Node.js', proficiency: 'expert', yearsOfExperience: 3 },
          { name: 'Express', proficiency: 'expert', yearsOfExperience: 3 },
          { name: 'MongoDB', proficiency: 'advanced', yearsOfExperience: 2 },
          { name: 'REST APIs', proficiency: 'expert', yearsOfExperience: 3 },
          { name: 'PostgreSQL', proficiency: 'advanced', yearsOfExperience: 1 },
          { name: 'Firebase', proficiency: 'intermediate', yearsOfExperience: 1 }
        ],
        order: 2
      },
      {
        category: 'Tools & Platforms',
        skills: [
          { name: 'Git', proficiency: 'expert', yearsOfExperience: 3 },
          { name: 'Docker', proficiency: 'intermediate', yearsOfExperience: 1 },
          { name: 'AWS', proficiency: 'intermediate', yearsOfExperience: 1 },
          { name: 'Vercel', proficiency: 'advanced', yearsOfExperience: 2 },
          { name: 'Figma', proficiency: 'intermediate', yearsOfExperience: 1 },
          { name: 'CI/CD', proficiency: 'advanced', yearsOfExperience: 1 }
        ],
        order: 3
      },
      {
        category: 'Emerging Tech',
        skills: [
          { name: 'Blockchain', proficiency: 'advanced', yearsOfExperience: 1 },
          { name: 'Smart Contracts (Solidity)', proficiency: 'advanced', yearsOfExperience: 1 },
          { name: 'AI/ML', proficiency: 'intermediate', yearsOfExperience: 1 },
          { name: 'IoT', proficiency: 'intermediate', yearsOfExperience: 1 },
          { name: 'Web3', proficiency: 'intermediate', yearsOfExperience: 1 },
          { name: 'GraphQL', proficiency: 'intermediate', yearsOfExperience: 1 }
        ],
        order: 4
      }
    ];

    for (const category of skillCategories) {
      await skillsStorage.create(category);
    }
    console.log('✅ Skills data created');
  }

  // Seed projects
  if ((await projectsStorage.findAll()).length === 0) {
    const projects = [
      {
        title: 'Blockchain-Based Governance Research',
        description: 'Comprehensive research and development of blockchain solutions for government transparency and citizen services.',
        techStack: ['Blockchain', 'Solidity', 'Smart Contracts', 'DID', 'AI', 'IoT', 'Node.js'],
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
        githubLink: 'https://github.com/advitiyaranjan',
        liveLink: 'https://governance-research.example.com',
        gradient: 'from-blue-500 to-cyan-500',
        color: 'blue',
        order: 1
      },
      {
        title: 'Blockchain Voting System',
        description: 'Secure, transparent voting platform leveraging blockchain technology to ensure tamper-proof elections and enhanced voter transparency.',
        techStack: ['Blockchain', 'Solidity', 'Ethereum', 'Web3.js', 'React', 'Node.js', 'MongoDB'],
        imageUrl: 'https://images.unsplash.com/photo-1545670723-196ed0954986?w=500&h=300&fit=crop',
        githubLink: 'https://github.com/advitiyaranjan/blockchain-voting',
        liveLink: 'https://voting.example.com',
        gradient: 'from-purple-500 to-pink-500',
        color: 'purple',
        order: 2
      },
      {
        title: 'Campus Connect - Real-Time Student Platform',
        description: 'Full-stack platform enabling students to share academic resources, find internship opportunities, and connect with peers in real-time.',
        techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'JWT', 'Tailwind CSS'],
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
        githubLink: 'https://github.com/advitiyaranjan/campus-connect',
        liveLink: 'https://campus-connect.example.com',
        gradient: 'from-green-500 to-emerald-500',
        color: 'green',
        order: 3
      },
      {
        title: 'AI-Powered Finance Tracker',
        description: 'Intelligent expense tracking and financial analytics platform with AI-driven insights, budget recommendations, and spending pattern analysis.',
        techStack: ['React', 'Python', 'Flask', 'TensorFlow', 'MongoDB', 'Chart.js', 'Stripe API'],
        imageUrl: 'https://images.unsplash.com/photo-1533750349088-75e1b6b6a45f?w=500&h=300&fit=crop',
        githubLink: 'https://github.com/advitiyaranjan/ai-finance-tracker',
        liveLink: 'https://ai-finance.example.com',
        gradient: 'from-yellow-500 to-orange-500',
        color: 'yellow',
        order: 4
      },
      {
        title: 'IoT Smart Home Dashboard',
        description: 'Comprehensive IoT management system for monitoring and controlling smart home devices with real-time data visualization and automation rules.',
        techStack: ['React', 'Node.js', 'MQTT', 'Arduino', 'MongoDB', 'WebSocket', 'Tailwind CSS'],
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop',
        githubLink: 'https://github.com/advitiyaranjan/iot-dashboard',
        liveLink: 'https://iot-dashboard.example.com',
        gradient: 'from-red-500 to-rose-500',
        color: 'red',
        order: 5
      },
      {
        title: 'Personal Portfolio',
        description: 'Modern, fully serverless portfolio website built with React, Vite, and JSON file storage deployed on Vercel with admin dashboard.',
        techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Vercel', 'JSON Storage', 'Express'],
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=300&fit=crop',
        githubLink: 'https://github.com/advitiyaranjan/portfolio',
        liveLink: 'https://portfolio.example.com',
        gradient: 'from-indigo-500 to-blue-500',
        color: 'indigo',
        order: 6
      }
    ];

    for (const project of projects) {
      await projectsStorage.create(project);
    }
    console.log('✅ Projects data created');
  }

  // Seed experiences
  if ((await experiencesStorage.findAll()).length === 0) {
    const experiences = [
      {
        title: 'Blockchain & Governance Research',
        company: 'Working Group on Technology for Viksit Bharat',
        location: 'India - Remote',
        description: 'Researched and prototyped Blockchain-based governance systems to enhance transparency, security, and efficiency in public service delivery. Designed use-cases for Decentralized Identity (DID) and Smart Contracts in citizen authentication, land records, and subsidy automation. Explored AI-driven policy analytics, IoT-enabled infrastructure monitoring, and integration with Digital Public Goods for scalable, citizen-centric solutions.',
        startDate: '2025-02-01',
        endDate: '2025-07-31',
        isCurrentRole: false,
        technologies: ['Blockchain', 'Smart Contracts', 'Decentralized Identity (DID)', 'AI Policy Analytics', 'IoT Monitoring', 'Digital Public Goods'],
        gradient: 'from-blue-500 to-cyan-500',
        color: 'blue'
      },
      {
        title: 'Data Analyst Intern',
        company: 'Deloitte',
        location: 'Australia - Remote',
        description: 'Completed Data Analytics Job Simulation demonstrating proficiency in problem-solving, data analysis, and advanced analytics. Applied statistical methods and visualization techniques to extract actionable insights from complex datasets. Developed skills in data interpretation, business analytics, and reporting.',
        startDate: '2026-03-01',
        endDate: '2026-04-30',
        isCurrentRole: false,
        technologies: ['Data Analysis', 'Problem Solving', 'Data Visualization', 'Statistical Analysis', 'Business Analytics', 'SQL', 'Excel'],
        gradient: 'from-purple-500 to-pink-500',
        color: 'purple'
      }
    ];

    for (const experience of experiences) {
      await experiencesStorage.create(experience);
    }
    console.log('✅ Experiences data created');
  }

  // Seed achievements
  if ((await achievementsStorage.findAll()).length === 0) {
    const achievements = [
      {
        icon: 'Award',
        title: 'GATE 2026 Qualified',
        subtitle: 'Computer Science & IT',
        description: 'Secured AIR 3460 among 211,020 candidates with a GATE Score of 589 and 50.41 marks. Demonstrated exceptional performance in competitive engineering aptitude examination.',
        details: ['AIR 3460', 'GATE Score: 589/1000', 'Marks: 50.41', '211,020 candidates competed'],
        gradient: 'from-blue-500 to-cyan-500',
        color: 'blue',
        order: 1,
        link: 'https://gate.iitb.ac.in'
      },
      {
        icon: 'Target',
        title: 'National Youth Festival (NYF) 2025',
        subtitle: 'Tech for Viksit Bharat Theme - Finalist',
        description: 'Selected as a national-level finalist for innovative technology-driven solutions aimed at governance and national development. Recognized for exceptional contributions to tech-driven governance initiatives.',
        details: ['National-level Finalist', 'Viksit Bharat Initiatives', 'Governance Technology Focus', 'Innovation Recognition'],
        gradient: 'from-purple-500 to-pink-500',
        color: 'purple',
        order: 2,
        link: 'https://nvy.gov.in'
      },
      {
        icon: 'Users',
        title: 'SOUL Leadership Conclave',
        subtitle: 'Youth Delegate & Active Participant',
        description: 'Invited as an official delegate to participate in policy discussions and leadership networking at the national conclave. Engaged in strategic dialogues on youth empowerment and social impact.',
        details: ['Official Youth Delegate', 'Policy Discussions', 'Leadership Networking', 'National Conclave'],
        gradient: 'from-green-500 to-emerald-500',
        color: 'green',
        order: 3,
        link: 'https://www.soulbihar.in'
      },
      {
        icon: 'Zap',
        title: 'Chairperson – SOUL Bihar & Jharkhand',
        subtitle: 'Regional Leadership Initiative',
        description: 'Leading regional initiatives to foster youth leadership, collaboration, and social impact projects. Driving transformative change through youth-centric programs and community engagement.',
        details: ['Regional Leadership', 'Youth Empowerment', 'Collaboration Programs', 'Social Impact Projects'],
        gradient: 'from-orange-500 to-red-500',
        color: 'orange',
        order: 4,
        link: 'https://www.soulbihar.in'
      }
    ];

    for (const achievement of achievements) {
      await achievementsStorage.create(achievement);
    }
    console.log('✅ Achievements data created');
  }

  // Seed case studies
  if ((await caseStudiesStorage.findAll()).length === 0) {
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

    for (const caseStudy of caseStudies) {
      await caseStudiesStorage.create(caseStudy);
    }
    console.log('✅ Case studies data created');
  }

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
