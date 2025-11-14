import { Icons } from "@/components/icons";

export const DATA = {
  name: "Aditya Sharma",
  initials: "AD",
  url: "https://aditya.vercel.app",
  location: "Mumbai, Maharashtra",
  locationLink: "https://www.google.com/maps/place/mumbai",
  description:
    "Professional video editor and creative storyteller. I specialize in transforming raw footage into compelling visual narratives. Passionate about creating engaging content that captivates audiences.",
  avatarUrl: "/aditya_img.jpg",
  skillCategories: {
    "Video Editing Software": [
      "Adobe Premiere Pro",
      "Adobe After Effects",
      "Capcut",
      "Canva",
    ],
    "Motion Graphics & Animation": [
      "After Effects",
      "Motion Graphics",
      "2D Animation",
    ],
    "Color Grading & Correction": ["Color Grading", "Color Correction", "LUTs"],
    "Specialized Skills": [
      "Video Compositing",
      "Green Screen",
      "Visual Effects",
      "Title Design",
      "Video Encoding",
      "Multi-camera Editing",
      "Documentary Editing",
    ],
  },
  contact: {
    email: "adityasharma8789514@gmail.com",
    tel: "+91-8789514903",
    social: {
      LinkedIn: {
        url: "https://www.linkedin.com/in/aditya-sharma-47ba75398",
        icon: Icons.linkedin,
      },
      Instagram: {
        url: "https://www.instagram.com/_the_aditya_l/",
        icon: Icons.instagram,
      },
      Youtube: {
        url: "https://www.youtube.com/@aditya_sharma100",
        icon: Icons.youtube,
      },
    },
  },

  work: [
    {
      company: "Freelance Video Editor",
      href: "#",
      badges: [],
      location: "Remote",
      title: "Video Editor & Motion Graphics Designer",
      logoUrl: "/kraffic.jpeg",
      start: "June 2021",
      end: "December 2022",
      description:
        "Delivered high-quality video editing services for YouTube creators, brands, and independent filmmakers. Created engaging social media content, promotional videos, and short-form content with expertise in color grading and visual effects.",
    },
  ],
  projects: [
    {
      title: "Showreel",
      video:
        "https://tavus-videos-store.s3.ap-southeast-2.amazonaws.com/lv_0_20251113205412.mp4",
    },
    {
      title: "Nature Video",
      video:
        "https://tavus-videos-store.s3.ap-southeast-2.amazonaws.com/aditya_vid.mp4",
    },
    {
      title: "Personal edit",
      video:
        "https://tavus-videos-store.s3.ap-southeast-2.amazonaws.com/aditya_vid2.mp4",
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
