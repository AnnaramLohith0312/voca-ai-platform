import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const scoreAnimatedRef = useRef(false);

  // Match Score Animation
  const animateScore = () => {
    if (scoreAnimatedRef.current) return;
    scoreAnimatedRef.current = true;

    const ring = document.getElementById("match-score-ring");
    const text = document.getElementById("match-score-text");
    if (!ring || !text) return;

    const targetScore = 98;
    const duration = 2000;
    const circumference = 2 * Math.PI * 40;

    ring.style.strokeDashoffset = (circumference - (targetScore / 100) * circumference).toString();

    let start: number | null = null;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const current = Math.floor(progress * targetScore);
      text.innerText = current + "%";
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  // Canvas Starfield Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    interface StarInstance {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      update: () => void;
      draw: () => void;
    }

    let stars: StarInstance[] = [];
    const starCount = 150;
    let animationFrameId: number;

    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Star implements StarInstance {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * (canvas?.width || window.innerWidth);
        this.y = Math.random() * (canvas?.height || window.innerHeight);
        this.size = Math.random() * 1.5;
        this.speed = Math.random() * 0.05;
        this.opacity = Math.random();
      }

      update() {
        this.y -= this.speed;
        if (canvas && this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(94, 217, 211, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initStars = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
      }
    };

    const animateStars = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        star.update();
        star.draw();
      });
      animationFrameId = requestAnimationFrame(animateStars);
    };

    window.addEventListener("resize", resize);
    resize();
    initStars();
    animateStars();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Parallax Event Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const card = cardRef.current;
    if (!container || !card) return;

    const { left, top, width, height } = container.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;

    card.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10 + 6}deg) translateY(${-y * 10}px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = `perspective(1000px) rotateX(6deg) translateY(0px)`;
  };

  // Scroll Blur & Intersections
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.getElementById("navbar");
      if (nav) {
        if (window.scrollY > 20) {
          nav.classList.add("bg-[#111418]/80", "backdrop-blur-[20px]", "border-b", "border-white/10");
          nav.classList.remove("bg-transparent", "py-4");
        } else {
          nav.classList.remove("bg-[#111418]/80", "backdrop-blur-[20px]", "border-b", "border-white/10");
          nav.classList.add("bg-transparent", "py-4");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    // Intersection Observer
    const revealOptions = { threshold: 0.15 };
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          entry.target.classList.add("opacity-100");
          entry.target.classList.remove("translate-y-4", "translate-y-10");

          if (entry.target.id === "results") {
            animateScore();
          }
        }
      });
    }, revealOptions);

    const elements = document.querySelectorAll(".reveal-clip, .reveal-item, #results");
    elements.forEach((el) => revealObserver.observe(el));

    // Initial load transition sequence trigger
    const badgeTimer = setTimeout(() => {
      document.getElementById("hero-badge")?.classList.add("opacity-100", "translate-y-0");
      document.querySelectorAll("#hero-title span").forEach((span) => {
        span.classList.add("opacity-100", "translate-y-0");
      });
      document.getElementById("hero-sub")?.classList.add("opacity-100", "translate-y-0");
      document.getElementById("hero-ctas")?.classList.add("opacity-100", "translate-y-0");
    }, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      elements.forEach((el) => revealObserver.unobserve(el));
      clearTimeout(badgeTimer);
    };
  }, []);

  return (
    <div className="cinematic-landing-page select-none selection:bg-primary selection:text-on-primary font-body relative overflow-x-hidden min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: `
        .cinematic-landing-page {
            --fluid-h1: clamp(2.75rem, 5vw + 1rem, 5.5rem);
            --fluid-h2: clamp(2rem, 3vw + 1rem, 3rem);
            --fluid-body: clamp(1rem, 0.2vw + 0.9rem, 1.125rem);
            --fluid-label: clamp(0.75rem, 0.1vw + 0.7rem, 0.875rem);
            --primary: 177 62% 61%; /* #5ed9d3 */
            --on-primary: 180 100% 11%; /* #003735 */
            --secondary: 39 86% 67%; /* #f1be63 */
            --on-secondary: 40 100% 13%; /* #422c00 */
            --surface: 214 33% 5%; /* #0b0e12 */
            --on-surface: 228 11% 89%; /* #e1e2e8 */
            --surface-container-lowest: 214 33% 5%; /* #0b0e12 */
            --surface-container-low: 214 13% 11%; /* #191c20 */
            --surface-container: 216 11% 13%; /* #1d2024 */
            --surface-container-high: 218 9% 17%; /* #272a2f */
            --surface-container-highest: 214 6% 21%; /* #323539 */
            --on-surface-variant: 175 11% 76%; /* #bcc9c8 */
            --error: 6 100% 83%; /* #ffb4ab */
            --error-container: 356 100% 29%; /* #93000a */
            background-color: #0b0e12;
            color: #e1e2e8;
            font-size: var(--fluid-body);
        }
        .cinematic-landing-page h1 { font-size: var(--fluid-h1); font-weight: 650; letter-spacing: -0.03em; }
        .cinematic-landing-page h2 { font-size: var(--fluid-h2); }
        
        .cinematic-landing-page .glass-card {
            background: rgba(17, 20, 24, 0.6);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
        }

        .cinematic-landing-page .hero-float {
            animation: float 6s ease-in-out infinite;
            transform-style: preserve-3d;
            perspective: 1000px;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px) rotateX(6deg); }
            50% { transform: translateY(-10px) rotateX(8deg); }
        }

        .cinematic-landing-page .shimmer-btn {
            position: relative;
            overflow: hidden;
        }
        .cinematic-landing-page .shimmer-btn::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -150%;
            width: 200%;
            height: 200%;
            background: linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent);
            transform: rotate(45deg);
            transition: 0.6s;
        }
        .cinematic-landing-page .shimmer-btn:hover::after {
            left: 150%;
        }

        .cinematic-landing-page .marquee-content {
            display: flex;
            width: fit-content;
            animation: marquee 40s linear infinite;
        }
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }

        .cinematic-landing-page .reveal-clip {
            clip-path: inset(100% 0 0 0);
            transition: clip-path 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cinematic-landing-page .reveal-clip.visible {
            clip-path: inset(0 0 0 0);
        }

        .cinematic-landing-page .nav-underline {
            position: relative;
        }
        .cinematic-landing-page .nav-underline::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 0;
            height: 2px;
            background: #5ed9d3;
            transition: width 0.3s ease;
        }
        .cinematic-landing-page .nav-underline:hover::after {
            width: 100%;
        }

        @media (prefers-reduced-motion: reduce) {
            .cinematic-landing-page *, .cinematic-landing-page ::before, .cinematic-landing-page ::after {
                animation-delay: -1ms !important;
                animation-duration: 1ms !important;
                animation-iteration-count: 1 !important;
                background-attachment: initial !important;
                scroll-behavior: auto !important;
                transition-duration: 0s !important;
                transition-delay: 0s !important;
            }
            .cinematic-landing-page .hero-float { animation: none !important; transform: rotateX(6deg) !important; }
        }

        .cinematic-landing-page .skip-link {
            position: absolute;
            top: -100px;
            left: 0;
            background: #5ed9d3;
            color: #003735;
            padding: 1rem;
            z-index: 100;
        }
        .cinematic-landing-page .skip-link:focus {
            top: 0;
        }

        .cinematic-landing-page #starfield {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -5;
        }
      ` }} />

      <a className="skip-link" href="#main-content">Skip to main content</a>
      
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 transition-all duration-500 bg-transparent py-4" id="navbar">
        <div className="flex justify-between items-center h-16 px-6 md:px-12 max-w-[1440px] mx-auto w-full">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <svg fill="none" height="32" viewBox="0 0 40 40" width="32" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 10L20 30L30 10" stroke="#5ed9d3" strokeLinecap="round" strokeWidth="4"></path>
              <circle className="animate-pulse" cx="20" cy="18" fill="#5ed9d3" r="4"></circle>
            </svg>
            <div className="text-2xl font-headline font-semibold tracking-tighter text-[#e1e2e8]">VOCA</div>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a className="nav-underline font-headline text-[var(--fluid-label)] uppercase tracking-wider text-[#5ed9d3] font-medium" href="#product">Product</a>
            <a className="nav-underline font-headline text-[var(--fluid-label)] uppercase tracking-wider text-[#bcc9c8]" href="#results">Intelligence</a>
            <a className="nav-underline font-headline text-[var(--fluid-label)] uppercase tracking-wider text-[#bcc9c8]" href="#how-it-works">About</a>
          </div>
          <div className="flex gap-4 items-center">
            <button 
              aria-label="Sign In" 
              onClick={() => navigate("/auth")}
              className="hidden sm:block text-[#e1e2e8] hover:opacity-80 transition-opacity font-label text-[var(--fluid-label)]"
            >
              Sign In
            </button>
            <button 
              aria-label="Get Started" 
              onClick={() => navigate("/auth")}
              className="bg-[#5ed9d3] text-[#003735] px-6 py-2 rounded-full font-label text-[var(--fluid-label)] font-bold hover:opacity-90 active:scale-95 transition-all shimmer-btn"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main id="main-content">
        {/* Hero Section */}
        <section id="product" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-screen flex flex-col justify-center">
          <canvas id="starfield" ref={canvasRef}></canvas>
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-center relative z-10">
            <div className="opacity-0 translate-y-4 transition-all duration-700 delay-100 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#5ed9d3]/20 bg-[#5ed9d3]/5 mb-8" id="hero-badge">
              <span className="w-2 h-2 rounded-full bg-[#5ed9d3] animate-pulse"></span>
              <span className="text-xs font-label font-semibold uppercase tracking-[0.2em] text-[#5ed9d3]">Intelligence Redefined</span>
            </div>
            
            <h1 className="mb-8 overflow-hidden font-headline text-[#e1e2e8]" id="hero-title">
              <span className="inline-block opacity-0 translate-y-full transition-all duration-700 delay-300 mr-2">Map your direction with</span><br/>
              <span className="inline-block opacity-0 translate-y-full transition-all duration-700 delay-500 text-[#5ed9d3] italic">cinematic precision.</span>
            </h1>
            
            <p className="opacity-0 translate-y-4 transition-all duration-700 delay-700 text-lg md:text-xl text-[#bcc9c8] max-w-2xl mx-auto mb-12 leading-relaxed" id="hero-sub">
              Guided, personalized career clarity for the modern professional. Navigate the future of work with intelligence that sees the whole picture.
            </p>
            
            <div className="opacity-0 translate-y-4 transition-all duration-700 delay-900 flex flex-col sm:flex-row gap-4 justify-center items-center" id="hero-ctas">
              <button 
                aria-label="Get my career map" 
                onClick={() => navigate("/auth")}
                className="group relative px-8 py-4 bg-[#5ed9d3] text-[#003735] rounded-full font-bold overflow-hidden transition-all hover:pr-12 shimmer-btn"
              >
                <span className="relative z-10 mr-1">Get my career map</span>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all text-base">arrow_forward</span>
              </button>
              <button 
                aria-label="Watch the demo" 
                onClick={() => navigate("/auth")}
                className="px-8 py-4 border border-white/10 bg-[#191c20]/50 hover:bg-[#272a2f] rounded-full transition-colors text-[#e1e2e8]"
              >
                Watch the demo
              </button>
            </div>
          </div>

          {/* Hero Dashboard Card */}
          <div 
            className="mt-24 max-w-5xl mx-auto px-6 relative" 
            id="hero-card-container"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div 
              className="glass-card rounded-2xl p-2 md:p-4 hero-float shadow-2xl transition-transform duration-200" 
              id="hero-parallax-card"
              ref={cardRef}
              style={{ transform: "perspective(1000px) rotateX(6deg) translateY(0px)" }}
            >
              <div className="rounded-xl overflow-hidden aspect-video bg-[#0b0e12] relative">
                <img 
                  alt="Career trajectory dashboard visualization" 
                  className="w-full h-full object-cover opacity-60" 
                  loading="eager" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtti-caR0bn6o6Az2MUCgx4OZ9F63LHQFFgQBlUbkhLSGvkND01DhNiqLQMx7rKOKfMol9a3U99VnycLlDDt29HiXmIWk6ysROdIq0GzOTCZLyUT4cv3uSUV8mzoYSNBP5aYYz91Fdr2pqnAvQLpuWJ4vVAs50AAk1m_THbfM-PW0xHm3JTpM6D5ML55TeenofRTsh6XKJpCE0p8MA87aZbWRmTaXda_n2GiyQufhMb7NBWOWVt-ASpFf6vLSMu74WKCZoYdsOtjBT"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e12] via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                  <div className="space-y-2">
                    <div className="h-1.5 w-32 bg-[#5ed9d3]/20 rounded-full overflow-hidden">
                      <div className="h-full bg-[#5ed9d3] w-2/3 animate-pulse"></div>
                    </div>
                    <div className="text-[10px] font-label uppercase tracking-widest text-[#5ed9d3] font-bold">Trajectory Optimization Active</div>
                  </div>
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full border-2 border-[#0b0e12] bg-[#36393e]"></div>
                    <div className="w-10 h-10 rounded-full border-2 border-[#0b0e12] bg-[#5ed9d3]/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#5ed9d3] text-sm">query_stats</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-32 bg-[#0b0e12] relative text-left border-t border-white/10">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12">
            <div className="mb-20">
              <h2 className="font-headline reveal-clip mb-6 text-[#e1e2e8]">The career maze is noisier <br/> than ever.</h2>
              <div className="w-24 h-1 bg-[#5ed9d3]"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Asymmetric Layout: Full Width Callout */}
              <div className="md:col-span-2 glass-card p-12 border-l-4 border-l-[#5ed9d3] relative overflow-hidden group">
                <span className="material-symbols-outlined text-[#5ed9d3] text-[48px] opacity-70 mb-8 block">psychology</span>
                <h3 className="text-3xl font-headline font-semibold mb-6 text-[#e1e2e8]">Analysis Paralysis</h3>
                <p className="text-[#bcc9c8] text-xl leading-relaxed italic border-l border-white/10 pl-8">
                  "Too many options leading to stagnation. VOCA filters the noise to reveal the paths that actually resonate with your core ambition."
                </p>
              </div>
              
              <div className="glass-card p-10 hover:border-[#5ed9d3]/40 transition-all">
                <span className="material-symbols-outlined text-[#5ed9d3] text-[48px] opacity-70 mb-6 block">trending_up</span>
                <h3 className="text-xl font-headline font-semibold mb-4 text-[#e1e2e8]">Skill-Market Gap</h3>
                <p className="text-[#bcc9c8] font-body text-sm leading-relaxed">Traditional advice misses how markets evolve. We bridge the gap with real-time intelligence on what’s emerging next.</p>
              </div>
              
              <div className="glass-card p-10 hover:border-[#5ed9d3]/40 transition-all">
                <span className="material-symbols-outlined text-[#5ed9d3] text-[48px] opacity-70 mb-6 block">auto_awesome</span>
                <h3 className="text-xl font-headline font-semibold mb-4 text-[#e1e2e8]">Generic Advice</h3>
                <p className="text-[#bcc9c8] font-body text-sm leading-relaxed">Generic templates don't build extraordinary careers. VOCA provides a singular strategy designed for your specific trajectory.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-32 relative overflow-hidden border-t border-white/10" id="how-it-works">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12">
            <div className="text-center mb-24">
              <span className="text-xs font-label uppercase tracking-[0.3em] text-[#5ed9d3] mb-4 block">The Methodology</span>
              <h2 className="font-headline font-medium reveal-clip text-[#e1e2e8]">Precision in three movements</h2>
            </div>
            
            <div className="relative min-h-[600px] flex flex-col md:flex-row justify-between items-start pt-12">
              {/* SVG Animated Path */}
              <svg className="absolute top-0 left-0 w-full h-full pointer-events-none hidden md:block" fill="none" viewBox="0 0 1200 600">
                <path d="M100,100 C300,100 300,300 600,300 C900,300 900,500 1100,500" id="timeline-path" stroke="url(#paint0_linear)" strokeDasharray="10 10" strokeLinecap="round" strokeWidth="2"></path>
                <defs>
                  <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear" x1="0" x2="1200" y1="0" y2="600">
                    <stop stopColor="#5ed9d3" stopOpacity="0"></stop>
                    <stop offset="0.5" stopColor="#5ed9d3"></stop>
                    <stop offset="1" stopColor="#5ed9d3" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Staggered Timeline Items */}
              <div className="flex flex-col items-center text-center space-y-6 md:w-1/3 md:-mt-12 group">
                <div className="w-20 h-20 rounded-full glass-card border-2 border-[#5ed9d3] flex items-center justify-center text-2xl font-headline font-bold text-[#5ed9d3] relative z-10 group-hover:scale-110 transition-transform shadow-[0_0_40px_rgba(94,217,211,0.2)]">1</div>
                <h4 className="text-2xl font-headline text-[#e1e2e8]">Conversation</h4>
                <p className="text-[#bcc9c8] text-base max-w-xs px-4 opacity-0 translate-y-4 transition-all duration-700 reveal-item">An AI-driven depth dialogue that extracts your hidden expertise and long-term intentions.</p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-6 md:w-1/3 md:mt-24 group">
                <div className="w-20 h-20 rounded-full glass-card border-2 border-[#5ed9d3] flex items-center justify-center text-2xl font-headline font-bold text-[#5ed9d3] relative z-10 group-hover:scale-110 transition-transform shadow-[0_0_40px_rgba(94,217,211,0.2)]">2</div>
                <h4 className="text-2xl font-headline text-[#e1e2e8]">Adaptive Calibration</h4>
                <p className="text-[#bcc9c8] text-base max-w-xs px-4 opacity-0 translate-y-4 transition-all duration-700 reveal-item">Our intelligence engine cross-references your profile against global market shifts in real-time.</p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-6 md:w-1/3 md:mt-64 group">
                <div className="w-20 h-20 rounded-full glass-card border-2 border-[#5ed9d3] flex items-center justify-center text-2xl font-headline font-bold text-[#5ed9d3] relative z-10 group-hover:scale-110 transition-transform shadow-[0_0_40px_rgba(94,217,211,0.2)]">3</div>
                <h4 className="text-2xl font-headline text-[#e1e2e8]">Intelligence Mapping</h4>
                <p className="text-[#bcc9c8] text-base max-w-xs px-4 opacity-0 translate-y-4 transition-all duration-700 reveal-item">Receive a living career blueprint with specific milestones, skill pivots, and exit strategies.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Marquee */}
        <div className="py-12 bg-[#0b0e12] border-y border-white/10 overflow-hidden">
          <div className="marquee-content gap-16 md:gap-32 items-center">
            <span className="text-xl font-headline font-bold text-white/40 uppercase tracking-[0.4em]">Future of Work</span>
            <span className="text-xl font-headline font-bold text-white/40 uppercase tracking-[0.4em]">Career Design</span>
            <span className="text-xl font-headline font-bold text-white/40 uppercase tracking-[0.4em]">Market Dynamics</span>
            <span className="text-xl font-headline font-bold text-white/40 uppercase tracking-[0.4em]">Global Strategy</span>
            <span className="text-xl font-headline font-bold text-white/40 uppercase tracking-[0.4em]">AI Architecture</span>
            {/* Duplicate for seamless scroll */}
            <span className="text-xl font-headline font-bold text-white/40 uppercase tracking-[0.4em]">Future of Work</span>
            <span className="text-xl font-headline font-bold text-white/40 uppercase tracking-[0.4em]">Career Design</span>
            <span className="text-xl font-headline font-bold text-white/40 uppercase tracking-[0.4em]">Market Dynamics</span>
          </div>
        </div>

        {/* Results Section */}
        <section className="py-32 bg-[#0b0e12] border-b border-white/10" id="results">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-24 relative">
            {/* Left Scrolling Column */}
            <div className="flex-1 space-y-32 text-left">
              <div className="space-y-8">
                <h2 className="font-headline reveal-clip text-[#e1e2e8]">Your future, <br/> quantified.</h2>
                <p className="text-[#bcc9c8] text-xl leading-relaxed max-w-xl opacity-0 translate-y-4 transition-all duration-700 reveal-item">
                  Stop guessing. Every recommendation is backed by a Match Score—a synthesis of your intrinsic skills, potential growth velocity, and market durability.
                </p>
              </div>
              
              <div className="space-y-12">
                <div className="group reveal-item opacity-0 translate-y-4 transition-all duration-700">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="material-symbols-outlined text-[#f1be63] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                    <h3 className="text-2xl font-headline text-[#e1e2e8]">Durability Ranking</h3>
                  </div>
                  <p className="text-[#bcc9c8] leading-relaxed">Assess the long-term survival of your career trajectory against automation and market saturation.</p>
                </div>
                
                <div className="group reveal-item opacity-0 translate-y-4 transition-all duration-700">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="material-symbols-outlined text-[#5ed9d3] text-3xl">hub</span>
                    <h3 className="text-2xl font-headline text-[#e1e2e8]">Skill Adjacency Mapping</h3>
                  </div>
                  <p className="text-[#bcc9c8] leading-relaxed">Visualize exactly how your current toolkit bridges to future high-value domains.</p>
                </div>
              </div>
            </div>
            
            {/* Right Sticky Column */}
            <div className="flex-1">
              <div className="sticky top-32">
                <div className="glass-card rounded-3xl p-10 relative overflow-hidden group hover:border-[#5ed9d3]/40 transition-all duration-500">
                  {/* Conic Progress Ring */}
                  <div className="absolute top-10 right-10 flex flex-col items-center">
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full rotate-[-90deg]">
                        <circle cx="48" cy="48" fill="none" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8"></circle>
                        <circle cx="48" cy="48" fill="none" id="match-score-ring" r="40" stroke="#5ed9d3" strokeDasharray="251.2" strokeDashoffset="251.2" strokeWidth="8" style={{ transition: "stroke-dashoffset 2s cubic-bezier(0.65, 0, 0.35, 1)" }}></circle>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-headline font-bold text-[#5ed9d3]" id="match-score-text">0%</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-label uppercase tracking-widest text-[#bcc9c8] mt-2">Match Score</span>
                  </div>
                  
                  <div className="space-y-10">
                    <div>
                      <span className="text-xs font-label uppercase tracking-[0.2em] text-[#bcc9c8] font-bold">Recommended Pivot</span>
                      <h3 className="text-4xl font-headline font-bold mt-2 text-[#e1e2e8]">Cinematic AI Architect</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs font-label text-[#bcc9c8] uppercase tracking-widest font-bold">
                        <span>Core Alignment</span>
                        <span className="text-[#5ed9d3]">Extreme</span>
                      </div>
                      <div className="h-2 w-full bg-[#323539] rounded-full overflow-hidden">
                        <div className="h-full bg-[#5ed9d3] w-11/12 rounded-full shadow-[0_0_15px_#5ed9d3]"></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-5 bg-[#272a2f]/50 rounded-2xl border border-white/10">
                        <div className="text-[10px] font-label text-[#bcc9c8] uppercase tracking-widest font-bold mb-1">Market Demand</div>
                        <div className="text-2xl font-headline font-bold text-[#f1be63]">Extreme</div>
                      </div>
                      <div className="p-5 bg-[#272a2f]/50 rounded-2xl border border-white/10">
                        <div className="text-[10px] font-label text-[#bcc9c8] uppercase tracking-widest font-bold mb-1">Skill Gap</div>
                        <div className="text-2xl font-headline font-bold text-[#e1e2e8]">Minimal</div>
                      </div>
                    </div>
                    
                    <button 
                      aria-label="Explore Trajectory" 
                      onClick={() => navigate("/auth")}
                      className="w-full py-4 rounded-xl border border-[#5ed9d3]/30 bg-[#5ed9d3]/10 text-[#5ed9d3] text-sm font-bold uppercase tracking-widest hover:bg-[#5ed9d3] transition-all hover:text-[#003735] group flex items-center justify-center gap-2"
                    >
                      Explore Trajectory
                      <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                  </div>
                  
                  {/* Atmosphere light */}
                  <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#5ed9d3]/5 blur-[100px] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Section */}
        <section className="py-32 text-left bg-[#0b0e12]">
          <div className="max-w-4xl mx-auto px-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl glass-card mb-10">
              <span className="material-symbols-outlined text-[#5ed9d3] text-4xl">verified_user</span>
            </div>
            
            <h2 className="font-headline font-medium reveal-clip mb-8 text-[#e1e2e8]">Privacy-first by design.</h2>
            
            <p className="text-[#bcc9c8] text-xl leading-relaxed mb-16 opacity-0 translate-y-4 transition-all duration-700 reveal-item">
              Your career ambition is yours alone. VOCA uses local-first processing for sensitive dialogue data and strictly explainable AI. Every recommendation comes with a "Why" so you’re always in control of the logic behind your map.
            </p>
            
            <div className="flex flex-wrap gap-12 opacity-60">
              <span className="text-xs font-label font-bold tracking-[0.4em] uppercase text-[#e1e2e8]">SOC2 Certified</span>
              <span className="text-xs font-label font-bold tracking-[0.4em] uppercase text-[#e1e2e8]">GDPR Compliant</span>
              <span className="text-xs font-label font-bold tracking-[0.4em] uppercase text-[#e1e2e8]">Explainable AI</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b0e12] pt-20 pb-12 border-t border-white/10 relative overflow-hidden">
        {/* Thin gradient separator */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#5ed9d3]/50 to-transparent"></div>
        <div className="flex flex-col md:flex-row justify-between items-start px-8 md:px-24 gap-12 max-w-[1440px] mx-auto w-full">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <svg fill="none" height="24" viewBox="0 0 40 40" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 10L20 30L30 10" stroke="#5ed9d3" strokeLinecap="round" strokeWidth="4"></path>
                <circle cx="20" cy="18" fill="#5ed9d3" r="4"></circle>
              </svg>
              <div className="text-2xl font-headline font-semibold text-[#e1e2e8]">VOCA</div>
            </div>
            <p className="font-body text-sm text-[#bcc9c8] max-w-xs">Forging the next generation of career intelligence with cinematic precision.</p>
            <p className="font-body text-xs text-[#bcc9c8]/60 mt-4">© 2026 VOCA Cinematic Intelligence. All rights reserved.</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#5ed9d3]">Intelligence</span>
              <a className="text-sm text-[#bcc9c8] hover:text-[#5ed9d3] transition-colors" href="#product">Insights</a>
              <a className="text-sm text-[#bcc9c8] hover:text-[#5ed9d3] transition-colors" href="#how-it-works">Methods</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#5ed9d3]">Company</span>
              <a className="text-sm text-[#bcc9c8] hover:text-[#5ed9d3] transition-colors" href="#how-it-works">About</a>
              <a className="text-sm text-[#bcc9c8] hover:text-[#5ed9d3] transition-colors" href="#how-it-works">Contact</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#5ed9d3]">Legal</span>
              <a className="text-sm text-[#bcc9c8] hover:text-[#5ed9d3] transition-colors" href="#privacy">Privacy</a>
              <a className="text-sm text-[#bcc9c8] hover:text-[#5ed9d3] transition-colors" href="#privacy">Terms</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#5ed9d3]">Social</span>
              <a className="text-sm text-[#bcc9c8] hover:text-[#5ed9d3] transition-colors" target="_blank" rel="noopener noreferrer" href="https://linkedin.com">LinkedIn</a>
              <a className="text-sm text-[#bcc9c8] hover:text-[#5ed9d3] transition-colors" target="_blank" rel="noopener noreferrer" href="https://x.com">X / Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
