import { Icons } from "@/components/icons";

export const DATA = {
  name: "Rupesh sharma",
  initials: "RS",
  url: "https://rupeshsharma.vercel.app",
  location: "Dhanbad , Jharkhand",
  locationLink: "https://www.google.com/maps/place/dhanbad",
  description:
    "Aspiring software developer and passionate web developer. I love building projects and helping others. Very active on Twitter.",
  avatarUrl: "/me.jpeg",
  skillCategories: {
    "Frontend Development": [
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
    "Backend Development": [
      "Node.js",
      "MongoDB",
      "Postgresql",
      "Express.js",
    ],
    "DevOps & Cloud": [
      "Docker",
      "Kubernetes",
      "Azure",
      "AWS",
      "CI/CD",
      "Git",
      "Github",
    ],
    "Programming & Computer Science": [
      "C++",
      "System Design",
      "Data Structures and Algorithms",
      "Object Oriented Programming",
      "Computer Networks",
      "Operating Systems",
    ],
    "AI & Machine Learning": [
      "Machine Learning",
      "Artificial Intelligence",
    ],
  },
  skills: [
    "React",
    "Next.js",
    "Typescript",
    "Javascript",
    "Node.js",
    "MongoDB",
    "Postgresql",
    "Docker",
    "Kubernetes",
    "Tailwind",
    "C++",
    "System Design",
    "Data Structures and Algorithms",
    "Object Oriented Programming",
    "Machine Learning",
    "Artificial Intelligence",
    "Computer Networks",
    "Operating Systems", 
    "Bootstrap",
    "Tailwind CSS",
    "Material UI",
    "Charts.js",
    "React Hook Form",
    "React Router",
    "React Query",
    "Azure",
    "AWS",
    "CI/CD",
    "Git",
    "Github",
  ],
  contact: {
    email: "rksharmagmo@gmail.com",
    tel: "+91-9973370694",
    social: {
      GitHub: {
        url: "https://github.com/rsharma828",
        icon: Icons.github,
      },
      LinkedIn: {
        url: "https://www.linkedin.com/in/rksharmagmo/",
        icon: Icons.linkedin,
      },
      X: {
        url: "https://x.com/SharmaGinweb",
        icon: Icons.x,
      },
      Youtube: {
        url: "https://www.youtube.com/@rupeshsharma133",
        icon: Icons.youtube,
      },
    },
  },

  work: [
    {
  "company": "KaleHQ",
  "href": "https://www.kalehq.com/",
  "badges": [],
  "location": "",
  "title": "Product Engineer",
  "logoUrl": "/kraffic.jpeg",
  "start": "December 2024",
  "end": "Present",
  "description": "Building and optimizing backend infrastructure, developing scalable backend solutions, and integrating AI-driven capabilities into the platform to enhance functionality and performance."
}
  ],
  education: [
    {
      school: "National Institute of Technology, Agartala",
      href: "https://www.nita.ac.in/",
      degree: "Bachelor of Technology in Electronics and Instrumentation",
      logoUrl: "/nita.jpeg",
      start: "August 2021",
      end: "Present",
      gpa: "8.61",
    },
    {
      school: "Rajkamal Saraswati Vidyamandir",
      href: "https://rsvm.in/",
      degree: "Senior Secondary Certificate",
      logoUrl: "/rajkamal.jpeg",
      start: "April 2018",
      end: "March 2020",
      percentage: "95.6",
    },
    {
      school: "Kendriya Vidyalaya",
      href: "https://gomoh.kvs.ac.in/",
      degree: "Higher Secondary Certificate",
      logoUrl: "/kv.jpeg",
      start: "July 2018",
      end: "March 2020",
      percentage: "88.6",
    },
  ],
  projects: [
    {
      title: "DocQuify",
      href: "https://docquify.vercel.app/",
      active: true,
      projectTag: "AI Document Analysis",
      description:
      "AI-powered document analysis SaaS with accurate answers and context-based querying",
      technologies: [
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
      links: [
        {
          type: "Website",
          href: "https://docquify.vercel.app/",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video:
        "https://utfs.io/f/dRTv2GuJ9j8O4kigkUPMNhj1uwPVJbvsnYIa2zriKO5Emode",
    },
    
    {
      title: "Kolab",
      href: "https://kolab-at.vercel.app/",
      active: true,
      projectTag: "Collaboration Tool",
      description:
      "Collaboration tool with real-time document editing and team collaboration",
      technologies: ["Next.JS", "Node.Js", "LiveBlocks", "Clerk"],
      links: [
        {
          type: "Website",
          href: "https://kolab-at.vercel.app/",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video:
        "https://utfs.io/f/dRTv2GuJ9j8OfHiWM6z9CrN1MR6XtzQyEbB34iKouWqTgZkP",
    },
    
    {
      title: "HolidayHome",
      href: "https://myholiday-homes-1.onrender.com/",
      active: true,
      projectTag: "Booking Website",
      description:
      "Hotel booking website with real-time availability checks and payment integration",
      technologies: [
        "TypeScript",
        "MongoDB",
        "JWT",
        "Tailwind CSS",
        "React",
        "NodeJs",
        "ExpressJs",
        "Zod",
      ],
      links: [
        {
          type: "Website",
          href: "https://myholiday-homes-1.onrender.com/",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video:
        "https://utfs.io/f/dRTv2GuJ9j8Od0kwn0uJ9j8OrCbW5NmDwxp6ZS3QcnLhHYzA",
    },
    {
      title: "Origin Nutrition",
      href: "https://originnutrition.in/shop/",
      active: true,
      projectTag: "Fintech",
      description:
        "E-commerce website for a nutrition company with payment integration and admin dashboard",
      technologies: [
        "NextJS",
        "React",
        "NodeJs",
        "ExpressJs",
        "PostgreSQL",
        "Prisma",
        "JWT",
      ],
      links: [
      ],
      image: "",
      video: "https://tavus-videos-store.s3.ap-southeast-2.amazonaws.com/origin.mp4",
    },
    {
      title: "Toys Website",
      href: "https://moonstartoys.com/",
      active: true,
      projectTag: "E-commerce",
      description:
      "E-commerce website for a toy company with payment integration and admin dashboard",
      technologies: [
        "React",
        "Node.js",
        "MongoDB",
        "Express",
        "Stripe",
        "Tailwind CSS",
      ],
      links: [
      ],
      image: "",
      video: "https://tavus-videos-store.s3.ap-southeast-2.amazonaws.com/toyswebsite.mov",
    },
    {
      title: "OmnexVenture",
      href: "https://omnexventure.com/",
      active: true,
      projectTag: "Venture Capital",
      description:
      "Corporate website for a venture capital firm with modern design, interactive portfolio showcase, and investor relations portal",
      technologies: [
        "React",
        "Next.js",
        "Tailwind CSS",
        "Framer Motion",
        "Contentful CMS",
      ],
      links: [],
      image: "",
      video: "https://tavus-videos-store.s3.ap-southeast-2.amazonaws.com/omnexVenture.mov",
    },
    {
      title: "Medgyrus",
      href: "https://medgyrus.com/",
      dates: "January 2024",
      active: true,
      projectTag: "Education & Training",
      description:
      "Educational website for students to attend online quiz and tests",
      technologies: [
        "React",
        "Node.js",
        "MongoDB",
        "Express",
        "Socket.io",
        "Tailwind CSS",
      ],
      links: [],
      image: "",
      video: "https://tavus-videos-store.s3.ap-southeast-2.amazonaws.com/medgyrus.mov",
    },
    {
      title: "Homely Interio",
      href: "https://homelyinterio.com/",
      active: true,
      projectTag: "Interior Design",
      description:
      "Interior design website with user authentication, payment integration, and admin dashboard",
      technologies: [
        "React",
        "Three.js",
        "Node.js",
        "MongoDB",
        "Express",
        "Tailwind CSS",
      ],
      links: [],
      image: "",
      video: "https://tavus-videos-store.s3.ap-southeast-2.amazonaws.com/homelyinterio.mov",
    },
    {
      title: "Pay-Up",
      href: "https://github.com/rsharma828/payUp-webapp",
      active: true,
      description:
      "Peer-to-peer money transfer application with user authentication, payment integration, and admin dashboard",
      technologies: [
        "NextJS",
        "React",
        "NodeJs",
        "ExpressJs",
        "PostgreSQL",
        "Prisma",
        "JWT",
      ],
      links: [
       
      ],
      image:
        "https://utfs.io/f/dRTv2GuJ9j8Oypr6ufYXs9DY7OAReJyaPlUkFuvIH2KCMcxT",
      video: "",
    },
    {
      title: "Medium",
      href: "https://github.com/rsharma828/medium-blog-ap",
      active: true,
      description:
      "Blog website with user authentication, payment integration, and admin dashboard",
      technologies: [
        "React",
        "NodeJs",
        "Hono",
        "PostgreSQL",
        "Cloudflare worker",
        "JWT",
        "Prisma",
      ],
      links: [
       
      ],
      image:
        "https://utfs.io/f/dRTv2GuJ9j8OWJtpZPKzcMKeBdRiY1t567Noy09rjfLVsPF2",
      video: "",
    },
  ],
} as const;

// hackathons: [
// {
//   title: "Hack Western 5",
//   dates: "November 23rd - 25th, 2018",
//   location: "London, Ontario",
//   description:
//     "Developed a mobile application which delivered bedtime stories to children using augmented reality.",
//   image:
//     "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/hack-western.png",
//   mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2019/mlh-trust-badge-2019-white.svg",
//   links: [],
// },
//     {
//       title: "Hack The North",
//       dates: "September 14th - 16th, 2018",
//       location: "Waterloo, Ontario",
//       description:
//         "Developed a mobile application which delivers university campus wide events in real time to all students.",
//       image:
//         "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/hack-the-north.png",
//       mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2019/mlh-trust-badge-2019-white.svg",
//       links: [],
//     },
//   ],
// } as const;
