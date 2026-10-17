"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Building2,
  ChartNoAxesCombined,
  ChevronRight,
  Compass,
  Layers3,
  Menu,
  Minus,
  Plus,
  ShieldCheck,
  Smartphone,
  X,
  type LucideIcon,
} from "lucide-react";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";
import { usePerformanceTier } from "./use-performance-tier";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HeroOrbit = dynamic(() => import("./hero-orbit"), {
  ssr: false,
  loading: () => <div className="orbit-loader" aria-hidden="true" />,
});

const OPEN_ACCOUNT = "https://cadastro.xpi.com.br/v3/cadastro/nome";

type Product = {
  name: string;
  title: string;
  copy: string;
  href: string;
  icon: LucideIcon;
};

const products: Product[] = [
  {
    name: "Investimentos",
    title: "Escolhas para diferentes estratégias.",
    copy: "Acesse as categorias de investimentos disponíveis na plataforma XP.",
    href: "https://www.xpi.com.br/produtos/",
    icon: ChartNoAxesCombined,
  },
  {
    name: "Aplicativo XP",
    title: "Sua vida financeira em um só lugar.",
    copy: "Uma experiência integrada para acompanhar produtos e serviços XP.",
    href: "https://www.xpi.com.br/app/",
    icon: Smartphone,
  },
  {
    name: "Wealth Planning",
    title: "Decisões com visão de longo prazo.",
    copy: "Estratégias patrimoniais conectadas a objetivos e diferentes horizontes.",
    href: "https://www.xpi.com.br/wealth-planning/",
    icon: Layers3,
  },
  {
    name: "XP Empresas",
    title: "Soluções para o movimento dos negócios.",
    copy: "Um ecossistema financeiro dedicado a diferentes desafios empresariais.",
    href: "https://www.xpempresas.com.br/",
    icon: Building2,
  },
  {
    name: "Simuladores",
    title: "Transforme intenção em direção.",
    copy: "Explore cenários educativos sem promessa de rentabilidade.",
    href: "https://www.xpi.com.br/simulador-de-investimento/",
    icon: Compass,
  },
  {
    name: "Conteúdo",
    title: "Informação para apoiar decisões.",
    copy: "Análises, notícias e conteúdos para acompanhar o mercado.",
    href: "https://conteudos.xpi.com.br/",
    icon: BookOpen,
  },
];

const faqs = [
  {
    question: "Onde encontro todos os investimentos disponíveis?",
    answer:
      "A página oficial de produtos reúne as categorias de investimentos e serviços disponíveis na XP.",
  },
  {
    question: "Como acesso o simulador de investimentos?",
    answer:
      "Use o atalho desta experiência para abrir o simulador oficial da XP em uma nova etapa da sua jornada.",
  },
  {
    question: "Onde posso tirar dúvidas sobre minha conta?",
    answer:
      "A Central de Atendimento XP concentra orientações, canais de contato e temas de suporte.",
  },
  {
    question: "Este site faz recomendação de investimento?",
    answer:
      "Não. Esta experiência é institucional e informativa. Ela não considera objetivos, situação financeira ou necessidades individuais.",
  },
];

const tiers = ["Digital", "Exclusive", "Signature", "Unique"];

function ButtonRoll({
  href,
  children,
  secondary = false,
  cursor = "ABRIR",
}: {
  href: string;
  children: string;
  secondary?: boolean;
  cursor?: string;
}) {
  return (
    <a
      href={href}
      className={`button-roll${secondary ? " button-roll-secondary" : ""}`}
      data-cursor={cursor}
      data-magnetic
    >
      <span className="button-roll-label" aria-hidden="true">
        <span>{children}</span>
        <span>{children}</span>
      </span>
      <span className="sr-only">{children}</span>
      <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.7} />
    </a>
  );
}

function Preloader({ finished }: { finished: boolean }) {
  if (finished) return null;
  return (
    <div className="preloader" aria-hidden="true">
      <div className="preloader-core">
        <span className="preloader-dot" />
        <span className="preloader-line" />
        <span className="preloader-ring" />
      </div>
    </div>
  );
}

function Header({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}) {
  return (
    <>
      <header className="site-header">
        <a className="brand-name" href="#inicio" aria-label="XP, início">
          XP
        </a>
        <nav className="desktop-nav" aria-label="Navegação principal">
          <a href="#universo">Ecossistema</a>
          <a href="#produtos">Soluções</a>
          <a href="#wealth">Wealth Planning</a>
          <a href="#empresas">Empresas</a>
          <a href="#atendimento">Atendimento</a>
        </nav>
        <div className="header-actions">
          <a className="account-link" href="https://portal.xpi.com.br/">
            Acessar conta
          </a>
          <a className="header-cta" href={OPEN_ACCOUNT} data-cursor="ABRIR">
            Abra sua conta
          </a>
          <button
            className="menu-button"
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </header>
      <div
        id="mobile-menu"
        className={`mobile-menu${menuOpen ? " is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Navegação mobile">
          {[
            ["Ecossistema", "#universo"],
            ["Soluções", "#produtos"],
            ["Wealth Planning", "#wealth"],
            ["Empresas", "#empresas"],
            ["Atendimento", "#atendimento"],
          ].map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              {label}
              <ArrowDownRight aria-hidden="true" />
            </a>
          ))}
        </nav>
        <a className="mobile-menu-cta" href={OPEN_ACCOUNT}>
          Abra sua conta <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </>
  );
}

function Universe() {
  const [active, setActive] = useState(0);
  const items = [
    ["Investimentos", "Diversas categorias reunidas em uma única plataforma."],
    ["Planejamento", "Estratégia patrimonial conectada a diferentes momentos."],
    ["Empresas", "Soluções financeiras para necessidades empresariais."],
    ["Conteúdo", "Informação e análise para acompanhar o mercado."],
  ];

  return (
    <section className="universe section-shell" id="universo">
      <div className="section-heading reveal">
        <p className="eyebrow">Universo XP</p>
        <h2>Muito além de investir.</h2>
        <p>
          Produtos, tecnologia, planejamento e especialistas reunidos para
          diferentes decisões financeiras.
        </p>
      </div>
      <div className="universe-grid">
        {items.map(([name, copy], index) => (
          <button
            key={name}
            type="button"
            className={`glass-card reveal${active === index ? " is-active" : ""}`}
            onPointerEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            onClick={() => setActive(index)}
            aria-pressed={active === index}
            data-cursor="EXPLORE"
          >
            <span className="glass-index">0{index + 1}</span>
            <span className="glass-title">{name}</span>
            <span className="glass-copy">{copy}</span>
            <ChevronRight aria-hidden="true" />
          </button>
        ))}
        <span className="universe-orb" style={{ "--active": active } as React.CSSProperties} />
      </div>
    </section>
  );
}

function Products() {
  return (
    <section className="products" id="produtos" aria-labelledby="products-title">
      <div className="products-intro section-shell">
        <h2 id="products-title">Um ecossistema.<br />Múltiplas direções.</h2>
      </div>
      <div className="products-track">
        {products.map((product, index) => {
          const Icon = product.icon;
          return (
            <article className="product-panel" key={product.name}>
              <div className="product-topline">
                <span>{String(index + 1).padStart(2, "0")} / 06</span>
                <Icon aria-hidden="true" size={28} strokeWidth={1.4} />
              </div>
              <div className="product-body">
                <p>{product.name}</p>
                <h3>{product.title}</h3>
                <div>
                  <p>{product.copy}</p>
                  <a href={product.href} data-cursor="VIEW">
                    Conheça <ArrowUpRight aria-hidden="true" />
                  </a>
                </div>
              </div>
              <div className="product-orbit" aria-hidden="true">
                <span />
              </div>
            </article>
          );
        })}
      </div>
      <div className="product-progress" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}

function ReportSection() {
  return (
    <section className="report section-shell" id="conteudo">
      <div className="report-copy reveal">
        <p className="eyebrow">Conhecimento em movimento</p>
        <h2>Informação também move capital.</h2>
        <p>
          Acompanhe análises e conteúdos para compreender cenários com mais contexto.
        </p>
        <a href="https://conteudos.xpi.com.br/" data-cursor="VIEW">
          Acessar conteúdos XP <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
      <figure className="report-art">
        <Image
          src="/images/capital-layers.png"
          alt="Escultura abstrata de camadas escuras atravessadas por uma fita amarela"
          fill
          sizes="(max-width: 767px) 92vw, 46vw"
        />
        <figcaption>
          Visual conceitual. Substituir pela capa oficial do relatório quando disponível.
        </figcaption>
      </figure>
    </section>
  );
}

function AppSection() {
  return (
    <section className="app-section section-shell" id="app">
      <div className="phone-stage reveal" aria-label="Espaço reservado para captura oficial do Aplicativo XP">
        <div className="phone-glass" aria-hidden="true" />
        <div className="phone-frame">
          <span className="phone-camera" aria-hidden="true" />
          <div className="phone-placeholder">
            <Smartphone aria-hidden="true" />
            <span>SCREENSHOT OFICIAL DO APP</span>
            <small>Asset pendente</small>
          </div>
        </div>
        <span className="phone-flow" aria-hidden="true" />
      </div>
      <div className="app-copy reveal">
        <p>Aplicativo XP</p>
        <h2>Sua vida financeira em um só lugar.</h2>
        <p>
          Simples, fácil de usar e eficiente. A experiência XP na sua melhor versão.
        </p>
        <ButtonRoll href="https://www.xpi.com.br/app/" cursor="VIEW">
          Conheça o app
        </ButtonRoll>
      </div>
    </section>
  );
}

function WealthSection() {
  return (
    <section className="wealth section-shell" id="wealth">
      <div className="wealth-copy reveal">
        <h2>Patrimônio é mais do que um número.</h2>
        <p>
          Estratégia financeira considera objetivos, tempo e diferentes momentos da vida.
        </p>
        <a href="https://www.xpi.com.br/wealth-planning/" data-cursor="VIEW">
          Conheça Wealth Planning <ArrowRight aria-hidden="true" />
        </a>
      </div>
      <div className="wealth-visual reveal">
        <Image
          src="/images/capital-layers.png"
          alt="Camadas patrimoniais abstratas em vidro, metal e amarelo"
          fill
          sizes="(max-width: 767px) 92vw, 50vw"
        />
        <div className="wealth-rings" aria-hidden="true">
          {['Hoje', 'Objetivos', 'Patrimônio', 'Futuro'].map((label, index) => (
            <span key={label} className={`wealth-ring wealth-ring-${index + 1}`}>
              <i>{label}</i>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function CompaniesSection() {
  return (
    <section className="companies" id="empresas">
      <Image
        className="companies-image"
        src="/images/business-network.png"
        alt="Rede abstrata de conexões metálicas com pontos de energia amarela"
        fill
        sizes="100vw"
      />
      <div className="companies-scrim" aria-hidden="true" />
      <div className="companies-content section-shell reveal">
        <p>XP Empresas</p>
        <h2>Capital também move empresas.</h2>
        <p>
          Soluções para apoiar diferentes necessidades financeiras dos negócios.
        </p>
        <ButtonRoll href="https://www.xpempresas.com.br/" cursor="VIEW">
          Conheça XP Empresas
        </ButtonRoll>
      </div>
    </section>
  );
}

function SimulatorSection() {
  return (
    <section className="simulator section-shell" id="simulador">
      <div className="simulator-copy reveal">
        <p className="eyebrow">Trajetória</p>
        <h2>Todo objetivo começa com uma direção.</h2>
        <p>
          Explore uma ferramenta educativa para visualizar cenários. Sem promessa de retorno.
        </p>
        <ButtonRoll
          href="https://www.xpi.com.br/simulador-de-investimento/"
          cursor="SIMULAR"
        >
          Acessar simulador
        </ButtonRoll>
      </div>
      <div className="trajectory" aria-hidden="true">
        <svg viewBox="0 0 800 500" role="presentation">
          <path className="trajectory-shadow" d="M44 448 C 210 420, 154 250, 356 274 S 540 96, 760 46" />
          <path className="trajectory-line" d="M44 448 C 210 420, 154 250, 356 274 S 540 96, 760 46" />
          <circle cx="44" cy="448" r="8" />
          <circle cx="760" cy="46" r="8" />
        </svg>
        <span>presente</span>
        <span>direção</span>
      </div>
    </section>
  );
}

function TiersSection() {
  return (
    <section className="tiers section-shell" id="atendimento">
      <div className="tiers-heading reveal">
        <h2>Sua experiência evolui com você.</h2>
        <p>
          Conheça os níveis de relacionamento indicados no material de referência.
          Elegibilidade e condições devem ser confirmadas nos canais oficiais.
        </p>
      </div>
      <div className="tier-stack">
        {tiers.map((tier, index) => (
          <article className="tier-card" key={tier}>
            <div className="tier-light" aria-hidden="true" />
            <div className="tier-meta">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <ShieldCheck aria-hidden="true" strokeWidth={1.3} />
            </div>
            <div>
              <p>Nível de relacionamento</p>
              <h3>{tier}</h3>
            </div>
            <a href="https://www.xpi.com.br/poder-de-escolha/" data-cursor="VIEW">
              Ver modelos de atendimento <ArrowUpRight aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function Manifesto() {
  const words = [
    "O mercado muda.",
    "Seus objetivos também.",
    "Sua estratégia precisa acompanhar.",
  ];
  return (
    <section className="manifesto" aria-label="Manifesto Capital em Movimento">
      <div className="manifesto-inner section-shell">
        {words.map((line, index) => (
          <p className={`manifesto-line manifesto-line-${index + 1}`} key={line}>
            {line.split(" ").map((word) => (
              <span className="manifesto-word" key={`${line}-${word}`}>{word} </span>
            ))}
          </p>
        ))}
        <span className="manifesto-orb" aria-hidden="true" />
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="faq section-shell" id="faq">
      <div className="faq-heading reveal">
        <h2>Dúvidas frequentes.</h2>
        <p>Informação clara também faz parte da experiência.</p>
      </div>
      <div className="faq-list">
        {faqs.map((item, index) => {
          const isOpen = open === index;
          return (
            <div className={`faq-item${isOpen ? " is-open" : ""}`} key={item.question}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
                onClick={() => setOpen(isOpen ? -1 : index)}
              >
                <span>{item.question}</span>
                {isOpen ? <Minus aria-hidden="true" /> : <Plus aria-hidden="true" />}
              </button>
              <div id={`faq-answer-${index}`} className="faq-answer" aria-hidden={!isOpen}>
                <p>{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="final-cta" id="conta">
      <div className="convergence" aria-hidden="true">
        {Array.from({ length: 16 }).map((_, index) => (
          <span key={index} style={{ "--particle": index } as React.CSSProperties} />
        ))}
        <i />
      </div>
      <div className="final-cta-content reveal">
        <h2>Qual é o seu próximo movimento?</h2>
        <div className="cta-actions">
          <ButtonRoll href={OPEN_ACCOUNT}>Abra sua conta</ButtonRoll>
          <ButtonRoll href="https://www.xpi.com.br/" secondary cursor="VIEW">
            Conheça a XP
          </ButtonRoll>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer section-shell">
      <div className="footer-top">
        <span className="footer-brand">XP</span>
        <p>Capital em movimento.</p>
      </div>
      <div className="footer-links">
        <div>
          <h3>Produtos</h3>
          <a href="https://www.xpi.com.br/produtos/">Todos os investimentos</a>
          <a href="https://www.xpi.com.br/app/">Aplicativo XP</a>
          <a href="https://www.xpi.com.br/wealth-planning/">Wealth Planning</a>
          <a href="https://www.xpempresas.com.br/">XP Empresas</a>
        </div>
        <div>
          <h3>Conteúdo</h3>
          <a href="https://conteudos.xpi.com.br/">Conteúdos XP</a>
          <a href="https://www.xpi.com.br/simulador-de-investimento/">Simulador</a>
          <a href="https://www.infomoney.com.br/">InfoMoney</a>
        </div>
        <div>
          <h3>Suporte</h3>
          <a href="https://atendimento.xpi.com.br/">Central de atendimento</a>
          <a href="https://www.xpi.com.br/custos-operacionais/">Custos operacionais</a>
          <a href="https://lps.xpi.com.br/seguranca/">Segurança</a>
        </div>
        <div>
          <h3>Institucional</h3>
          <a href="https://www.xpi.com.br/quem-somos/">Quem somos</a>
          <a href="https://www.xpi.com.br/documentos/politica-de-privacidade/">Privacidade</a>
          <a href="https://www.xpi.com.br/documentos/politica-de-cookies/">Cookies</a>
        </div>
      </div>
      <div className="footer-legal">
        <p>
          Material de caráter meramente informativo. Não constitui oferta,
          recomendação ou garantia. Investimentos estão sujeitos a riscos.
          Consulte os documentos e canais oficiais antes de tomar decisões.
        </p>
        <p>XP S.A. CNPJ: 02.332.886/0001-04</p>
      </div>
    </footer>
  );
}

export function Experience() {
  const root = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [preloaderFinished, setPreloaderFinished] = useState(false);
  const tier = usePerformanceTier();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const frame = window.requestAnimationFrame(() => setPreloaderFinished(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const timeline = gsap.timeline({
      onComplete: () => setPreloaderFinished(true),
    });
    timeline
      .fromTo(".preloader-dot", { scale: 0 }, { scale: 1, duration: 0.25, ease: "power3.out" })
      .to(".preloader-line", { scaleX: 1, duration: 0.42, ease: "power2.inOut" })
      .to(".preloader-ring", { scale: 1, opacity: 1, duration: 0.32, ease: "power3.out" }, "-=0.08")
      .to(".preloader-ring", { scale: 18, duration: 0.48, ease: "power3.in" })
      .to(".preloader", { autoAlpha: 0, duration: 0.18 }, "-=0.12");

    return () => {
      timeline.kill();
    };
  }, []);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let lenis: Lenis | undefined;
      let ticker: ((time: number) => void) | undefined;

      if (!reduced) {
        lenis = new Lenis({ duration: 1.08, smoothWheel: true });
        lenis.on("scroll", ScrollTrigger.update);
        ticker = (time: number) => lenis?.raf(time * 1000);
        gsap.ticker.add(ticker);
        gsap.ticker.lagSmoothing(0);
      }

      const anchorLinks = root.current?.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');
      const handleAnchor = (event: Event) => {
        const link = event.currentTarget as HTMLAnchorElement;
        if (!link.hash) return;
        const target = document.querySelector(link.hash);
        if (!target) return;
        event.preventDefault();
        if (lenis) lenis.scrollTo(target as HTMLElement, { offset: -72 });
        else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      };
      anchorLinks?.forEach((link) => link.addEventListener("click", handleAnchor));

      if (!reduced) {
        gsap.fromTo(
          ".hero-line > span",
          { yPercent: 108, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.95, stagger: 0.08, ease: "power4.out", delay: 1.08 },
        );
        gsap.fromTo(
          ".hero-support",
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.72, ease: "power3.out", delay: 1.35 },
        );

        ScrollTrigger.batch(".reveal", {
          start: "top 84%",
          once: true,
          onEnter: (elements) =>
            gsap.fromTo(
              elements,
              { y: 42, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.78, stagger: 0.07, ease: "power3.out" },
            ),
        });

        gsap.to(".capital-flow-fill", {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "#universo",
            start: "top 70%",
            endTrigger: ".manifesto",
            end: "bottom bottom",
            scrub: true,
          },
        });

        ScrollTrigger.create({
          trigger: "#universo",
          start: "top 70%",
          endTrigger: ".manifesto",
          end: "bottom top",
          toggleClass: { targets: ".capital-flow", className: "is-visible" },
        });

        const mm = gsap.matchMedia();
        mm.add("(min-width: 1121px) and (min-height: 721px)", () => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: hero.current,
                start: "top top",
                end: "+=90%",
                pin: true,
                scrub: 1,
                anticipatePin: 1,
              },
            })
            .to(
              ".hero-copy",
              { yPercent: -6, autoAlpha: 0, duration: 0.35, ease: "none" },
              0.32,
            )
            .to(
              ".hero-visual",
              { scale: 1.22, xPercent: -2, rotation: 2.5, duration: 1, ease: "none" },
              0,
            )
            .to(
              ".hero-artwork",
              { scale: 1.08, autoAlpha: 0.18, duration: 1, ease: "none" },
              0,
            )
            .to(
              ".hero-yellow-wash",
              { scale: 1.25, autoAlpha: 0.48, duration: 0.4, ease: "none" },
              0.55,
            );

          const track = document.querySelector<HTMLElement>(".products-track");
          const productsSection = document.querySelector<HTMLElement>(".products");
          if (track && productsSection) {
            const horizontal = gsap.to(track, {
              x: () => -(track.scrollWidth - window.innerWidth + 80),
              ease: "none",
              scrollTrigger: {
                trigger: productsSection,
                start: "top top",
                end: () => `+=${track.scrollWidth - window.innerWidth + 80}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
                anticipatePin: 1,
              },
            });
            gsap.to(".product-progress span", {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: productsSection,
                start: "top top",
                end: () => `+=${track.scrollWidth - window.innerWidth + 80}`,
                scrub: true,
              },
            });
            gsap.utils.toArray<HTMLElement>(".product-panel").forEach((panel) => {
              gsap.fromTo(
                panel.querySelector(".product-body"),
                { autoAlpha: 0.28, y: 32 },
                {
                  autoAlpha: 1,
                  y: 0,
                  scrollTrigger: {
                    trigger: panel,
                    containerAnimation: horizontal,
                    start: "left 75%",
                    end: "center 55%",
                    scrub: true,
                  },
                },
              );
            });
          }

          gsap.fromTo(
            ".report-art",
            { scale: 0.85, rotateZ: -4 },
            {
              scale: 1,
              rotateZ: 0,
              ease: "none",
              scrollTrigger: {
                trigger: ".report",
                start: "top top",
                end: "+=130%",
                pin: true,
                scrub: 1,
              },
            },
          );
        });

        gsap.fromTo(
          ".phone-frame",
          { rotateY: -18 },
          {
            rotateY: 18,
            ease: "none",
            scrollTrigger: { trigger: ".app-section", start: "top bottom", end: "bottom top", scrub: 1 },
          },
        );

        gsap.utils.toArray<HTMLElement>(".wealth-ring").forEach((ring, index) => {
          gsap.fromTo(
            ring,
            { z: 0, rotate: index % 2 ? -8 : 8 },
            {
              z: (index - 1.5) * 34,
              rotate: index % 2 ? 10 : -10,
              ease: "none",
              scrollTrigger: { trigger: ".wealth", start: "top 80%", end: "bottom 30%", scrub: 1 },
            },
          );
        });

        gsap.to(".trajectory-line", {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: ".simulator", start: "top 75%", end: "bottom 60%", scrub: 1 },
        });

        const tierCards = gsap.utils.toArray<HTMLElement>(".tier-card");
        tierCards.forEach((card, index) => {
          const next = tierCards[index + 1];
          if (!next) return;
          gsap.to(card, {
            scale: 0.92,
            filter: "brightness(.65)",
            rotateX: 4,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top 12%", scrub: true },
          });
        });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".manifesto",
              start: "top top",
              end: "+=180%",
              pin: ".manifesto-inner",
              scrub: 1,
            },
          })
          .to(".manifesto-word", { opacity: 1, stagger: 0.08, ease: "none" })
          .to(".manifesto-orb", { x: "72vw", scale: 0.32, ease: "none" }, 0.25);

        mm.add("(max-width: 1120px), (max-height: 720px)", () => {
          gsap.to(".hero-visual", {
            scale: 1.16,
            rotation: 5,
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: hero.current, start: "top top", end: "bottom top", scrub: true },
          });
        });

        const cursor = document.querySelector<HTMLElement>(".xp-cursor");
        let removeCursor: (() => void) | undefined;
        if (cursor && window.matchMedia("(pointer: fine)").matches) {
          const xTo = gsap.quickTo(cursor, "x", { duration: 0.28, ease: "power3" });
          const yTo = gsap.quickTo(cursor, "y", { duration: 0.28, ease: "power3" });
          const cursorLabel = cursor.querySelector<HTMLElement>("span");
          const onMove = (event: PointerEvent) => {
            xTo(event.clientX);
            yTo(event.clientY);
            const target = (event.target as Element).closest<HTMLElement>("[data-cursor]");
            cursor.classList.toggle("is-active", Boolean(target));
            if (cursorLabel) cursorLabel.textContent = target?.dataset.cursor ?? "";
          };
          window.addEventListener("pointermove", onMove);
          removeCursor = () => {
            window.removeEventListener("pointermove", onMove);
          };
        }

        return () => {
          removeCursor?.();
          mm.revert();
          anchorLinks?.forEach((link) => link.removeEventListener("click", handleAnchor));
          if (ticker) gsap.ticker.remove(ticker);
          lenis?.destroy();
        };
      }

      return () => {
        anchorLinks?.forEach((link) => link.removeEventListener("click", handleAnchor));
        if (ticker) gsap.ticker.remove(ticker);
        lenis?.destroy();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="experience-root">
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <Preloader finished={preloaderFinished} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="grain" aria-hidden="true" />
      <div className="xp-cursor" aria-hidden="true"><span /></div>
      <div className="capital-flow" aria-hidden="true">
        <span className="capital-flow-track" />
        <span className="capital-flow-fill" />
        <i />
      </div>

      <main id="conteudo-principal">
        <section className="hero" id="inicio" ref={hero}>
          <div className="hero-yellow-wash" aria-hidden="true" />
          <div className="hero-artwork" aria-hidden="true" />
          <div className="hero-visual">
            {tier !== "low" ? <HeroOrbit quality={tier} /> : (
              <div className="hero-card-static" aria-hidden="true">
                <Image src="/images/xp-card.svg" alt="" width={1284} height={810} priority />
              </div>
            )}
          </div>
          <div className="hero-copy">
            <p className="hero-kicker">Capital em movimento</p>
            <h1 aria-label="Seu patrimônio não precisa parar.">
              <span className="hero-line" aria-hidden="true"><span>Seu patrimônio </span></span>
              <span className="hero-line" aria-hidden="true"><span>não precisa parar.</span></span>
            </h1>
            <div className="hero-support">
              <p>
                Investimentos, planejamento e soluções financeiras para diferentes momentos da sua jornada.
              </p>
              <div className="hero-actions">
                <ButtonRoll href={OPEN_ACCOUNT}>Abra sua conta</ButtonRoll>
                <ButtonRoll href="#universo" secondary cursor="EXPLORE">Conheça a XP</ButtonRoll>
              </div>
            </div>
          </div>
          <div className="hero-note" aria-hidden="true">
            <span />
            <p>Estratégia dá direção.</p>
          </div>
        </section>

        <Universe />
        <Products />
        <ReportSection />
        <AppSection />
        <WealthSection />
        <CompaniesSection />
        <SimulatorSection />
        <TiersSection />
        <Manifesto />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
