import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// FISIO NO MARKETING — LANDING PAGE
// ═══════════════════════════════════════════════════════════════

const runtimeConfig = typeof window !== "undefined" ? (window.__APP_CONFIG__ || {}) : {};
const DEFAULT_WHATSAPP_LINK = "https://chat.whatsapp.com/DnKK9Wzz9uB8QC72QYuBum";
const rawWhatsAppLink = String(
  runtimeConfig.VITE_WHATSAPP_LINK || import.meta.env.VITE_WHATSAPP_LINK || DEFAULT_WHATSAPP_LINK
).trim();
const WHATSAPP_LINK = rawWhatsAppLink.startsWith("http") ? rawWhatsAppLink : DEFAULT_WHATSAPP_LINK;

// ── BRAND COLORS ────────────────────────────────────────────────
const C = {
  navy: "#0A1628",
  navy2: "#0F2240",
  blue: "#0A3D91",
  teal: "#00B4D8",
  cyan: "#48CAE4",
  green: "#06D6A0",
  orange: "#FF6B35",
  pale: "#E8F4FD",
  white: "#FFFFFF",
  gray: "#94A3B8",
  grayDark: "#475569",
};

// ── INLINE SVG COMPONENTS ─────────────────────────────────────
function SymbolMark({ size = 120, className = "" }) {
  const s = size;
  const cx = s / 2, cy = s / 2;
  const headY = cy - s * 0.28;
  const spineTop = cy - s * 0.18;
  const spineBot = cy + s * 0.18;
  const barW = s * 0.045;
  const barGap = s * 0.025;
  const barXStart = cx + s * 0.08;
  const barYBase = cy + s * 0.20;
  const sw = s * 0.035;
  const pulseY = cy + s * 0.005;
  
  return (
    <svg viewBox={`0 0 ${s} ${s}`} width={s} height={s} className={className}>
      <path d={`M ${cx-s*0.32} ${pulseY} L ${cx-s*0.20} ${pulseY} L ${cx-s*0.16} ${pulseY-s*0.06} L ${cx-s*0.13} ${pulseY+s*0.08} L ${cx-s*0.10} ${pulseY-s*0.04} L ${cx-s*0.07} ${pulseY}`} stroke={C.cyan} strokeWidth={sw*0.5} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.55"/>
      <circle cx={cx-s*0.30} cy={cy-s*0.22} r={s*0.012} fill={C.cyan} opacity="0.6"/>
      <circle cx={cx-s*0.36} cy={cy+s*0.08} r={s*0.010} fill={C.cyan} opacity="0.6"/>
      <circle cx={cx+s*0.32} cy={cy-s*0.30} r={s*0.014} fill={C.cyan} opacity="0.6"/>
      <path d={`M ${cx} ${spineBot} L ${cx-s*0.05} ${cy+s*0.32}`} stroke={C.teal} strokeWidth={sw} strokeLinecap="round" fill="none"/>
      <path d={`M ${cx} ${spineBot} L ${cx+s*0.05} ${cy+s*0.32}`} stroke={C.teal} strokeWidth={sw} strokeLinecap="round" fill="none"/>
      <line x1={cx} y1={spineTop} x2={cx} y2={spineBot} stroke={C.teal} strokeWidth={sw} strokeLinecap="round"/>
      <path d={`M ${cx-s*0.005} ${spineTop+s*0.04} Q ${cx-s*0.10} ${cy} ${cx-s*0.13} ${cy+s*0.08}`} stroke={C.teal} strokeWidth={sw} fill="none" strokeLinecap="round"/>
      <path d={`M ${cx-s*0.005} ${spineTop+s*0.04} Q ${cx+s*0.10} ${cy-s*0.05} ${barXStart+4*(barW+barGap)+barW/2} ${barYBase - s*0.245}`} stroke={C.green} strokeWidth={sw} fill="none" strokeLinecap="round"/>
      <circle cx={cx} cy={headY} r={s*0.075} fill={C.teal}/>
      <circle cx={cx} cy={headY} r={s*0.105} fill="none" stroke={C.cyan} strokeWidth={sw*0.4} opacity="0.7"/>
      {[0,1,2,3,4].map(i => {
        const h = s * (0.06 + i * 0.045);
        const x = barXStart + i * (barW + barGap);
        const y = barYBase - h;
        return <rect key={i} x={x} y={y} width={barW} height={h} rx={barW*0.2} fill={i === 4 ? C.green : C.teal} opacity={0.55 + i * 0.11}/>;
      })}
    </svg>
  );
}

function WhatsAppIcon({ size = 24 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="currentColor">
      <path d="M16 2.667c-7.364 0-13.334 5.97-13.334 13.333 0 2.354.62 4.643 1.797 6.667l-1.797 6.666 6.83-1.78c1.945 1.06 4.137 1.62 6.504 1.62 7.364 0 13.333-5.969 13.333-13.333S23.365 2.667 16 2.667zm-.001 24.327c-2.13 0-4.213-.575-6.025-1.66l-.432-.256-4.483 1.17 1.197-4.366-.281-.448a11.144 11.144 0 01-1.708-5.934c0-6.16 5.012-11.171 11.172-11.171 2.984 0 5.789 1.163 7.9 3.273a11.097 11.097 0 013.272 7.898c0 6.16-5.011 11.494-11.612 11.494z"/>
    </svg>
  );
}

// ── SCROLL ANIMATION HOOK ─────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function FadeIn({ children, delay = 0, className = "", direction = "up" }) {
  const [ref, visible] = useInView(0.1);
  const transforms = { up: "translateY(40px)", down: "translateY(-40px)", left: "translateX(40px)", right: "translateX(-40px)", none: "none" };
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : transforms[direction],
      transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

// ── PARTICLE BACKGROUND ──────────────────────────────────────
function ParticleBG() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = canvas.width = canvas.offsetWidth;
    let h = canvas.height = canvas.offsetHeight;
    let particles = [];
    const count = Math.min(60, Math.floor(w * h / 15000));
    for (let i = 0; i < count; i++) {
      particles.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: Math.random() * 2 + 1 });
    }
    let animId;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,180,216,0.35)";
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,180,216,${0.12 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      // ECG line
      const ecgY = h * 0.82;
      ctx.beginPath();
      ctx.moveTo(0, ecgY);
      ctx.lineTo(w * 0.15, ecgY);
      ctx.lineTo(w * 0.17, ecgY - 30);
      ctx.lineTo(w * 0.19, ecgY + 40);
      ctx.lineTo(w * 0.21, ecgY - 15);
      ctx.lineTo(w * 0.23, ecgY);
      ctx.lineTo(w * 0.77, ecgY);
      ctx.lineTo(w * 0.79, ecgY - 30);
      ctx.lineTo(w * 0.81, ecgY + 40);
      ctx.lineTo(w * 0.83, ecgY - 15);
      ctx.lineTo(w * 0.85, ecgY);
      ctx.lineTo(w, ecgY);
      ctx.strokeStyle = "rgba(0,180,216,0.15)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      animId = requestAnimationFrame(draw);
    }
    draw();
    const handleResize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    window.addEventListener("resize", handleResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", handleResize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }} />;
}

// ── CTA BUTTON ──────────────────────────────────────────────
function CTAButton({ large = false, className = "" }) {
  const sizeClasses = large
    ? "w-full max-w-[19rem] justify-center px-5 py-3.5 text-sm sm:w-auto sm:max-w-none sm:px-8 sm:py-4 sm:text-base md:px-10 md:py-5 md:text-lg"
    : "justify-center px-5 py-3 text-sm sm:px-8 sm:py-4 sm:text-base";

  return (
    <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
      className={`inline-flex min-h-[48px] items-center gap-2 rounded-full text-center font-bold leading-tight transition-all duration-300 hover:scale-105 active:scale-[0.98] sm:gap-3 ${sizeClasses} ${className}`}
      style={{
        background: `linear-gradient(135deg, ${C.teal}, ${C.green})`,
        color: C.white,
        boxShadow: `0 0 30px rgba(0,180,216,0.35), 0 8px 32px rgba(0,0,0,0.3)`,
        animation: "pulse-glow 2.5s ease-in-out infinite",
      }}>
      <WhatsAppIcon size={large ? 24 : 20} />
      <span>ENTRAR NA COMUNIDADE</span>
      <span className="hidden sm:inline" style={{ fontSize: large ? 24 : 20 }}>→</span>
    </a>
  );
}

// ── SECTION COMPONENTS ──────────────────────────────────────

function SectionHeader({ label, title, titleAccent, subtitle }) {
  return (
    <FadeIn>
      {label && <p className="text-sm font-mono font-bold tracking-widest mb-3" style={{ color: C.teal, letterSpacing: "0.2em" }}>— {label}</p>}
      <h2 className="text-3xl md:text-5xl font-black mb-2" style={{ fontFamily: "'Big Shoulders Display', sans-serif", color: C.white, lineHeight: 1.05 }}>
        {title}
        {titleAccent && <span style={{ color: C.teal, display: "block" }}>{titleAccent}</span>}
      </h2>
      {subtitle && <p className="text-lg mt-4 max-w-2xl" style={{ color: C.gray, lineHeight: 1.6 }}>{subtitle}</p>}
    </FadeIn>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════
export default function FisioLandingPage() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const modules1 = [
    ["🎯", "Avaliação Estratégica", "Avalie seu negócio e defina sua estratégia de ação"],
    ["🧭", "Waze do Marketing", "Sua bússola de tarefas propositivas de marketing"],
    ["✅", "Gestão de Tarefas", "Organize seu dia e da sua equipe com eficiência"],
    ["🤖", "Ecossistema de IAs", "Dezenas de IAs: copies, e-books, roteiros e mais"],
    ["💼", "CRM de Vendas", "Seu funil de vendas funcionando 24h"],
    ["📊", "ERP / Gestão", "Controle do caixa integrado ao marketing"],
    ["📅", "Agendamentos", "Calendário integrado com agentes de IA"],
  ];
  const modules2 = [
    ["🎯", "Hunter B2B", "Encontre empresários que precisam de fisio"],
    ["🎨", "Centro de Produção", "Crie e agende artes e conteúdos automaticamente"],
    ["📧", "Newsletter", "Conteúdo certo, na hora certa, automatizado"],
    ["💬", "Central de Atendimento", "E-mail e WhatsApp em uma única tela"],
    ["📱", "Agente WhatsApp IA", "Sua secretária digital que vende e agenda"],
    ["📋", "Prontuários", "Gerencie e evolua pacientes com IA integrada"],
    ["🚀", "Tráfego Pago", "Meta Ads na palma da mão com IA"],
  ];

  const faqs = [
    ["Preciso pagar alguma coisa para entrar?", "Não. A entrada no grupo de WhatsApp é 100% gratuita. E como bônus de lançamento, você ganha 30 dias de acesso completo à plataforma AD AI Studio sem pagar nada."],
    ["O que acontece depois dos 30 dias?", "Você recebe uma oportunidade exclusiva de lançamento com condições especiais para continuar usando a plataforma. Sem surpresas, sem cobrança automática."],
    ["Eu não entendo nada de marketing, vou conseguir?", "A plataforma foi feita exatamente para isso. A IA te guia passo a passo — desde a avaliação estratégica até a execução. Você não precisa virar marketeiro."],
    ["Serve para clínica grande ou só para fisio sozinho?", "Para ambos. A maioria dos membros são profissionais autônomos ou com clínica pequena, mas o sistema também funciona perfeitamente para clínicas maiores."],
    ["As aulas ao vivo ficam gravadas?", "Sim. Todas as aulas e rodas de discussão ficam disponíveis para os membros da comunidade."],
    ["Posso cancelar quando quiser?", "Sim. Sem multa, sem burocracia. Você sai do grupo e cancela o acesso quando quiser."],
  ];

  const [openFaq, setOpenFaq] = useState(-1);

  return (
    <div style={{ background: C.navy, color: C.white, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        /* Fonts loaded via index.html for better performance */
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0,180,216,0.3), 0 8px 32px rgba(0,0,0,0.3); }
          50% { box-shadow: 0 0 40px rgba(0,180,216,0.55), 0 8px 32px rgba(0,0,0,0.3); }
        }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes draw-line { from { stroke-dashoffset: 600; } to { stroke-dashoffset: 0; } }
        @keyframes border-glow { 0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; } }
        * { scroll-behavior: smooth; }
        ::selection { background: rgba(0,180,216,0.3); color: white; }
      `}</style>

      {/* ═══ HEADER ═══ */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 md:px-6 md:py-4" style={{ background: scrollY > 50 ? "rgba(10,22,40,0.95)" : "transparent", backdropFilter: scrollY > 50 ? "blur(12px)" : "none", borderBottom: scrollY > 50 ? `1px solid rgba(0,180,216,0.1)` : "none", transition: "all 0.3s ease" }}>
        <div className="flex items-center gap-3">
          <SymbolMark size={36} />
          <span className="font-bold text-sm tracking-wide" style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontSize: 17, color: C.white }}>FISIO NO MARKETING</span>
        </div>
        <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all hover:scale-105" style={{ border: `1px solid ${C.teal}`, color: C.teal }}>
          <WhatsAppIcon size={16} /> Entrar na comunidade
        </a>
      </header>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20 md:px-6">
        <ParticleBG />
        <div className="relative z-10 mx-auto max-w-4xl pt-12 text-center md:pt-20">
          <FadeIn delay={0.1}>
            <div className="inline-flex max-w-full items-center gap-2 rounded-full px-3 py-2 text-[10px] font-mono font-bold tracking-wider sm:px-4 sm:text-xs sm:tracking-widest mb-6 md:mb-8" style={{ background: "rgba(6,214,160,0.12)", border: `1px solid rgba(6,214,160,0.3)`, color: C.green }}>
              <span className="w-2 h-2 rounded-full" style={{ background: C.green, animation: "pulse-glow 2s infinite" }} />
              OFERTA DE LANÇAMENTO · 30 DIAS GRÁTIS
            </div>
          </FadeIn>
          <FadeIn delay={0.3}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-5 md:mb-6" style={{ fontFamily: "'Big Shoulders Display', sans-serif", lineHeight: 0.98, letterSpacing: "1px" }}>
              Fisioterapeutas que vendem, <span style={{ color: C.teal }}>crescem.</span>
              <br/>
              <span style={{ color: C.gray, fontSize: "0.65em" }}>Os que não vendem, somem.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.5}>
            <p className="mx-auto mb-8 max-w-2xl text-base md:text-xl md:mb-10" style={{ color: C.gray, lineHeight: 1.6 }}>
              Entre na comunidade que está transformando fisioterapeutas em empresários com inteligência artificial.
            </p>
          </FadeIn>
          <FadeIn delay={0.7}>
            <CTAButton large />
            <p className="mx-auto mt-4 max-w-xs text-xs leading-relaxed sm:max-w-none sm:text-sm font-mono" style={{ color: C.grayDark, letterSpacing: "0.05em" }}>
              ✓ Sem cartão &nbsp;&nbsp; ✓ 30 dias grátis na plataforma &nbsp;&nbsp; ✓ Saia quando quiser
            </p>
          </FadeIn>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" style={{ color: C.teal, opacity: 0.5 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
        </div>
      </section>

      {/* ═══ A LINHA MÁGICA (storytelling) ═══ */}
      <section className="relative px-4 py-16 md:px-6 md:py-24">
        <div className="max-w-4xl mx-auto">
          <SectionHeader label="A LINHA MÁGICA" title="Três verdades." titleAccent="Uma evolução." />
          <div className="relative mt-14 md:mt-20">
            {/* Vertical connecting line */}
            <div className="absolute left-8 md:left-12 top-0 bottom-0 w-px" style={{ background: `linear-gradient(to bottom, ${C.blue}, ${C.teal}, ${C.green})`, opacity: 0.4 }} />
            
            {[
              { num: "01", icon: "🤲", label: "A PROFISSÃO", color: C.blue, title: "Você escolheu uma das profissões mais nobres da saúde.", text: "Você dedicou anos para entender o corpo humano. Você devolve movimento, alivia dor, restaura vidas. Sua arte tem propósito. E sempre terá." },
              { num: "02", icon: "📈", label: "A REALIDADE", color: C.teal, title: "Mas a faculdade não te ensinou a ser empresário.", text: "Hoje, ser excelente no que faz não basta. Sem marketing, sua agenda fica vazia. Sem vendas, seu talento não chega a quem precisa. Sem gestão, seu negócio não cresce." },
              { num: "03", icon: "🤖", label: "O SALTO", color: C.green, title: "E a inteligência artificial mudou tudo.", text: "A IA é a maior virada da nossa geração. Quem aprender agora, lidera a próxima década. A pergunta não é mais SE você vai usar. É QUANDO você vai começar." },
            ].map((card, i) => (
              <FadeIn key={i} delay={i * 0.15} className="relative pl-20 md:pl-28 mb-16 last:mb-0">
                <div className="absolute left-5 md:left-9 top-4 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: card.color, boxShadow: `0 0 20px ${card.color}44` }}>
                  <span className="text-xs font-bold">{card.num}</span>
                </div>
                <p className="text-xs font-mono font-bold tracking-widest mb-2" style={{ color: card.color }}>{card.label}</p>
                <h3 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "'Big Shoulders Display', sans-serif", color: C.white }}>{card.title}</h3>
                <p className="text-base leading-relaxed" style={{ color: C.gray }}>{card.text}</p>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3} className="mt-16 text-center">
            <p className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}>
              Sua mão cura corpos. <span style={{ color: C.teal }}>Nossa IA cuida do resto.</span>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══ PARA QUEM É ═══ */}
      <section className="px-4 py-16 md:px-6 md:py-24" style={{ background: C.navy2 }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeader label="PARA QUEM É" title="Você se" titleAccent="reconhece aqui?" />
          <div className="grid gap-5 md:grid-cols-3 md:gap-6 mt-12 md:mt-16">
            {[
              { emoji: "🎓", title: "RECÉM-FORMADO?", text: "Você tem o conhecimento clínico, mas o telefone não toca. Posta nas redes, mas ninguém marca consulta. Você precisa de um caminho — e nós temos o mapa." },
              { emoji: "⏰", title: "SEM TEMPO PRA NADA?", text: "Atende o dia inteiro e ainda precisa responder mensagens, cobrar, postar conteúdo, agendar... Nossa IA faz isso por você. 24 horas por dia." },
              { emoji: "🚀", title: "QUER ESCALAR?", text: "Já tem clínica, equipe, faturamento. Mas sente que poderia crescer 3x mais rápido. Tecnologia + estratégia + comunidade = escala real." },
            ].map((card, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="h-full rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 md:p-8" style={{ background: "rgba(0,180,216,0.04)", border: "1px solid rgba(0,180,216,0.1)" }}>
                  <span className="text-4xl mb-4 block">{card.emoji}</span>
                  <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "'Big Shoulders Display', sans-serif", color: C.teal }}>{card.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.gray }}>{card.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ OFERTA DE LANÇAMENTO ═══ */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 md:p-14" style={{ background: `linear-gradient(135deg, ${C.navy2}, #162a4a)`, border: `2px solid rgba(0,180,216,0.25)` }}>
              <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: `inset 0 0 60px rgba(0,180,216,0.08)` }} />
              <div className="relative z-10">
                <p className="text-[11px] font-mono font-bold tracking-wider mb-5 md:text-xs md:tracking-widest md:mb-6" style={{ color: C.orange }}>🚀 OFERTA EXCLUSIVA DE LANÇAMENTO</p>
                <h2 className="text-3xl md:text-5xl font-black mb-2" style={{ fontFamily: "'Big Shoulders Display', sans-serif", lineHeight: 1.05 }}>
                  ENTRE GRÁTIS.
                </h2>
                <h2 className="text-3xl md:text-5xl font-black mb-2" style={{ fontFamily: "'Big Shoulders Display', sans-serif", lineHeight: 1.05, color: C.teal }}>
                  USE 30 DIAS.
                </h2>
                <h2 className="text-3xl md:text-5xl font-black mb-6 md:mb-8" style={{ fontFamily: "'Big Shoulders Display', sans-serif", lineHeight: 1.05 }}>
                  SEM PAGAR NADA.
                </h2>
                <div className="mb-8 space-y-3 md:mb-10">
                  {[
                    "Acesso ao grupo de WhatsApp da comunidade",
                    "Aula semanal ao vivo com Vinicius Aguirre",
                    "Network com outros fisioterapeutas",
                    ["30 DIAS gratuitos no AD AI Studio", true],
                    "Acesso à oportunidade de lançamento ao final",
                  ].map((item, i) => {
                    const isHighlight = Array.isArray(item);
                    const text = isHighlight ? item[0] : item;
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <span className="mt-1 text-sm" style={{ color: C.green }}>✓</span>
                        <span className={`text-base ${isHighlight ? "font-bold" : ""}`} style={{ color: isHighlight ? C.green : C.gray }}>
                          {text}
                          {isHighlight && <span className="mt-2 inline-flex rounded-full px-2 py-0.5 text-xs font-mono sm:ml-2 sm:mt-0" style={{ background: "rgba(6,214,160,0.15)", color: C.green }}>14 módulos de IA</span>}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <CTAButton large />
                <p className="mt-5 text-xs font-mono" style={{ color: C.grayDark }}>Sem cartão · Sem compromisso · Cancele quando quiser</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ PLATAFORMA AD AI STUDIO ═══ */}
      <section className="px-4 py-16 md:px-6 md:py-24" style={{ background: C.navy2 }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeader label="A PLATAFORMA" title="AD AI Studio" titleAccent="14 módulos de IA." subtitle="Tudo o que um fisioterapeuta precisa para atrair, vender e crescer — sem precisar virar marketeiro." />
          <div className="grid gap-8 md:grid-cols-2 md:gap-12 mt-12 md:mt-16">
            {[
              { title: "Estratégia & Gestão", modules: modules1, accent: C.teal },
              { title: "Produção & Crescimento", modules: modules2, accent: C.green },
            ].map((group, gi) => (
              <div key={gi}>
                <h3 className="text-lg font-bold font-mono mb-6" style={{ color: group.accent, letterSpacing: "0.1em" }}>— {group.title}</h3>
                <div className="space-y-3">
                  {group.modules.map(([emoji, name, desc], i) => (
                    <FadeIn key={i} delay={i * 0.05 + gi * 0.2}>
                      <div className="flex items-start gap-4 p-4 rounded-lg transition-all duration-300 hover:bg-white/5" style={{ borderLeft: `2px solid ${group.accent}22` }}>
                        <span className="text-xl mt-0.5">{emoji}</span>
                        <div>
                          <p className="font-bold text-sm" style={{ color: C.white }}>{name}</p>
                          <p className="text-xs mt-0.5" style={{ color: C.gray }}>{desc}</p>
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SOBRE VINICIUS ═══ */}
      <section className="px-4 py-16 md:px-6 md:py-24">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="items-start gap-12 md:flex">
              <div className="mb-8 flex flex-shrink-0 justify-center md:mb-0">
                <div className="h-44 w-44 overflow-hidden rounded-2xl sm:h-48 sm:w-48" style={{ border: `1px solid rgba(0,180,216,0.25)`, boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}>
                  <img
                    src="/vinicius-aguirre.png"
                    alt="Foto de Vinicius Aguirre"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-center md:text-left">
                <p className="text-xs font-mono font-bold tracking-widest mb-3" style={{ color: C.teal }}>QUEM ESTÁ POR TRÁS</p>
                <h2 className="text-3xl font-black mb-2 sm:text-4xl" style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}>VINICIUS AGUIRRE</h2>
                <p className="text-sm font-mono mb-6" style={{ color: C.gray }}>Fundador & Estrategista</p>
                <p className="text-base leading-relaxed mb-6" style={{ color: C.gray }}>
                  Fisioterapeuta que entendeu cedo que o conhecimento clínico precisa caminhar lado a lado com gestão e tecnologia.
                </p>
                <div className="space-y-2 mb-8">
                  {["Graduação em Fisioterapia", "MBA em Marketing Digital", "Pós-Graduação em Economia", "Pós-Graduação em Ciência de Dados e Big Data Analytics"].map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-left text-sm">
                      <span style={{ color: C.teal }}>●</span>
                      <span style={{ color: C.gray }}>{f}</span>
                    </div>
                  ))}
                </div>
                <p className="text-lg font-bold italic sm:text-xl" style={{ fontFamily: "'Big Shoulders Display', sans-serif", color: C.cyan }}>
                  "Fala como fisio. Pensa como dado. Executa como estrategista."
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ COMO FUNCIONA ═══ */}
      <section className="px-4 py-16 md:px-6 md:py-24" style={{ background: C.navy2 }}>
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeader label="COMO FUNCIONA" title="3 passos." titleAccent="30 segundos." />
          <div className="grid gap-8 md:grid-cols-3 mt-12 md:mt-16">
            {[
              { num: "01", title: "Clique e entre", desc: "Entre no grupo gratuito de WhatsApp em menos de 30 segundos.", color: C.teal },
              { num: "02", title: "Receba acesso", desc: "Você recebe o link da plataforma e o convite da primeira aula ao vivo.", color: C.cyan },
              { num: "03", title: "Use 30 dias grátis", desc: "Acesso completo + oportunidade exclusiva de lançamento ao final.", color: C.green },
            ].map((step, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-black font-mono" style={{ border: `2px solid ${step.color}`, color: step.color }}>{step.num}</div>
                  <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Big Shoulders Display', sans-serif" }}>{step.title}</h3>
                  <p className="text-sm" style={{ color: C.gray }}>{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ GARANTIAS ═══ */}
      <section className="px-4 py-12 md:px-6 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {[
              ["🔒", "Sem cartão de crédito"],
              ["🚫", "Sem cobrança automática"],
              ["⏱", "Saia quando quiser"],
              ["👥", "Comunidade ativa"],
            ].map(([emoji, text], i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="rounded-lg p-3 text-center sm:p-4" style={{ background: "rgba(0,180,216,0.04)", border: "1px solid rgba(0,180,216,0.08)" }}>
                  <span className="text-2xl block mb-2">{emoji}</span>
                  <p className="text-xs font-bold" style={{ color: C.gray }}>{text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="px-4 py-16 md:px-6 md:py-24" style={{ background: C.navy2 }}>
        <div className="max-w-3xl mx-auto">
          <SectionHeader label="PERGUNTAS FREQUENTES" title="Tudo que você" titleAccent="precisa saber." />
          <div className="mt-12 space-y-3">
            {faqs.map(([q, a], i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="rounded-lg overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,180,216,0.08)" }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer">
                    <span className="font-bold text-sm" style={{ color: C.white }}>{q}</span>
                    <span className="text-lg flex-shrink-0 transition-transform" style={{ color: C.teal, transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5">
                      <p className="text-sm leading-relaxed" style={{ color: C.gray }}>{a}</p>
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section className="relative overflow-hidden px-4 py-20 text-center md:px-6 md:py-32">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, rgba(0,180,216,0.08) 0%, transparent 70%)` }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <FadeIn>
            <SymbolMark size={80} className="mx-auto mb-8" />
            <h2 className="text-3xl md:text-6xl font-black mb-6" style={{ fontFamily: "'Big Shoulders Display', sans-serif", lineHeight: 1.05 }}>
              Sua próxima década na fisioterapia
              <span style={{ color: C.teal, display: "block" }}>começa em um clique.</span>
            </h2>
            <CTAButton large className="mx-auto" />
            <p className="mt-8 text-sm font-mono" style={{ color: C.grayDark }}>A próxima vaga é a sua.</p>
          </FadeIn>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="px-4 py-8 md:px-6 md:py-10" style={{ borderTop: `1px solid rgba(0,180,216,0.1)` }}>
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 md:flex-row md:gap-4">
          <div className="flex items-center gap-3">
            <SymbolMark size={28} />
            <span className="text-sm font-bold" style={{ fontFamily: "'Big Shoulders Display', sans-serif", color: C.white }}>FISIO NO MARKETING</span>
          </div>
          <p className="whitespace-nowrap text-center text-[9px] leading-relaxed sm:text-xs md:text-right font-mono" style={{ color: C.grayDark }}>© 2026 Vinicius Aguirre · Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
}
