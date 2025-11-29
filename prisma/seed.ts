import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminEmail = 'admin@ari-rusmawan.com';
  const adminPassword = 'admin123456'; // Change this in production
  
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Ari Rusmawan',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('Admin user created:', adminUser);

  // Create profile
  const profile = await prisma.profile.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      fullName: 'Ari Rusmawan',
      title: 'Information Technology Education | Programmer | Adm. QA/QC | Project Expeditor',
      bio: 'Passionate about educational technology, quality software development, and efficient project management. Bridging the gap between education and industry through innovative solutions.',
      location: 'Jakarta, Indonesia',
      phone: '+62 812-3456-7890',
      emailPublic: 'ari.rusmawan@example.com',
      socialLinks: JSON.stringify({
        linkedin: 'https://linkedin.com/in/ari-rusmawan',
        github: 'https://github.com/ari-rusmawan',
        twitter: 'https://twitter.com/ari_rusmawan'
      }),
    },
  });

  console.log('Profile created:', profile);

  // Create education records
  const education1 = await prisma.education.create({
    data: {
      profileId: profile.id,
      school: 'State University of Jakarta',
      degree: 'Bachelor of Information Technology Education',
      major: 'Educational Technology',
      startYear: 2018,
      endYear: 2022,
      description: 'Focused on educational technology, software development, and IT project management',
    },
  });

  const education2 = await prisma.education.create({
    data: {
      profileId: profile.id,
      school: 'Coding Bootcamp',
      degree: 'Full Stack Web Development',
      major: 'Modern Web Technologies',
      startYear: 2022,
      endYear: 2023,
      description: 'Intensive training in modern web technologies including React, Node.js, and cloud deployment',
    },
  });

  console.log('Education records created');

  // Create experience records
  const experience1 = await prisma.experience.create({
    data: {
      profileId: profile.id,
      company: 'Tech Solutions Indonesia',
      position: 'Project Expeditor',
      startDate: new Date('2023-01-01'),
      endDate: null,
      location: 'Jakarta, Indonesia',
      responsibilities: JSON.stringify([
        'Coordinate project timelines and deliverables',
        'Liaise between development teams and stakeholders',
        'Monitor project progress and quality assurance',
        'Manage resource allocation and risk mitigation'
      ]),
    },
  });

  const experience2 = await prisma.experience.create({
    data: {
      profileId: profile.id,
      company: 'Digital Innovation Lab',
      position: 'QA/QC Administrator',
      startDate: new Date('2022-01-01'),
      endDate: new Date('2022-12-31'),
      location: 'Jakarta, Indonesia',
      responsibilities: JSON.stringify([
        'Develop and implement quality assurance procedures',
        'Conduct code reviews and testing protocols',
        'Manage bug tracking and resolution workflows',
        'Collaborate with development teams for quality improvements'
      ]),
    },
  });

  const experience3 = await prisma.experience.create({
    data: {
      profileId: profile.id,
      company: 'StartUp Tech Hub',
      position: 'Junior Programmer',
      startDate: new Date('2021-01-01'),
      endDate: new Date('2021-12-31'),
      location: 'Jakarta, Indonesia',
      responsibilities: JSON.stringify([
        'Develop and maintain web applications',
        'Participate in agile development processes',
        'Collaborate with senior developers on project features',
        'Assist in debugging and code optimization'
      ]),
    },
  });

  console.log('Experience records created');

  // Create skills
  const skills = [
    // Programming Languages
    { name: 'JavaScript', category: 'Programming Languages', levelPercent: 90 },
    { name: 'TypeScript', category: 'Programming Languages', levelPercent: 85 },
    { name: 'Python', category: 'Programming Languages', levelPercent: 80 },
    { name: 'PHP', category: 'Programming Languages', levelPercent: 75 },
    { name: 'Java', category: 'Programming Languages', levelPercent: 70 },
    
    // Web Technologies
    { name: 'React.js', category: 'Web Technologies', levelPercent: 90 },
    { name: 'Next.js', category: 'Web Technologies', levelPercent: 85 },
    { name: 'Node.js', category: 'Web Technologies', levelPercent: 80 },
    { name: 'HTML/CSS', category: 'Web Technologies', levelPercent: 95 },
    { name: 'Tailwind CSS', category: 'Web Technologies', levelPercent: 88 },
    
    // Database
    { name: 'MySQL', category: 'Database', levelPercent: 85 },
    { name: 'PostgreSQL', category: 'Database', levelPercent: 80 },
    { name: 'MongoDB', category: 'Database', levelPercent: 75 },
    { name: 'Redis', category: 'Database', levelPercent: 70 },
    
    // Tools & Others
    { name: 'Git', category: 'Tools & Others', levelPercent: 90 },
    { name: 'Docker', category: 'Tools & Others', levelPercent: 75 },
    { name: 'AWS', category: 'Tools & Others', levelPercent: 70 },
    { name: 'Figma', category: 'Tools & Others', levelPercent: 80 },
    { name: 'Jira', category: 'Tools & Others', levelPercent: 85 },
  ];

  for (const skill of skills) {
    await prisma.skill.create({
      data: skill,
    });
  }

  console.log('Skills created');

  // Create projects
  const projects = [
    {
      title: 'E-Learning Management System',
      slug: 'e-learning-management-system',
      description: 'A comprehensive learning management system built for educational institutions with course management, student tracking, and assessment features.',
      techStack: JSON.stringify(['React', 'Node.js', 'MongoDB', 'Express']),
      liveUrl: 'https://elearning-demo.example.com',
      repoUrl: 'https://github.com/ari-rusmawan/elearning-system',
      featured: true,
    },
    {
      title: 'Project Management Dashboard',
      slug: 'project-management-dashboard',
      description: 'Real-time project tracking dashboard with team collaboration features, task management, and progress visualization.',
      techStack: JSON.stringify(['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind']),
      liveUrl: 'https://pm-dashboard.example.com',
      repoUrl: 'https://github.com/ari-rusmawan/pm-dashboard',
      featured: true,
    },
    {
      title: 'Quality Assurance Automation Tool',
      slug: 'quality-assurance-automation-tool',
      description: 'Automated testing framework for web applications with comprehensive test coverage and detailed reporting.',
      techStack: JSON.stringify(['Python', 'Selenium', 'Docker', 'Jenkins']),
      liveUrl: 'https://qa-tool.example.com',
      repoUrl: 'https://github.com/ari-rusmawan/qa-automation',
      featured: false,
    },
    {
      title: 'Inventory Management System',
      slug: 'inventory-management-system',
      description: 'Enterprise-grade inventory management solution with real-time tracking, reporting, and analytics.',
      techStack: JSON.stringify(['PHP', 'Laravel', 'MySQL', 'Vue.js']),
      liveUrl: 'https://inventory.example.com',
      repoUrl: 'https://github.com/ari-rusmawan/inventory-system',
      featured: false,
    },
    {
      title: 'Educational Mobile App',
      slug: 'educational-mobile-app',
      description: 'Cross-platform mobile application for interactive learning with gamification elements.',
      techStack: JSON.stringify(['React Native', 'Firebase', 'Redux', 'Expo']),
      liveUrl: 'https://edu-app.example.com',
      repoUrl: 'https://github.com/ari-rusmawan/edu-mobile-app',
      featured: false,
    },
    {
      title: 'API Gateway Service',
      slug: 'api-gateway-service',
      description: 'Microservices-based API gateway with authentication, rate limiting, and monitoring capabilities.',
      techStack: JSON.stringify(['Node.js', 'Express', 'Redis', 'Docker']),
      liveUrl: 'https://api-gateway.example.com',
      repoUrl: 'https://github.com/ari-rusmawan/api-gateway',
      featured: false,
    },
  ];

  for (const project of projects) {
    await prisma.project.create({
      data: {
        ...project,
        profileId: profile.id,
      },
    });
  }

  console.log('Projects created');

  // Create settings
  const settings = [
    { key: 'site_title', value: 'Ari Rusmawan - Portfolio' },
    { key: 'site_description', value: 'Professional portfolio of Ari Rusmawan - Information Technology Education specialist, Programmer, QA/QC Administrator, and Project Expeditor' },
    { key: 'meta_title', value: 'Ari Rusmawan - IT Professional Portfolio' },
    { key: 'meta_description', value: 'Information Technology Education specialist, Programmer, QA/QC Administrator, and Project Expeditor' },
    { key: 'contact_email', value: 'ari.rusmawan@example.com' },
    { key: 'theme_primary_color', value: '#0B3D91' },
    { key: 'theme_secondary_color', value: '#1E66C8' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log('Settings created');

  console.log('Database seeded successfully!');
  console.log('Admin login credentials:');
  console.log('Email: admin@ari-rusmawan.com');
  console.log('Password: admin123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });