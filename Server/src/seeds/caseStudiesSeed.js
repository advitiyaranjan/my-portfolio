import CaseStudy from '../models/CaseStudy.js';

const caseStudiesSeed = [
  {
    title: 'Blockchain-Based Governance Research',
    description: 'Comprehensive research and development of blockchain solutions for government transparency and citizen services.',
    imageUrl: '/images/case-study-1.jpg',
    challenge: 'Government systems lacked transparency, security, and efficiency in public service delivery. There was a need for innovative technological solutions to enhance citizen engagement and streamline processes.',
    solution: 'Developed comprehensive blockchain architecture combining DID, smart contracts, AI analytics, and IoT monitoring to create transparent, secure, and efficient digital governance systems.',
    results: 'Selected as National Youth Festival 2025 Finalist with innovative governance solutions framework designed, enhanced transparency in public service delivery, and national recognition for tech-driven governance.',
    technologies: ['Blockchain', 'Solidity', 'Smart Contracts', 'DID', 'AI', 'IoT', 'Node.js'],
    link: 'https://github.com/advitiyaranjan',
    order: 1,
  },
  {
    title: 'Campus Connect - Real-Time Student Platform',
    description: 'Full-stack platform enabling students to share academic resources, find internship opportunities, and connect with peers in real-time.',
    imageUrl: '/images/case-study-2.jpg',
    challenge: 'Students at IIITM Gwalior were struggling to share academic resources, find internship opportunities, and connect with peers. No centralized platform existed for real-time communication and resource sharing.',
    solution: 'Launched comprehensive platform featuring real-time chat, note/paper sharing, event announcements, internship opportunities, and role-based permissions with Socket.io.',
    results: 'Successfully deployed and serving IIITM Gwalior students with real-time communication for 100+ concurrent users, centralized hub for academic resource sharing, and improved student-to-opportunity discovery.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'JWT', 'Tailwind CSS'],
    link: 'https://github.com/advitiyaranjan/campus-connect',
    order: 2,
  },
  {
    title: 'GATE 2026 Achievement - AIR 3460',
    description: 'Qualified in GATE 2026 (Graduate Aptitude Test in Engineering) with outstanding performance among 211,020 candidates.',
    imageUrl: '/images/case-study-3.jpg',
    challenge: 'Competitive examination requiring mastery of computer science fundamentals, algorithms, data structures, and comprehensive technical knowledge across multiple domains.',
    solution: 'Systematic study of core CS concepts and advanced topics, rigorous practice with mock tests and problem solving, deep understanding of algorithms and data structures.',
    results: 'GATE 2026 Qualified - AIR 3460, GATE Score: 589/1000, Marks: 50.41, demonstrating strong foundation in computer science fundamentals and advanced concepts.',
    technologies: ['Data Structures', 'Algorithms', 'Database Systems', 'Operating Systems', 'Networks', 'Compiler Design'],
    link: null,
    order: 3,
  },
];

export const seedCaseStudies = async () => {
  try {
    const count = await CaseStudy.countDocuments();
    
    if (count === 0) {
      await CaseStudy.insertMany(caseStudiesSeed);
      console.log('✅ Case studies seed data inserted successfully');
      return true;
    } else {
      console.log(`ℹ️  Case studies already exist in database (${count} found)`);
      return false;
    }
  } catch (error) {
    console.error('❌ Error seeding case studies:', error.message);
    throw error;
  }
};
