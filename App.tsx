import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  BarChart, 
  Search, 
  Cpu, 
  Layers,
  AlertTriangle,
  Zap,
  Activity,
  Menu,
  X,
  Target,
  MousePointerClick,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  CheckCircle2,
  Phone,
  Users,
  ShieldAlert
} from 'lucide-react';

// --- Constants ---
const WHATSAPP_NUMBER = "5561981535040";
const WHATSAPP_MSG = encodeURIComponent("Hello Weskley, I came from your website and would like to schedule a strategic diagnosis for my company.");
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;

// --- Interfaces ---
interface NavLink {
  name: string;
  href: string;
}

// --- Helper Functions ---
const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
  e.preventDefault();
  const element = document.getElementById(id.replace('#', ''));
  if (element) {
    const offset = 80; 
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// --- Shared Components ---
const PrimaryCTA = ({ text, className = "", icon: Icon = ArrowRight }: { text: string, className?: string, icon?: any }) => (
  <a 
    href={WHATSAPP_LINK} 
    target="_blank" 
    rel="noopener noreferrer" 
    className={`group relative inline-flex items-center justify-center gap-4 px-10 py-6 bg-slate-950 text-white text-lg font-black rounded-3xl transition-all shadow-[0_20px_40px_-10px_rgba(15,23,42,0.3)] hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.5)] hover:-translate-y-1 active:scale-95 overflow-hidden ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
    <span className="relative z-10">{text}</span>
    <Icon className="relative z-10 group-hover:translate-x-2 transition-transform" />
  </a>
);

// --- Interactive Globe Component ---
const InteractiveGlobe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotation = useRef({ x: 0.2, y: 0 }); 
  const targetRotation = useRef({ x: 0.2, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    window.addEventListener('resize', resize);
    resize();

    const points: { x: number; y: number; z: number; color?: string; size: number; pulse?: number }[] = [];
    const count = 900; 
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      points.push({
        x: Math.cos(theta) * Math.sin(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(phi),
        size: Math.random() * 1.5 + 0.6,
        color: Math.random() > 0.94 ? ['#4285F4', '#EA4335', '#FBBC05', '#34A853'][Math.floor(Math.random() * 4)] : undefined,
        pulse: Math.random() * Math.PI * 2
      });
    }

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      
      targetRotation.current.y += 0.0025;
      rotation.current.x += (targetRotation.current.x - rotation.current.x) * 0.05;
      rotation.current.y += (targetRotation.current.y - rotation.current.y) * 0.05;

      const radius = Math.min(width, height) * 0.44;
      const centerX = width / 2;
      const centerY = height / 2;

      const sortedPoints = [...points].sort((a, b) => {
        const az = a.z * Math.cos(rotation.current.x) - a.x * Math.sin(rotation.current.x);
        const bz = b.z * Math.cos(rotation.current.x) - b.x * Math.sin(rotation.current.x);
        return az - bz;
      });

      sortedPoints.forEach(p => {
        let x1 = p.x;
        let y1 = p.y * Math.cos(rotation.current.x) - p.z * Math.sin(rotation.current.x);
        let z1 = p.y * Math.sin(rotation.current.x) + p.z * Math.cos(rotation.current.x);

        let x2 = x1 * Math.cos(rotation.current.y) + z1 * Math.sin(rotation.current.y);
        let y2 = y1;
        let z2 = -x1 * Math.sin(rotation.current.y) + z1 * Math.cos(rotation.current.y);

        const scale = 1 + z2 * 0.5;
        const opacity = Math.max(0.1, (z2 + 1.3) / 2.3);
        
        const px = centerX + x2 * radius;
        const py = centerY + y2 * radius;

        ctx.beginPath();
        const pulseSize = p.color ? Math.sin(time * 0.005 + p.pulse!) * 0.5 + 1 : 1;
        ctx.arc(px, py, p.size * scale * pulseSize, 0, Math.PI * 2);
        
        if (p.color) {
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 15;
          ctx.shadowColor = p.color;
          ctx.globalAlpha = opacity;
        } else {
          ctx.fillStyle = '#64748b'; 
          ctx.shadowBlur = 0;
          ctx.globalAlpha = opacity * 0.5;
        }
        
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / width - 0.5;
      const y = (e.clientY - rect.top) / height - 0.5;
      targetRotation.current.x = y * 0.5 + 0.2; 
      targetRotation.current.y += x * 0.03;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[650px] mx-auto flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-tr from-[#4285F4]/10 via-transparent to-[#EA4335]/10 rounded-full blur-[140px] opacity-60"></div>
      <div className="absolute w-[80%] h-[80%] bg-white rounded-full shadow-[0_0_100px_rgba(66,133,244,0.15)] opacity-50"></div>
      
      <canvas 
        ref={canvasRef} 
        className="relative z-10 w-full h-full cursor-grab active:cursor-grabbing transform scale-110"
        style={{ touchAction: 'none' }}
      />

      <div className="absolute top-[10%] left-0 z-20 p-5 bg-white/60 backdrop-blur-xl border border-white rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] transform hover:-translate-y-1 transition-all duration-500">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#34A853] animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Global Search Nodes</span>
        </div>
        <div className="text-2xl font-[1000] text-slate-950 tracking-tighter">98.4% <span className="text-[10px] text-[#34A853] font-bold">Uptime</span></div>
      </div>

      <div className="absolute bottom-[15%] right-0 z-20 p-6 bg-slate-900 shadow-[0_30px_60px_-15px_rgba(15,23,42,0.3)] border border-white/10 rounded-[2.5rem] transform hover:translate-y-1 transition-all duration-500">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-1.5 bg-[#4285F4]/20 rounded-lg">
            <Cpu size={14} className="text-[#4285F4]" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50">IA Protocol 2.5</span>
        </div>
        <div className="space-y-3">
           <div className="text-xs font-bold text-white tracking-tight flex justify-between items-center gap-6">
             <span>Neural Filtering</span>
             <span className="text-[#4285F4]">Active</span>
           </div>
           <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#4285F4] to-[#34A853] w-[75%] animate-[shimmer_3s_infinite]"></div>
           </div>
        </div>
      </div>

      <div className="absolute inset-0 border-[1px] border-slate-200/40 rounded-full scale-[0.7] pointer-events-none"></div>
      <div className="absolute inset-0 border-[1px] border-dashed border-[#4285F4]/20 rounded-full scale-[1.2] pointer-events-none animate-[spin_100s_linear_infinite]"></div>
      <div className="absolute inset-0 border-[1px] border-slate-100/50 rounded-full scale-[1.35] pointer-events-none"></div>
    </div>
  );
};

// --- Navbar Component ---
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileScrollY, setMobileScrollY] = useState(0);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setMobileScrollY(e.currentTarget.scrollTop);
  };

  const navLinks: NavLink[] = [
    { name: "The Abyss", href: "#problem" },
    { name: "The Structure", href: "#solution" },
    { name: "Cases", href: "#cases" },
    { name: "Protocols", href: "#method" },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50 py-3 shadow-lg shadow-slate-900/5' 
          : 'bg-transparent py-8'
      }`}>
        <div 
          className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853] transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="container mx-auto px-6 flex justify-between items-center">
          <a href="#" className="flex items-center gap-3 group">
            <div 
              className="relative w-10 h-10 flex items-center justify-center transition-transform duration-75 ease-out"
              style={{ transform: `rotate(${scrollProgress * 3.6}deg)` }}
            >
               <div className="absolute inset-0 bg-[#4285F4]/10 rounded-full scale-150 blur-xl"></div>
               <div className="absolute w-1.5 h-6 bg-[#4285F4] rounded-full" style={{ transform: 'rotate(0deg) translateY(-8px)' }}></div>
               <div className="absolute w-1.5 h-6 bg-[#EA4335] rounded-full" style={{ transform: 'rotate(90deg) translateY(-8px)' }}></div>
               <div className="absolute w-1.5 h-6 bg-[#FBBC05] rounded-full" style={{ transform: 'rotate(180deg) translateY(-8px)' }}></div>
               <div className="absolute w-1.5 h-6 bg-[#34A853] rounded-full" style={{ transform: 'rotate(270deg) translateY(-8px)' }}></div>
            </div>

            <div className="flex flex-col -space-y-1">
              <span className="text-xl font-[1000] tracking-tighter text-slate-950 uppercase">
                Weskley<span className="text-[#4285F4]">Gomes</span>
              </span>
              <span className="text-[9px] font-black tracking-[0.4em] text-slate-400 uppercase">Digital Structure Specialist</span>
            </div>
          </a>

          <div className="hidden lg:flex gap-10 items-center">
            <div className="flex gap-10 text-[11px] font-bold text-slate-500 tracking-[0.2em] uppercase">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="relative py-2 hover:text-slate-900 transition-colors group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#4285F4] transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
            <div className="h-6 w-[1px] bg-slate-200"></div>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="relative overflow-hidden bg-slate-950 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 hover:shadow-[0_10px_30px_-10px_rgba(15,23,42,0.5)] active:scale-95 group">
              <span className="relative z-10 flex items-center gap-2">Book Strategy Call <ChevronRight size={14} /></span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#4285F4] to-[#EA4335] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </a>
          </div>

          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-3 bg-slate-100 rounded-2xl text-slate-900 hover:bg-slate-200 transition-colors">
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 z-[200] lg:hidden transition-all duration-500 ${mobileMenuOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-500 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMobileMenuOpen(false)} />
        <div className={`absolute right-0 top-0 bottom-0 w-[85%] max-sm:w-[90%] bg-slate-950 shadow-2xl transition-transform duration-500 ease-out overflow-hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none z-0"
            style={{ 
              transform: `translateY(${mobileScrollY * 0.3}px)`,
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px',
              height: '150%'
            }}
          />

          <div 
            ref={mobileMenuRef}
            onScroll={handleMobileScroll}
            className="relative z-10 p-10 h-full flex flex-col overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-20">
              <span className="text-2xl font-[1000] tracking-tighter text-white uppercase">Weskley<span className="text-[#4285F4]">Gomes</span></span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-3 bg-white/10 rounded-2xl text-white hover:bg-white/20 transition-colors"><X size={24} /></button>
            </div>
            
            <div className="flex flex-col gap-12">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    scrollToSection(e, link.href);
                  }} 
                  className="text-4xl font-[1000] text-white tracking-tighter flex items-center justify-between group"
                >
                  {link.name}
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all">
                    <ArrowRight className="text-[#4285F4]" />
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-auto pt-20 space-y-8">
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="w-full block text-center py-8 bg-[#EA4335] text-white font-black text-sm uppercase tracking-[0.2em] rounded-3xl shadow-2xl active:scale-95 transition-all">
                Scale Now
              </a>
              <div className="flex justify-center gap-10">
                <MessageSquare size={24} className="text-slate-500 hover:text-white transition-colors cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const SectionHeader = ({ badge, title, subtitle, centered = true, color = "#4285F4", isDark = false }: { badge: string, title: string, subtitle?: string, centered?: boolean, color?: string, isDark?: boolean }) => (
  <div className={`${centered ? 'text-center' : 'text-left'} max-w-4xl ${centered ? 'mx-auto' : ''} mb-24`}>
    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.25em] mb-10 border shadow-sm transition-transform hover:scale-105 cursor-default" 
         style={{ backgroundColor: `${color}10`, color: color, borderColor: `${color}30` }}>
      <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }}></div>
      {badge}
    </div>
    <h2 className={`text-4xl md:text-7xl font-[1000] mb-8 leading-[1] tracking-tighter ${isDark ? 'text-white' : 'text-slate-950'}`}>
      {title}
    </h2>
    {subtitle && <p className={`text-xl md:text-2xl font-medium leading-relaxed max-w-3xl ${centered ? 'mx-auto' : ''} ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{subtitle}</p>}
  </div>
);

const App: React.FC = () => {
  const techs = [
    'Google Ads', 'Meta Ads', 'Gemini AI', 'SEO', 'AEO', 'Google Cloud', 'Search Console', 'Analytics 4'
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-[#4285F4]/20 selection:text-[#4285F4] overflow-x-hidden">
      <Navbar />

      {/* PERSISTENT FLOATING CTA (Mobile/Desktop) */}
      <a 
        href={WHATSAPP_LINK} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-8 right-8 z-[150] flex items-center justify-center w-16 h-16 bg-[#34A853] text-white rounded-full shadow-[0_20px_40px_rgba(52,168,83,0.4)] hover:scale-110 active:scale-95 transition-all animate-bounce group"
      >
        <Phone size={28} className="fill-current" />
        <span className="absolute right-full mr-4 px-4 py-2 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none">Talk to the Specialist</span>
      </a>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-[20s] scale-110"
            style={{ 
              backgroundImage: `url('https://i.imgur.com/oAOOb88.jpeg')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white"></div>
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '48px 48px' }}></div>
        </div>
        
        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
            <div className="relative z-20">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#4285F4]/10 rounded-xl text-[#4285F4] text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-[#4285F4]/20 animate-float">
                <ShieldCheck size={14} /> Digital Structure Specialist
              </div>
              <h1 className="text-5xl md:text-[clamp(48px,8vw,84px)] font-[1000] mb-8 leading-[1.02] tracking-tighter text-slate-950">
                Move from <span className="text-slate-300 italic block sm:inline">hope</span> to <span className="relative inline-block text-[#4285F4]">predictability.<div className="absolute bottom-2 md:bottom-4 left-0 w-full h-3 md:h-4 bg-[#4285F4]/10 -z-10"></div></span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-xl leading-relaxed font-medium">
                Your company generates revenue, but your digital structure is a technical desert. I build the <strong className="text-slate-900">ecosystem</strong> that transforms searches into real profit.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 mb-16">
                <PrimaryCTA text="Scale Structure" />
                <a href="#method" onClick={(e) => scrollToSection(e, "#method")} className="px-10 py-6 bg-white hover:bg-slate-50 text-slate-950 text-lg font-black rounded-3xl border-2 border-slate-100 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95">
                   <Target size={20} className="text-[#EA4335]" /> View Method
                </a>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 border-t border-slate-100">
                 {[
                   { label: "Search Engine", val: "Elite", color: "#4285F4" },
                   { label: "AI Prediction", val: "Active", color: "#34A853" },
                   { label: "Growth Ops", val: "Scale", color: "#EA4335" },
                   { label: "Conversion", val: "92%", color: "#FBBC05" }
                 ].map((stat, i) => (
                   <div key={i}>
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                      <div className="text-base font-black text-slate-900 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stat.color }}></div>
                        {stat.val}
                      </div>
                   </div>
                 ))}
              </div>
            </div>

            <div className="relative z-10 flex justify-center lg:justify-end items-center">
               <InteractiveGlobe />
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section id="problem" className="py-40 bg-slate-50 relative">
        <div className="container mx-auto px-6">
          <SectionHeader badge="The Bitter Diagnosis" title="You are funding your competitor." subtitle="If your potential customer searches on Google and finds your competitor before you, your company is bleeding capital and opportunity." color="#EA4335" />
          
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto mb-20">
            {[
              { 
                icon: <AlertTriangle size={36} />, 
                title: "Technical Invisibility", 
                desc: "It's not enough to have a website. If Google's algorithm doesn't understand your technical authority, you don't exist for the market.",
                label: "Average Loss: 64%"
              },
              { 
                icon: <MousePointerClick size={36} />, 
                title: "Hope Funnel", 
                desc: "Relying on referrals or random posts is amateurish. Serious businesses depend on predictable conversion structures.",
                label: "Inconsistency: Critical"
              },
              { 
                icon: <Activity size={36} />, 
                title: "Data Scarcity", 
                desc: "You make decisions based on 'feeling'. Meanwhile, the AI I implement analyzes behaviors to reduce your acquisition cost.",
                label: "Current CAC: Inefficient"
              }
            ].map((item, idx) => (
              <div key={idx} className="group relative bg-white p-12 rounded-[2.5rem] border border-slate-200 transition-all duration-500 hover:border-[#EA4335] hover:shadow-[0_40px_80px_-20px_rgba(234,67,53,0.15)] overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:opacity-[0.15] group-hover:scale-150 transition-all duration-700">
                  {item.icon}
                </div>
                <div className="mb-10 w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-950 group-hover:bg-[#EA4335] group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <h3 className="text-3xl font-[1000] mb-6 text-slate-950 tracking-tighter leading-tight">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium mb-10 text-lg">{item.desc}</p>
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={14} className="text-[#EA4335]" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-8">
            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[11px]">Identified one of these problems? The next step is the diagnosis.</p>
            <PrimaryCTA text="Diagnose my Business Now" className="bg-[#EA4335] shadow-[0_20px_50px_-10px_rgba(234,67,53,0.3)]" />
          </div>
        </div>
      </section>

      {/* TECH STACK / INFINITE MARQUEE STRIP */}
      <section className="py-24 bg-white border-y border-slate-100 overflow-hidden relative">
         <div className="container mx-auto px-6 mb-12">
            <div className="text-center">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Engineered with Industry Standards</span>
            </div>
         </div>
         <div className="flex whitespace-nowrap">
            <div className="flex animate-marquee gap-24 items-center">
               {[...techs, ...techs].map((tech, i) => (
                 <span key={i} className="text-3xl md:text-5xl font-[1000] tracking-tighter text-slate-900 lowercase italic opacity-30 hover:opacity-100 transition-opacity cursor-default px-4">
                   {tech}
                 </span>
               ))}
            </div>
         </div>
         <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
         <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
      </section>

      {/* SOLUTION */}
      <section id="solution" className="py-40 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-blue-600/5 blur-[120px] pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <SectionHeader badge="The Elite Structure" title="We build assets, not just campaigns." subtitle="A robust digital structure is the only competitive advantage that cannot be copied in 24 hours." isDark={true} color="#4285F4" />
          
          <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto mb-24">
            {[
              { title: "Organic Search Engineering (SEO)", text: "Unlike paid traffic that stops when the money runs out, technical SEO creates perpetual authority on Google for intent keywords.", icon: <Search /> },
              { title: "AI Prediction Systems", text: "We implement AI models that analyze leads in real-time, filtering out curious onlookers and focusing on actual revenue.", icon: <Cpu /> },
              { title: "Conversion Architecture (UX)", text: "Landing pages with a neuro-scientific focus. Every pixel is positioned to reduce friction and accelerate the 'Yes'.", icon: <Layers /> },
              { title: "Continuous ROI Optimization", text: "We don't just deliver and disappear. We monitor technical data daily to ensure your cost per customer keeps falling.", icon: <BarChart /> }
            ].map((item, i) => (
              <div key={i} className="p-12 bg-white/5 border border-white/10 rounded-[3rem] hover:bg-white/10 transition-all duration-500 group">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-16 h-16 bg-[#4285F4]/20 rounded-2xl flex items-center justify-center text-[#4285F4] shrink-0 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-3xl font-black mb-6 tracking-tighter">{item.title}</h4>
                    <p className="text-slate-400 font-medium text-lg leading-relaxed">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-10">
            <div className="w-24 h-[1px] bg-white/10"></div>
            <p className="text-xl md:text-2xl font-medium text-slate-400 max-w-2xl text-center">Interested in implementing this structure in your business? Start with a free technical analysis.</p>
            <PrimaryCTA text="Implement this Structure" className="bg-white text-slate-950 shadow-[0_20px_50px_-10px_rgba(255,255,255,0.1)]" />
          </div>
        </div>
      </section>

      {/* SUCCESS CASE */}
      <section id="cases" className="py-48 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <SectionHeader 
            badge="Authority Case" 
            title="Structural Dominance: When Organic Converts Better Than Paid." 
            subtitle="How we transformed Colégio Reação into an unquestionable authority on Google, generating real closures without investing a single dollar in ads." 
            color="#34A853" 
          />
          
          <div className="max-w-7xl mx-auto space-y-24">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-8">
                  <div className="flex items-center gap-4 text-[#EA4335] font-black uppercase tracking-widest text-xs">
                     <ShieldAlert size={20} /> The Dependency Abyss
                  </div>
                  <h3 className="text-4xl md:text-5xl font-[1000] text-slate-950 tracking-tighter leading-tight">
                     Renting traffic vs. <span className="text-[#4285F4]">Owning the channel.</span>
                  </h3>
                  <p className="text-xl text-slate-500 leading-relaxed font-medium">
                     Most educational institutions live under the "Ads Tax". If the ad budget runs out, leads disappear. Colégio Reação faced this scenario: ephemeral visibility and unstable acquisition cost (CAC). They didn't have a digital asset; they had a monthly debt with platforms.
                  </p>
                  <div className="p-8 bg-slate-50 border-l-4 border-[#EA4335] rounded-r-3xl italic text-slate-600 font-medium">
                     "Paid traffic is a loan. Digital structure is equity."
                  </div>
               </div>
               <div className="relative group">
                  <div className="absolute inset-0 bg-[#34A853]/10 blur-[100px] rounded-full group-hover:bg-[#34A853]/20 transition-all"></div>
                  <div className="relative z-10 bg-white p-4 rounded-[3rem] shadow-2xl border border-slate-100 transition-transform hover:-translate-y-2 duration-500">
                     <div className="p-6 bg-slate-50 rounded-[2rem] mb-6 flex justify-between items-center">
                        <img src="https://i.imgur.com/LESvkxT.png" alt="Colégio Reação" className="h-12 w-auto object-contain" />
                        <span className="px-4 py-1.5 bg-[#34A853]/10 text-[#34A853] text-[10px] font-black uppercase tracking-widest rounded-full">Organic Protocol Active</span>
                     </div>
                     <img src="https://i.imgur.com/G0AP9tB.png" alt="Search Console Proof" className="w-full h-auto rounded-2xl shadow-inner grayscale-[20%] hover:grayscale-0 transition-all" />
                  </div>
               </div>
            </div>

            <div className="bg-slate-950 rounded-[4rem] p-10 md:p-24 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] pointer-events-none"></div>
               
               <div className="grid lg:grid-cols-12 gap-16 relative z-10">
                  <div className="lg:col-span-7 space-y-12">
                     <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#34A853]">
                        <Zap size={14} /> Answer Engineering (AEO)
                     </div>
                     <h3 className="text-4xl md:text-6xl font-[1000] tracking-tighter leading-[0.95]">
                        It's not luck. <br />It's <span className="text-[#34A853]">Method</span>.
                     </h3>
                     <p className="text-xl text-slate-400 leading-relaxed font-medium">
                        We implemented an advanced <strong>AEO (Answer Engine Optimization)</strong> structure. We don't just position the site on Google; we transform Colégio Reação into the <em>only logical answer</em> for AI algorithms and intent searches. When the lead arrives organically, they are already filtered by authority.
                     </p>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl group hover:border-[#34A853] transition-all">
                           <div className="text-5xl font-black text-white mb-2">57%</div>
                           <div className="text-[10px] font-black text-[#34A853] uppercase tracking-[0.2em] mb-4">Real Conversion Rate</div>
                           <p className="text-sm text-slate-500 font-medium">For every 14 contacts generated, 8 closures. This is structural efficiency, not empty volume.</p>
                        </div>
                        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl group hover:border-[#4285F4] transition-all">
                           <div className="text-5xl font-black text-white mb-2">$ 0</div>
                           <div className="text-[10px] font-black text-[#4285F4] uppercase tracking-[0.2em] mb-4">Ad Investment</div>
                           <p className="text-sm text-slate-500 font-medium">Net profit preserved. The structure pays for itself and generates infinite ROI in the long run.</p>
                        </div>
                     </div>
                  </div>

                  <div className="lg:col-span-5 flex flex-col justify-center gap-12">
                     <div className="p-8 bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-[3rem] space-y-8">
                        <div className="flex items-center gap-4">
                           <Users className="text-[#34A853]" size={32} />
                           <div>
                              <div className="text-2xl font-black text-white">8/14 Closures</div>
                              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sales Performance</div>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <div className="flex justify-between text-[11px] font-black text-white uppercase tracking-widest">
                              <span>Lead Intent</span>
                              <span>Critical / High</span>
                           </div>
                           <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-[#34A853] w-[88%] animate-pulse"></div>
                           </div>
                        </div>
                        <img src="https://i.imgur.com/eVuz1HU.png" alt="Analytics Graph" className="w-full h-auto rounded-xl opacity-80 hover:opacity-100 transition-opacity" />
                     </div>
                  </div>
               </div>
            </div>

            <div className="max-w-4xl mx-auto text-center space-y-12">
               <h4 className="text-2xl md:text-3xl font-[1000] text-slate-950 tracking-tight">
                  Your business deserves a digital asset, not a money drain.
               </h4>
               <p className="text-lg text-slate-500 font-medium leading-relaxed">
                  This result is not replicable by a "website designer" or a "traffic agency". It is the result of search engineering and conversion processes. <strong>I don't accept all projects.</strong> I only filter companies with potential for sector dominance.
               </p>
               <div className="pt-8">
                  <PrimaryCTA text="Schedule Feasibility Diagnosis" className="bg-[#34A853] shadow-[0_30px_60px_-15px_rgba(52,168,83,0.4)] px-16" />
                  <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Only 3 slots for new assets this month.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* METHOD / PROTOCOLS */}
      <section id="method" className="py-48 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <SectionHeader badge="Technical Protocols" title="The path to predictable revenue." subtitle="Four rigorous engineering phases to transform your positioning." color="#FBBC05" />
          
          <div className="max-w-5xl mx-auto space-y-6 mb-24">
            {[
              { 
                step: "01", 
                title: "Flow and Asset Audit", 
                desc: "We analyze every blind spot in your current structure. Where is the money leaking?",
                tech: "Heatmaps, Core Web Vitals, Data Mapping"
              },
              { 
                step: "02", 
                title: "Blueprint Architecture", 
                desc: "We design the war map: keywords, user journey, and AI integration.",
                tech: "Intent Mapping, AI Logic Flow, UX Strategy"
              },
              { 
                step: "03", 
                title: "Scale Implementation", 
                desc: "We activate the engines. Technical construction, advanced tracking, and algorithm activation.",
                tech: "GTM Server Side, Ads Integration, CRM Sync"
              },
              { 
                step: "04", 
                title: "Data-Driven Scaling", 
                desc: "Surgical monitoring of data to increase investment only in what brings profit.",
                tech: "Conversion Rate Optimization, ROI Dashboards"
              }
            ].map((item, i) => (
              <div key={i} className="group relative flex flex-col md:flex-row gap-10 p-12 bg-slate-50 rounded-[3rem] border border-slate-100 hover:bg-white hover:shadow-2xl transition-all duration-500 overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 text-8xl font-[1000] text-slate-100 opacity-50 select-none">{item.step}</div>
                 <div className="relative z-10 w-20 h-20 rounded-[2rem] bg-slate-900 text-white flex items-center justify-center text-3xl font-black shrink-0 group-hover:bg-[#FBBC05] transition-colors">
                    {item.step}
                 </div>
                 <div className="relative z-10 flex-1">
                    <h4 className="text-3xl font-[1000] text-slate-950 mb-4 tracking-tighter">{item.title}</h4>
                    <p className="text-slate-500 font-medium text-xl leading-relaxed mb-8">{item.desc}</p>
                    <div className="flex flex-wrap gap-3">
                       {item.tech.split(', ').map(t => (
                         <span key={t} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400">{t}</span>
                       ))}
                    </div>
                 </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <h4 className="text-2xl font-[1000] text-slate-950 mb-8 tracking-tight">Ready to start Step 1?</h4>
            <PrimaryCTA text="Schedule Step 1: Diagnosis" className="bg-[#4285F4] shadow-[0_20px_50px_-10px_rgba(66,133,244,0.3)]" />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-48 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#4285F4]/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-5xl mx-auto">
             <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] mb-12 text-[#FBBC05]">
                <ShieldCheck size={16} /> Exclusive Diagnosis
             </div>
             <h2 className="text-6xl md:text-9xl font-[1000] text-white mb-12 leading-[0.85] tracking-tighter">
                Build your <span className="text-[#4285F4]">machine</span> today.
             </h2>
             <p className="text-2xl md:text-3xl text-slate-400 mb-20 font-medium leading-relaxed max-w-4xl mx-auto">
                I'm not an agency. I'm a specialist. I choose only <strong className="text-white">3 new projects</strong> per month to ensure real revenue.
             </p>
             <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="group relative px-16 py-10 bg-[#EA4335] text-white text-2xl font-black rounded-[2.5rem] transition-all shadow-[0_40px_100px_-20px_rgba(234,67,53,0.4)] flex items-center justify-center gap-6 mx-auto active:scale-95">
                I want my Strategic Diagnosis <ArrowRight className="group-hover:translate-x-4 transition-transform" />
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
             </a>
             
             <div className="mt-20 flex flex-col md:flex-row justify-center items-center gap-10 text-slate-500">
                <div className="flex items-center gap-3"><CheckCircle2 size={20} className="text-[#34A853]" /> 100% Personalized</div>
                <div className="flex items-center gap-3"><CheckCircle2 size={20} className="text-[#34A853]" /> Transparent Data</div>
                <div className="flex items-center gap-3"><CheckCircle2 size={20} className="text-[#34A853]" /> Focus on ROI Scaling</div>
             </div>
          </div>
        </div>
      </section>

      {/* FINAL COPYRIGHT BAR */}
      <div className="bg-slate-950 py-12 border-t border-white/5">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
           <div className="flex items-center gap-4">
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-xl font-[1000] tracking-tighter text-white uppercase hover:text-slate-200 transition-colors">
                Weskley<span className="text-[#4285F4]">Gomes</span>
              </a>
           </div>
           <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">© 2026 | High-End Digital Strategy</p>
        </div>
      </div>
    </div>
  );
};

export default App;