import React, { useState, useEffect, useRef } from 'react';
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Code2,
  Cpu,
  Database,
  Globe,
  Terminal,
  Send,
  MessageSquare,
  X,
  ChevronRight,
  Sparkles,
  Download,
  Cloud,
  Layers,
  BrainCircuit
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link as ScrollLink } from 'react-scroll';
import { GoogleGenAI } from "@google/genai";
import { PROJECTS, EXPERIENCES, SKILLS_CATEGORIZED } from './constants';
import { cn } from './lib/utils';

// --- Gemini Setup ---
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// --- Components ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      scrolled ? "glass py-3 shadow-sm" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold tracking-tight cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="text-gradient tracking-widest font-black">KHUSH</span><span className="text-[#94a3b8] font-light ml-1">JIWANI</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 text-sm font-medium">
          {['About', 'Skills', 'Experience', 'Projects', 'Contact'].map((item) => (
            <ScrollLink
              key={item}
              to={item.toLowerCase()}
              smooth={true}
              duration={500}
              className="cursor-pointer hover:text-[#94a3b8] transition-colors"
            >
              {item}
            </ScrollLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/resume.pdf"
            download="Khushjiwani_Resume.pdf"
            className="hidden sm:flex items-center gap-2 text-sm font-medium border border-[#f1f5f9]/20 px-4 py-2 rounded-full hover:bg-[#f1f5f9]/5 transition-colors"
          >
            <Download size={16} />
            Resume
          </a>
          <a
            href="mailto:khushjiwani02@gmail.com"
            className="hidden sm:flex bg-gradient-to-r from-[#5a82a8] to-[#84a5c6] text-[#f1f5f9] px-5 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-colors"
          >
            Let's Talk
          </a>

          {/* Hamburger Button (mobile only) */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-[#f1f5f9]/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={cn("block w-6 h-0.5 bg-[#f1f5f9] transition-all duration-300", menuOpen && "rotate-45 translate-y-2")} />
            <span className={cn("block w-6 h-0.5 bg-[#f1f5f9] transition-all duration-300", menuOpen && "opacity-0")} />
            <span className={cn("block w-6 h-0.5 bg-[#f1f5f9] transition-all duration-300", menuOpen && "-rotate-45 -translate-y-2")} />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="glass mt-3 rounded-2xl px-6 py-4 flex flex-col gap-4 border border-[#f1f5f9]/10">
              {['About', 'Skills', 'Experience', 'Projects', 'Contact'].map((item) => (
                <ScrollLink
                  key={item}
                  to={item.toLowerCase()}
                  smooth={true}
                  duration={500}
                  className="cursor-pointer text-sm font-medium hover:text-[#84a5c6] transition-colors py-1"
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </ScrollLink>
              ))}
              <div className="flex flex-col gap-3 pt-3 border-t border-[#f1f5f9]/10">
                <a
                  href="/resume.pdf"
                  download="Khushjiwani_Resume.pdf"
                  className="flex items-center gap-2 text-sm font-medium border border-[#f1f5f9]/20 px-4 py-2 rounded-full hover:bg-[#f1f5f9]/5 transition-colors w-fit"
                >
                  <Download size={16} />
                  Resume
                </a>
                <a
                  href="mailto:khushjiwani02@gmail.com"
                  className="bg-gradient-to-r from-[#5a82a8] to-[#84a5c6] text-[#f1f5f9] px-5 py-2 rounded-full text-sm font-medium w-fit"
                >
                  Let's Talk
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Hi! I'm Khush's AI assistant. Ask me anything about his projects, skills, or experience!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const resumeContext = `
        Name: Khush Jiwani
        Role: Full Stack & Gen AI Developer
        Experience: ${JSON.stringify(EXPERIENCES)}
        Skills: ${JSON.stringify(SKILLS_CATEGORIZED)}
        Projects: ${JSON.stringify(PROJECTS)}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: 'user', parts: [{ text: `You are Khush Jiwani's professional AI assistant. Use this resume data: ${resumeContext}\n\nUser Question: ${userMsg}` }] }],
      });

      setMessages(prev => [...prev, { role: 'bot', text: response.text || "I'm not sure about that." }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting to my brain right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-80 h-[450px] glass rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#f1f5f9]/20"
          >
            <div className="bg-[#252830] border-b border-[#f1f5f9]/10 text-[#f1f5f9] p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[#94a3b8]" />
                <span className="text-sm font-semibold">AI Portfolio Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:text-[#94a3b8] transition-colors">
                <X size={18} />
              </button>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={cn(
                  "max-w-[85%] p-3 rounded-2xl text-sm shadow-sm",
                  msg.role === 'user' ? "bg-gradient-to-r from-[#5a82a8] to-[#84a5c6] text-[#f1f5f9] ml-auto rounded-tr-none" : "bg-[#f1f5f9]/10 text-[#f1f5f9] rounded-tl-none border border-[#f1f5f9]/20/50"
                )}>
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div className="bg-[#f1f5f9]/5 text-[#94a3b8] p-2 rounded-xl text-xs flex items-center gap-2 w-fit border border-[#f1f5f9]/10">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-[#f1f5f9]/10 bg-[#252830]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about my projects..."
                  className="flex-1 bg-[#f1f5f9]/5 border-none rounded-full px-4 py-2 text-sm focus:ring-1 focus:ring-[#5a82a8] outline-none"
                />
                <button
                  onClick={handleSend}
                  className="bg-gradient-to-r from-[#5a82a8] to-[#84a5c6] text-[#f1f5f9] p-2 rounded-full hover:opacity-80 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative bg-gradient-to-r from-[#5a82a8] to-[#84a5c6] text-[#f1f5f9] p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
      >
        <MessageSquare size={24} />
        <span className="absolute right-full mr-4 bg-[#94a3b8] text-[#f1f5f9] text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
          Talk to my AI Assistant
        </span>
      </button>
    </div>
  );
};

export default function App() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
    status: 'idle' as 'idle' | 'submitting' | 'success' | 'error'
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState(prev => ({ ...prev, status: 'submitting' }));

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message
        })
      });

      if (response.ok) {
        setFormState({ name: '', email: '', message: '', status: 'success' });
        setTimeout(() => setFormState(prev => ({ ...prev, status: 'idle' })), 5000);
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      console.error(error);
      setFormState(prev => ({ ...prev, status: 'error' }));
      setTimeout(() => setFormState(prev => ({ ...prev, status: 'idle' })), 5000);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.45]"
          style={{ backgroundImage: "url('/bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-[#1a1c23]/60" />
      </div>
      <Navbar />
      <AIChat />

      {/* --- Hero Section --- */}
      <section id="about" className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 flex items-center gap-2 bg-[#f1f5f9]/10 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] text-[#94a3b8] border border-[#f1f5f9]/20"
          >
            <Sparkles size={14} className="text-[#f1f5f9]" />
            Full Stack & Gen AI Developer
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#f1f5f9] to-slate-500 tracking-tighter mb-10 leading-none"
          >
            <span className="text-gradient">Khush</span> <span className="font-light text-[#94a3b8]">Jiwani</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl text-xl text-[#94a3b8] mb-12 leading-relaxed font-medium"
          >
            Full Stack & Gen AI Developer specializing in <span className="text-[#f1f5f9]">MERN stack</span> and <span className="text-[#f1f5f9]">LLM integrations</span>. I build production-grade systems that bridge human creativity and machine intelligence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mb-24"
          >
            <ScrollLink to="projects" smooth={true} className="bg-gradient-to-r from-[#5a82a8] to-[#84a5c6] text-[#f1f5f9] px-10 py-4 rounded-full font-bold hover:bg-[#94a3b8] transition-all cursor-pointer flex items-center gap-2 shadow-2xl shadow-[#5a82a8]/20">
              View Featured Work
              <ChevronRight size={18} />
            </ScrollLink>
            <a href="https://github.com/khushjiwani" target="_blank" rel="noopener" className="border border-[#f1f5f9]/20 px-8 py-4 rounded-full font-bold hover:bg-[#f1f5f9]/5 transition-colors flex items-center gap-2 text-[#94a3b8]">
              <Github size={18} />
              GitHub
            </a>
          </motion.div>

          {/* Career & Passion - Centered Layout */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left w-full pt-20 border-t border-[#f1f5f9]/10"
          >
            <div className="space-y-4">
              <h3 className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">Career Objectives</h3>
              <p className="text-xl font-medium text-[#f1f5f9] leading-snug">
                Seeking to drive innovation in <span className="underline decoration-gray-300 underline-offset-4">AI-driven web development</span> by architecting scalable systems and intuitive Large Language Model integrations.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xs font-black text-[#94a3b8] uppercase tracking-widest">Technological Passion</h3>
              <p className="text-lg text-[#94a3b8] leading-relaxed font-medium">
                Deeply invested in system architecture, real-time data orchestration, and the transformative potential of RAG systems. I strive for code that is both resilient and elegant.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Skills Section --- */}
      <section id="skills" className="py-24 px-6 bg-[#252830] border-y border-[#f1f5f9]/10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Technical Mastery</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#5a82a8] to-[#84a5c6] mx-auto rounded-full mb-6"></div>
            <p className="text-[#94a3b8] max-w-xl mx-auto">A comprehensive toolkit for developing modern, high-performance digital products.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(SKILLS_CATEGORIZED).map(([category, items], idx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group p-8 rounded-3xl border border-[#f1f5f9]/10 bg-[#1a1c23] hover:bg-[#252830] hover:shadow-2xl hover:shadow-[#5a82a8]/10 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-[#252830] rounded-2xl shadow-sm group-hover:bg-gradient-to-r from-[#5a82a8] to-[#84a5c6] group-hover:text-[#f1f5f9] transition-colors duration-300">
                    {category === 'Programming Languages' && <Terminal size={22} />}
                    {category === 'Frameworks & Libraries' && <Layers size={22} />}
                    {category === 'Databases' && <Database size={22} />}
                    {category === 'Cloud Services' && <Cloud size={22} />}
                    {category === 'AI/ML Tools' && <BrainCircuit size={22} />}
                  </div>
                  <h3 className="font-bold text-lg">{category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span key={skill} className="px-3.5 py-1.5 bg-[#252830] text-gray-700 rounded-xl text-sm font-medium border border-[#f1f5f9]/10 shadow-sm transition-transform hover:scale-105">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Experience Section --- */}
      <section id="experience" className="py-24 px-6 bg-[#1a1c23]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Professional Experience</h2>
            <p className="text-[#94a3b8]">My journey through high-impact technical roles.</p>
          </div>
          <div className="space-y-16">
            {EXPERIENCES.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative pl-12 border-l-2 border-[#f1f5f9]/20 pb-4"
              >
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#252830] border-4 border-[#5a82a8] shadow-sm" />
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-[#f1f5f9]">{exp.role}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-medium text-[#94a3b8]">{exp.company}</span>
                    </div>
                  </div>
                  <span className="inline-block mt-3 md:mt-0 text-[10px] font-black tracking-widest uppercase bg-gradient-to-r from-[#5a82a8] to-[#84a5c6] text-[#f1f5f9] px-3 py-1.5 rounded-full">
                    {exp.period}
                  </span>
                </div>
                <ul className="space-y-4">
                  {exp.points.map((pt, i) => (
                    <li key={i} className="text-[#94a3b8] leading-relaxed relative flex gap-4 pr-4">
                      <div className="mt-2.5 w-1.5 h-1.5 bg-gray-300 rounded-full flex-shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Projects Section --- */}
      <section id="projects" className="py-24 px-6 bg-[#252830]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">Key Projects</h2>
            <p className="text-[#94a3b8] max-w-xl mx-auto">Selected work showcasing full-stack mastery and AI integration.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {PROJECTS.map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="group p-10 rounded-[3rem] bg-[#1a1c23] border border-[#f1f5f9]/10 flex flex-col h-full hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-500"
              >
                <div className="flex justify-between items-start mb-10">
                  <div className="p-4 bg-gradient-to-r from-[#5a82a8] to-[#84a5c6] text-[#f1f5f9] rounded-[1.5rem] shadow-xl shadow-[#5a82a8]/20 group-hover:scale-110 transition-transform duration-500">
                    {project.title.includes('AI') ? <Sparkles size={28} /> : <Code2 size={28} />}
                  </div>
                  <div className="flex gap-4">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener" className="p-3 bg-[#252830] text-[#94a3b8] rounded-full hover:text-[#f1f5f9] hover:bg-[#f1f5f9]/10 transition-all border border-[#f1f5f9]/10 shadow-sm">
                        <Github size={20} />
                      </a>
                    )}
                    {project.demo && (
                      <a href={project.demo} target="_blank" rel="noopener" className="p-3 bg-[#252830] text-[#94a3b8] rounded-full hover:text-[#f1f5f9] hover:bg-[#f1f5f9]/10 transition-all border border-[#f1f5f9]/10 shadow-sm">
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-6 group-hover:text-[#f1f5f9] transition-colors">{project.title}</h3>
                <p className="text-[#94a3b8] mb-10 flex-1 leading-relaxed text-lg">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2.5 mt-auto">
                  {project.stack.map((tag) => (
                    <span key={tag} className="text-[10px] font-extrabold tracking-widest uppercase bg-[#252830] border border-[#f1f5f9]/10 px-3 py-1.5 rounded-lg text-[#94a3b8] group-hover:text-[#94a3b8] group-hover:border-[#f1f5f9]/20 transition-colors shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Career Goals & Passion (New Section) --- */}
      <section className="py-24 px-6 bg-gradient-to-r from-[#5a82a8] to-[#84a5c6] text-[#f1f5f9] relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-[#94a3b8] opacity-20 blur-[120px] rounded-full" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-2xl font-bold text-[#f1f5f9] uppercase tracking-widest mb-6">Career Objectives</h2>
              <p className="text-2xl md:text-3xl font-bold text-[#f1f5f9] leading-relaxed">
                "Seeking to leverage my expertise in <span className="text-[#f1f5f9] underline decoration-gray-500 underline-offset-8">MERN stack and LLMs</span> to contribute to innovative projects that push the boundaries of AI-driven web development."
              </p>
            </div>
            <div className="pt-12 border-t border-gray-800">
              <h2 className="text-2xl font-bold text-[#f1f5f9] uppercase tracking-widest mb-6">What Drives Me</h2>
              <p className="text-xl text-[#f1f5f9] font-bold">
                Deeply passionate about system architecture, real-time data flow, and the future of Generative AI in enhancing productivity. I believe in writing code that is not just functional, but a work of art.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Contact / Footer Section --- */}
      <section id="contact" className="py-32 px-6 bg-[#252830] border-t border-[#f1f5f9]/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <div className="text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-5xl font-bold mb-8 tracking-tighter">Let's build something <span className="text-[#94a3b8]">extraordinary.</span></h2>
                <p className="text-xl text-[#94a3b8] mb-12 leading-relaxed max-w-md">
                  Currently open to full-time roles and high-impact freelance opportunities. Let's discuss how my expertise can benefit your team.
                </p>

                <div className="space-y-8">
                  <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 bg-gradient-to-r from-[#5a82a8] to-[#84a5c6] text-[#f1f5f9] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-[#94a3b8] uppercase tracking-widest mb-1">Email Me</h3>
                      <p className="text-lg font-bold">khushjiwani02@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 group">
                    <div className="w-14 h-14 bg-[#0A66C2] text-[#f1f5f9] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Linkedin size={24} />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-[#94a3b8] uppercase tracking-widest mb-1">LinkedIn</h3>
                      <a href="https://linkedin.com/in/khushjiwani" target="_blank" rel="noopener" className="text-lg font-bold hover:underline">/khushjiwani</a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#f1f5f9]/5 p-8 md:p-12 rounded-[3rem] border border-[#f1f5f9]/10"
            >
              <form onSubmit={handleContactSubmit} className="space-y-6 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest ml-1">Name</label>
                    <input
                      required
                      type="text"
                      placeholder="xyz"
                      value={formState.name}
                      onChange={e => setFormState(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-[#252830] border border-[#f1f5f9]/20 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#5a82a8] transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest ml-1">Email</label>
                    <input
                      required
                      type="email"
                      placeholder="exy"
                      value={formState.email}
                      onChange={e => setFormState(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-[#252830] border border-[#f1f5f9]/20 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#5a82a8] transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest ml-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell me about your project or opportunity..."
                    value={formState.message}
                    onChange={e => setFormState(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full bg-[#252830] border border-[#f1f5f9]/20 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#5a82a8] transition-all outline-none resize-none"
                  ></textarea>
                </div>
                <button
                  disabled={formState.status === 'submitting'}
                  className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${formState.status === 'success' ? 'bg-green-500 text-[#f1f5f9]' :
                      formState.status === 'error' ? 'bg-red-500 text-[#f1f5f9]' :
                        'bg-gradient-to-r from-[#5a82a8] to-[#84a5c6] text-[#f1f5f9] hover:scale-[1.02] active:scale-95 shadow-[#5a82a8]/20'
                    }`}
                >
                  {formState.status === 'submitting' ? 'Sending...' :
                    formState.status === 'success' ? 'Message Sent!' :
                      formState.status === 'error' ? 'Failed to send' : 'Send Message'}
                  {formState.status === 'idle' && <Send size={20} />}
                </button>
              </form>
            </motion.div>
          </div>

          <div className="mt-32 pt-12 border-t border-[#f1f5f9]/10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-medium text-[#94a3b8]">
            <span>© 2026 Khush Jiwani. Built with React & AI.</span>
            <div className="flex gap-8">
              <ScrollLink to="about" smooth={true} className="hover:text-[#f1f5f9] cursor-pointer transition-colors">About</ScrollLink>
              <ScrollLink to="projects" smooth={true} className="hover:text-[#f1f5f9] cursor-pointer transition-colors">Projects</ScrollLink>
              <a href="https://github.com/khushjiwani" target="_blank" rel="noopener" className="hover:text-[#f1f5f9] transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
