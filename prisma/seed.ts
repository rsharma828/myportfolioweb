import { PrismaClient, ProjectStatus } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
}

const projectsSeed = [
  {
    title: "DocQuify",
    liveUrl: "https://docquify.vercel.app/",
    projectTag: "AI Document Analysis",
    description:
      "AI-powered document analysis SaaS with accurate answers and context-based querying",
    techStack: [
      "NextJS",
      "Typescript",
      "Clerk",
      "Tailwind CSS",
      "Stripe",
      "React",
      "NodeJs",
      "ExpressJs",
      "OpenAI",
      "Vector DB",
      "AWS S3",
      "PostgreSQL",
    ],
    coverImage: "",
    video: "https://utfs.io/f/dRTv2GuJ9j8O4kigkUPMNhj1uwPVJbvsnYIa2zriKO5Emode",
    timeline: "",
    featured: true,
    sortOrder: 0,
  },
  {
    title: "Kolab",
    liveUrl: "https://kolab-at.vercel.app/",
    projectTag: "Collaboration Tool",
    description:
      "Collaboration tool with real-time document editing and team collaboration",
    techStack: ["Next.JS", "Node.Js", "LiveBlocks", "Clerk"],
    coverImage: "",
    video: "https://utfs.io/f/dRTv2GuJ9j8OfHiWM6z9CrN1MR6XtzQyEbB34iKouWqTgZkP",
    timeline: "",
    featured: true,
    sortOrder: 1,
  },
  {
    title: "HolidayHome",
    liveUrl: "https://myholiday-homes-1.onrender.com/",
    projectTag: "Booking Website",
    description:
      "Hotel booking website with real-time availability checks and payment integration",
    techStack: [
      "TypeScript",
      "MongoDB",
      "JWT",
      "Tailwind CSS",
      "React",
      "NodeJs",
      "ExpressJs",
      "Zod",
    ],
    coverImage: "",
    video: "https://utfs.io/f/dRTv2GuJ9j8Od0kwn0uJ9j8OrCbW5NmDwxp6ZS3QcnLhHYzA",
    timeline: "",
    featured: true,
    sortOrder: 2,
  },
  {
    title: "Origin Nutrition",
    liveUrl: "https://originnutrition.in/shop/",
    projectTag: "Fintech",
    description:
      "E-commerce website for a nutrition company with payment integration and admin dashboard",
    techStack: ["NextJS", "React", "NodeJs", "ExpressJs", "PostgreSQL", "Prisma", "JWT"],
    coverImage: "",
    video: "https://tavus-videos-store.s3.ap-southeast-2.amazonaws.com/origin.mp4",
    timeline: "",
    featured: false,
    sortOrder: 3,
  },
  {
    title: "Toys Website",
    liveUrl: "https://moonstartoys.com/",
    projectTag: "E-commerce",
    description:
      "E-commerce website for a toy company with payment integration and admin dashboard",
    techStack: ["React", "Node.js", "MongoDB", "Express", "Stripe", "Tailwind CSS"],
    coverImage: "",
    video: "https://tavus-videos-store.s3.ap-southeast-2.amazonaws.com/toyswebsite.mov",
    timeline: "",
    featured: false,
    sortOrder: 4,
  },
  {
    title: "OmnexVenture",
    liveUrl: "https://omnexventure.com/",
    projectTag: "Venture Capital",
    description:
      "Corporate website for a venture capital firm with modern design, interactive portfolio showcase, and investor relations portal",
    techStack: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Contentful CMS"],
    coverImage: "",
    video: "https://tavus-videos-store.s3.ap-southeast-2.amazonaws.com/omnexVenture.mov",
    timeline: "",
    featured: false,
    sortOrder: 5,
  },
  {
    title: "Medgyrus",
    liveUrl: "https://medgyrus.com/",
    projectTag: "Education & Training",
    description: "Educational website for students to attend online quiz and tests",
    techStack: ["React", "Node.js", "MongoDB", "Express", "Socket.io", "Tailwind CSS"],
    coverImage: "",
    video: "https://tavus-videos-store.s3.ap-southeast-2.amazonaws.com/medgyrus.mov",
    timeline: "January 2024",
    featured: false,
    sortOrder: 6,
  },
  {
    title: "Homely Interio",
    liveUrl: "https://homelyinterio.com/",
    projectTag: "Interior Design",
    description:
      "Interior design website with user authentication, payment integration, and admin dashboard",
    techStack: ["React", "Three.js", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
    coverImage: "",
    video: "https://tavus-videos-store.s3.ap-southeast-2.amazonaws.com/homelyinterio.mov",
    timeline: "",
    featured: false,
    sortOrder: 7,
  },
  {
    title: "Pay-Up",
    liveUrl: "https://github.com/rsharma828/payUp-webapp",
    projectTag: "FinTech",
    description:
      "Peer-to-peer money transfer application with user authentication, payment integration, and admin dashboard",
    techStack: ["NextJS", "React", "NodeJs", "ExpressJs", "PostgreSQL", "Prisma", "JWT"],
    coverImage: "https://utfs.io/f/dRTv2GuJ9j8Oypr6ufYXs9DY7OAReJyaPlUkFuvIH2KCMcxT",
    video: "",
    timeline: "",
    featured: false,
    sortOrder: 8,
  },
  {
    title: "Medium",
    liveUrl: "https://github.com/rsharma828/medium-blog-ap",
    projectTag: "Blog",
    description:
      "Blog website with user authentication, payment integration, and admin dashboard",
    techStack: ["React", "NodeJs", "Hono", "PostgreSQL", "Cloudflare worker", "JWT", "Prisma"],
    coverImage: "https://utfs.io/f/dRTv2GuJ9j8OWJtpZPKzcMKeBdRiY1t567Noy09rjfLVsPF2",
    video: "",
    timeline: "",
    featured: false,
    sortOrder: 9,
  },
];

const skillCategories = [
  {
    name: "Frontend Development",
    skills: [
      "React",
      "Next.js",
      "Typescript",
      "Javascript",
      "Tailwind CSS",
      "Bootstrap",
      "Material UI",
      "Charts.js",
      "React Hook Form",
      "React Router",
      "React Query",
    ],
    sortOrder: 0,
  },
  {
    name: "Backend Development",
    skills: ["Node.js", "MongoDB", "Postgresql", "Express.js"],
    sortOrder: 1,
  },
  {
    name: "DevOps & Cloud",
    skills: ["Docker", "Kubernetes", "Azure", "AWS", "CI/CD", "Git", "Github"],
    sortOrder: 2,
  },
  {
    name: "Programming & Computer Science",
    skills: [
      "C++",
      "System Design",
      "Data Structures and Algorithms",
      "Object Oriented Programming",
      "Computer Networks",
      "Operating Systems",
    ],
    sortOrder: 3,
  },
  {
    name: "AI & Machine Learning",
    skills: ["Machine Learning", "Artificial Intelligence"],
    sortOrder: 4,
  },
];

const servicesSeed = [
  {
    title: "Landing Pages",
    description:
      "Attractive, conversion-focused landing pages to showcase your product or service.",
    price: "₹12,000 onwards",
    sortOrder: 0,
  },
  {
    title: "Business & E-commerce Websites",
    description:
      "Professional websites that represent your brand and online stores with payment processing, inventory management, and customer accounts.",
    price: "₹30,000 onwards",
    sortOrder: 1,
  },
  {
    title: "SaaS Applications",
    description:
      "Custom software-as-a-service applications with subscription models and user management.",
    price: "₹50,000 onwards",
    sortOrder: 2,
  },
  {
    title: "AI-Powered Apps",
    description:
      "Applications leveraging AI capabilities to provide intelligent features and automation.",
    price: "₹50,000 onwards",
    sortOrder: 3,
  },
  {
    title: "RAG Applications",
    description:
      "Retrieval-augmented generation systems that combine search with AI to provide accurate responses.",
    price: "₹50,000 onwards",
    sortOrder: 4,
  },
  {
    title: "Custom Software Development",
    description:
      "Tailored software solutions designed to address your specific business needs and challenges.",
    price: "₹35,000 onwards",
    sortOrder: 5,
  },
];

async function main() {
  await prisma.profile.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      name: "Rupesh sharma",
      initials: "RS",
      siteUrl: "https://rupeshsharma.vercel.app",
      description:
        "Aspiring software developer and passionate web developer. I love building projects and helping others. Very active on Twitter.",
      bioHtml: "",
      avatarUrl: "/me.jpeg",
      location: "Dhanbad , Jharkhand",
      locationLink: "https://www.google.com/maps/place/dhanbad",
      email: "rksharmagmo@gmail.com",
      tel: "+91-9973370694",
      socialGithub: "https://github.com/rsharma828",
      socialLinkedin: "https://www.linkedin.com/in/rksharmagmo/",
      socialX: "https://x.com/SharmaGinweb",
      socialYoutube: "https://www.youtube.com/@rupeshsharma133",
    },
    update: {},
  });

  await prisma.project.deleteMany();
  for (const p of projectsSeed) {
    const slug = slugify(p.title);
    await prisma.project.create({
      data: {
        slug,
        title: p.title,
        tagline: p.description.slice(0, 120),
        description: p.description,
        body: "",
        projectTag: p.projectTag,
        coverImage: p.coverImage,
        video: p.video,
        gallery: [],
        techStack: p.techStack,
        role: "",
        timeline: p.timeline,
        liveUrl: p.liveUrl,
        repoUrl: "",
        challenge: "",
        solution: "",
        outcome: "",
        status: ProjectStatus.LIVE,
        featured: p.featured,
        sortOrder: p.sortOrder,
      },
    });
  }

  await prisma.blogPost.deleteMany();
  await prisma.blogPost.create({
    data: {
      slug: "about-me",
      title: "About Me",
      summary:
        "I am Rupesh Sharma, a passionate and driven software developer currently pursuing my Bachelor of Technology at the National Institute of Technology Agartala.",
      body: `I am **Rupesh Sharma**, a passionate and driven software developer currently pursuing my Bachelor of Technology at the National Institute of Technology Agartala, with a CGPA of 8.61.

## Highlights

Among my notable projects are **DocQuify** and **PayUp** — both highlight my ability to build secure, efficient applications.

## Extracurriculars

Technical Lead for ANARC (Robotics Club, NIT Agartala) and captain of the NIT Agartala Hockey Team.

\`\`\`js
console.log("Developed with ❤️");
\`\`\`
`,
      thumbnailImage: "",
      publishedAt: new Date("2024-12-20"),
      tags: ["about", "introduction"],
      featured: true,
      published: true,
    },
  });

  await prisma.workExperience.deleteMany();
  await prisma.workExperience.create({
    data: {
      company: "KaleHQ",
      href: "https://www.kalehq.com/",
      title: "Product Engineer",
      logoUrl: "/kraffic.jpeg",
      location: "",
      description:
        "Building and optimizing backend infrastructure, developing scalable backend solutions, and integrating AI-driven capabilities into the platform to enhance functionality and performance.",
      startDate: "December 2024",
      endDate: "Present",
      badges: [],
      sortOrder: 0,
    },
  });

  await prisma.education.deleteMany();
  await prisma.education.createMany({
    data: [
      {
        school: "National Institute of Technology, Agartala",
        href: "https://www.nita.ac.in/",
        degree: "Bachelor of Technology in Electronics and Instrumentation",
        logoUrl: "/nita.jpeg",
        startDate: "August 2021",
        endDate: "Present",
        gpa: "8.61",
        percentage: "",
        sortOrder: 0,
      },
      {
        school: "Rajkamal Saraswati Vidyamandir",
        href: "https://rsvm.in/",
        degree: "Senior Secondary Certificate",
        logoUrl: "/rajkamal.jpeg",
        startDate: "April 2018",
        endDate: "March 2020",
        gpa: "",
        percentage: "95.6",
        sortOrder: 1,
      },
      {
        school: "Kendriya Vidyalaya",
        href: "https://gomoh.kvs.ac.in/",
        degree: "Higher Secondary Certificate",
        logoUrl: "/kv.jpeg",
        startDate: "July 2018",
        endDate: "March 2020",
        gpa: "",
        percentage: "88.6",
        sortOrder: 2,
      },
    ],
  });

  await prisma.skillCategory.deleteMany();
  for (const s of skillCategories) {
    await prisma.skillCategory.create({
      data: {
        name: s.name,
        skills: s.skills,
        sortOrder: s.sortOrder,
      },
    });
  }

  await prisma.service.deleteMany();
  for (const s of servicesSeed) {
    await prisma.service.create({ data: s });
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
