export interface Project {
  title: string;
  description: string;
  stack: string[];
  github?: string;
  demo?: string;
  image?: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  points: string[];
}

export const PROJECTS: Project[] = [
  {
    title: "FullStack Chat App",
    description: "WhatsApp-style real-time messaging platform with online presence, typing indicators, and sub-100ms delivery. Supports 200+ concurrent users.",
    stack: ["MongoDB", "Express", "React", "Node.js", "Socket.io", "JWT"],
    github: "https://github.com/khushjiwani",
    demo: "#"
  },
  {
    title: "RAG-Based AI Chatbot",
    description: "Document intelligence platform using LangChain, GPT-4, and FAISS vector store. Reduced hallucination rates by 60% compared to vanilla LLMs.",
    stack: ["LangChain", "OpenAI API", "FAISS", "Python", "Flask"],
    github: "https://github.com/khushjiwani",
    demo: "#"
  },
  {
    title: "ShopNow E-Commerce",
    description: "Full-featured platform with Razorpay integration, Redis response caching, and an admin CMS dashboard for real-time analytics.",
    stack: ["MERN Stack", "Redux", "Redis", "Razorpay", "Cloudinary"],
    github: "https://github.com/khushjiwani",
    demo: "#"
  },
  {
    title: "TradeXpert Trading",
    description: "Scalable backend handling 1,000+ trades/day. Optimized PostgreSQL connection pooling and implemented real-time portfolio tracking via WebSockets.",
    stack: ["PostgreSQL", "Node.js", "Redis", "WebSockets", "REST API"],
    github: "https://github.com/khushjiwani",
    demo: "#"
  }
];

export const EXPERIENCES: Experience[] = [
  {
    role: "Web Developer Intern",
    company: "Labmentix EdTech Pvt. Ltd.",
    period: "July 2024 – Dec 2024",
    points: [
      "Built 15+ RESTful APIs supporting 5K+ monthly users with 99.9% uptime using Node.js and Express.js.",
      "Implemented JWT authentication and RBAC, strengthening platform security significantly.",
      "Redesigned MongoDB schemas with indexing, reducing API latency by 40% (300ms → 180ms).",
      "Introduced Socket.io for real-time notifications and integrated OpenAI API for smart content recommendations."
    ]
  },
  {
    role: "Full Stack Development Trainee",
    company: "SmartBridge (AICTE Certified)",
    period: "July 2025 – Aug 2025",
    points: [
      "Built and deployed end-to-end web applications using React.js and MongoDB under guided sprints.",
      "Practiced REST API design, Git version control, and production deployment workflows."
    ]
  },
  {
    role: "Full Stack Developer Intern",
    company: "NYX – Network for Young Xplorers",
    period: "Jan 2024 – Mar 2024",
    points: [
      "Built full-stack web apps in a startup environment using MERN technologies.",
      "Gained cross-stack expertise in a fast-paced, innovation-driven team."
    ]
  }
];

export const SKILLS_CATEGORIZED = {
  "Programming Languages": ["JavaScript (ES6+)", "Python", "Java", "SQL", "TypeScript"],
  "Frameworks & Libraries": ["React.js", "Node.js", "Express.js", "Redux Toolkit", "Socket.io", "Tailwind CSS"],
  "Databases": ["MongoDB (Mongoose)", "PostgreSQL", "MySQL", "Redis (Caching)"],
  "Cloud Services": ["Vercel", "Render", "Docker", "Kubernetes", "AWS (Basics)"],
  "AI/ML Tools": ["LangChain", "OpenAI API", "Hugging Face", "FAISS", "Vector DBs", "RAG"]
};
