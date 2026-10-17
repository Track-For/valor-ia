"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight, ArrowRight, Pause, Play, Menu, X } from "lucide-react";
import { usePerformanceTier } from "./use-performance-tier";
import { ChapterShader, type ChapterMotion } from "./chapter-shader";
import "./xp-journey.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);
const HeroCard = dynamic(() => import("./hero-orbit"), { ssr: false });
const OPEN_ACCOUNT = "https://cadastro.xpi.com.br/v3/cadastro/nome";

const solutions = [
  { name: "Investir", tag: "Seu dinheiro, com direção.", text: "Encontre possibilidades para construir uma carteira alinhada aos seus objetivos e ao seu perfil.", image: "/images/capital-layers.png", label: "Uma carteira. Muitas possibilidades.", category: "INVESTIMENTOS", href: "https://www.xpi.com.br/investimentos/" },
  { name: "Planejar", tag: "O futuro começa nas escolhas de hoje.", text: "Dê forma aos seus planos com uma visão que conecta o presente, o patrimônio e o que vem depois.", image: "/images/xp-horizon.jpg", label: "Mais horizonte para os seus planos.", category: "PLANEJAMENTO", href: "https://www.xpi.com.br/" },
  { name: "Viver", tag: "Seu patrimônio também faz parte do agora.", text: "Conecte investimentos e vida financeira em uma experiência que acompanha o seu dia a dia.", image: "/images/xp-card.svg", label: "Para a vida que acontece agora.", category: "CONTA E CARTÃO", href: "https://www.xpi.com.br/produtos/cartao-de-credito/" },
  { name: "Expandir", tag: "Novos caminhos para ir além.", text: "Uma visão mais ampla para conectar seus projetos, sua empresa e suas próximas conquistas.", image: "/images/xp-city.jpg", label: "Seu próximo passo não tem fronteiras.", category: "NOVAS POSSIBILIDADES", href: "https://www.xpi.com.br/" },
];
const chapters = [
  { n: "01", name: "Seu começo.", title: "Toda conquista começa com uma escolha.", text: "Organize a vida financeira e encontre o seu ponto de partida.", items: ["Seus objetivos no centro", "Uma visão da sua carteira", "Conteúdo para decidir"], code: "COMEÇAR" },
  { n: "02", name: "Seu movimento.", title: "Mais possibilidades para o seu dinheiro.", text: "Conecte seus investimentos ao momento que você está vivendo.", items: ["Estratégia para os seus planos", "Investimentos e vida financeira", "Uma experiência conectada"], code: "EVOLUIR" },
  { n: "03", name: "Seu amanhã.", title: "Um patrimônio que olha para a frente.", text: "Dê continuidade ao que você construiu e espaço ao que ainda quer realizar.", items: ["Planejamento de longo prazo", "Uma visão para cada etapa", "O próximo capítulo é seu"], code: "CONSTRUIR" },
];

function Photo({ src, alt = "", className = "" }: { src: string; alt?: string; className?: string }) {
  return <Image className={className} src={src} alt={alt} fill sizes="(max-width: 760px) 95vw, 55vw" />;
}
function LinkCTA({ children, href = OPEN_ACCOUNT }: { children: React.ReactNode; href?: string }) {
  return <a className="j-cta" href={href}>{children}<ArrowUpRight size={19} aria-hidden="true" /></a>;
}
function PortfolioGraphic() {
  return <div className="j-portfolio"><span className="j-micro">UMA VISÃO DO TODO</span><h3>Seu patrimônio.<br />Em perspectiva.</h3><svg viewBox="0 0 400 150" aria-hidden="true"><path d="M0 130 48 110 85 118 130 80 165 90 215 44 250 58 295 24 340 38 400 4" fill="none" stroke="currentColor" strokeWidth="3" /><path d="M0 150h400M0 100h400M0 50h400" stroke="currentColor" strokeOpacity=".14" /></svg><div className="j-portfolio-bottom"><span>Planejar</span><span>Diversificar</span><span>Acompanhar</span></div></div>;
}
function GalleryTile({ type }: { type: number }) {
  if (type === 0) return <div className="j-tile j-tile-card"><span className="j-micro">XP / NO SEU DIA A DIA</span><Image src="/images/xp-card.svg" width={1284} height={810} alt="Conceito de cartão XP preto" /><strong>Mais vida.<br />Mais possibilidades.</strong></div>;
  if (type === 1) return <div className="j-tile j-tile-photo"><Photo src="/images/xp-city.jpg" /><span>Onde você quer chegar?</span></div>;
  if (type === 2) return <div className="j-tile j-tile-chart"><PortfolioGraphic /></div>;
  if (type === 3) return <div className="j-tile j-tile-photo"><Photo src="/images/capital-layers.png" /><span>Construir, camada por camada.</span></div>;
  if (type === 4) return <div className="j-tile j-tile-type"><span className="j-micro">CAPITAL EM MOVIMENTO</span><strong>O futuro<br />tem a sua<br /><em>direção.</em></strong><ArrowUpRight size={54} /></div>;
  return <div className="j-tile j-tile-photo"><Photo src="/images/xp-horizon.jpg" /><span>Espaço para novos planos.</span></div>;
}

export function XPJourney() {
  const root = useRef<HTMLDivElement>(null);
  const chapterMotion = useRef<ChapterMotion[]>([{ progress: 0 }, { progress: 0 }, { progress: 0 }]);
  const registerChapterShader = useCallback((index: number, render: () => void) => {
    const surface = chapterMotion.current[index];
    surface.render = render;
    return () => { if (surface.render === render) surface.render = undefined; };
  }, []);
  const tier = usePerformanceTier();
  const [paused, setPaused] = useState(false);
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState(0);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({ motion: "(prefers-reduced-motion: no-preference)", mobile: "(max-width: 760px)" }, (context) => {
      if (!context.conditions?.motion || !root.current) return;
      const mobile = Boolean(context.conditions.mobile);
      const scope = root.current;
      scope.classList.add("j-motion");
      const select = gsap.utils.selector(scope);

      gsap.from(".j-hero-copy > *", { y: 35, autoAlpha: 0, stagger: .12, duration: 1, ease: "power3.out" });
      gsap.fromTo(".j-gallery-shell", { scale: mobile ? .86 : .58, y: 50, borderRadius: 24 }, {
        scale: 1, y: 0, borderRadius: 0, ease: "none",
        scrollTrigger: { id: "xp-gallery", trigger: ".j-gallery", start: "top bottom", end: "top top", scrub: .55, invalidateOnRefresh: true },
      });
      const gallery = scope.querySelector<HTMLElement>(".j-gallery")!;
      const galleryObserver = new IntersectionObserver(([entry]) => gallery.classList.toggle("is-visible", entry.isIntersecting));
      galleryObserver.observe(gallery);

      gsap.from(".j-intro-reveal", { y: 65, autoAlpha: 0, stagger: .16, duration: .9, scrollTrigger: { trigger: ".j-intro", start: "top 75%", once: true } });

      const panels = select(".j-solution-image") as HTMLElement[];
      const steps = gsap.timeline({
        defaults: { ease: "none" },
        onUpdate: function (this: gsap.core.Timeline) {
          const time = this.time();
          const index = time < 1.1 ? 0 : time < 2.3 ? 1 : time < 3.5 ? 2 : 3;
          setActive(index);
          panels.forEach((panel, i) => { panel.inert = i !== index; });
        },
        scrollTrigger: {
          id: "xp-solutions", trigger: ".j-solutions", start: "top top", end: () => "+=" + window.innerHeight * (mobile ? 3 : 3.2),
          pin: true, scrub: .65, invalidateOnRefresh: true,
        },
      });
      steps.addLabel("solution-0", 0).to({}, { duration: .6 });
      panels.slice(1).forEach((panel, i) => {
        const at = .6 + i * 1.2;
        steps.fromTo(panel, { scale: .03, xPercent: 60, yPercent: 65 }, { scale: 1, xPercent: 0, yPercent: 0, duration: .9, transformOrigin: "bottom right" }, at);
        steps.addLabel("solution-" + (i + 1), at + .9);
      });
      steps.to({}, { duration: .65 });

      const stage = scope.querySelector<HTMLElement>(".j-finale-stage")!;
      const deviceScreen = scope.querySelector<HTMLElement>(".j-device-screen")!;
      const appSection = scope.querySelector<HTMLElement>(".j-app")!;
      const cards = select(".j-chapter") as HTMLElement[];
      const final = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { id: "xp-finale", trigger: ".j-finale", pin: stage, start: "top top", end: () => "+=" + window.innerHeight * (mobile ? 6 : 5), scrub: .65, invalidateOnRefresh: true },
        onUpdate: () => { appSection.inert = final.time() < 6.3; },
      });
      gsap.set(".j-app", { autoAlpha: 0 });
      gsap.set(".j-device", { autoAlpha: 0 });
      gsap.set(".j-chapter", { y: () => window.innerHeight * 1.2, rotation: (i) => [-35, 28, -30][i], rotationY: (i) => [100, -110, 100][i], rotationX: (i) => [20, -14, 18][i], transformPerspective: 1200 });
      final.addLabel("fill", 0)
        .fromTo(".j-color-fill", { yPercent: -100 }, { yPercent: 0, duration: 1.6 }, 0)
        .fromTo(".j-statement mark", { "--j-highlight": "0%" }, { "--j-highlight": "100%", duration: .55 }, 1.25)
        .to({}, { duration: .4 })
        .addLabel("cards", 2)
        .to(".j-statement-content", { filter: "blur(12px)", opacity: .24, scale: .94, duration: .8 }, 2);

      cards.forEach((card, i) => {
        const at = 2.15 + i * (mobile ? .8 : .4);
        const surface = chapterMotion.current[i];
        final.to(card, { y: mobile ? i * 12 : (i === 1 ? -22 : 15), x: mobile ? (i - 1) * 10 : 0, rotation: mobile ? (i - 1) * 3 : [-4, 0, 4][i], rotationY: 0, rotationX: 0, duration: 1.4, ease: "power3.out" }, at);
        final.fromTo(surface, { progress: 0 }, { progress: 1, duration: 1.4, ease: "none", onUpdate: () => surface.render?.() }, at);
      });
      final.addLabel("assembled", 5.2).to({}, { duration: .35 }, 5.2)
        .addLabel("app", 5.7)
        .to(".j-statement-content", { autoAlpha: 0, duration: .5 }, 5.7)
        .to(".j-color-fill", { autoAlpha: 0, duration: 1.1 }, 5.7)
        .to(".j-device", { autoAlpha: 1, duration: .8 }, 5.9)
        .to(".j-card-scene", {
          scale: () => Math.min(deviceScreen.clientWidth / (mobile ? 1060 : stage.clientWidth), deviceScreen.clientHeight / stage.clientHeight),
          x: () => { const a = stage.getBoundingClientRect(), b = deviceScreen.getBoundingClientRect(); return b.left + b.width / 2 - a.left - a.width / 2; },
          y: () => { const a = stage.getBoundingClientRect(), b = deviceScreen.getBoundingClientRect(); return b.top + b.height / 2 - a.top - a.height / 2; },
          duration: 1.4, ease: "power2.inOut",
        }, 5.7)
        .to(".j-app", { autoAlpha: 1, duration: .7 }, 6.3)
        .to({}, { duration: .65 });
      if (mobile) {
        final.to(cards, { x: (i) => (i - 1) * 330, y: 0, rotation: (i) => [-5, 0, 5][i], duration: 1.4, ease: "power2.inOut" }, 5.7);
      }
      const refresh = () => ScrollTrigger.refresh();
      document.fonts.ready.then(refresh);
      return () => {
        galleryObserver.disconnect();
        scope.classList.remove("j-motion");
        appSection.inert = false;
        panels.forEach((panel) => { panel.inert = false; });
        chapterMotion.current.forEach((surface) => { surface.progress = 0; surface.render?.(); });
      };
    });
    return () => mm.revert();
  }, { scope: root });

  function jumpToSolution(index: number) {
    const trigger = ScrollTrigger.getById("xp-solutions");
    const timeline = trigger?.animation as gsap.core.Timeline | undefined;
    if (trigger && timeline) {
      const progress = (timeline.labels["solution-" + index] + .08) / timeline.duration();
      window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * progress, behavior: "smooth" });
    } else {
      document.getElementById("solucao-" + index)?.scrollIntoView({ behavior: "auto", block: "center" });
    }
    setActive(index);
  }

  return (
    <div className="journey" ref={root}>
      <a className="skip-link" href="#j-conteudo">Pular para o conteúdo</a>
      <header className="j-header">
        <a href="#inicio" className="j-logo" aria-label="XP — início">XP<span>INVESTIMENTOS</span></a>
        <nav aria-label="Navegação principal" className={menu ? "j-nav is-open" : "j-nav"}>
          {[["Universo XP", "#universo"], ["Soluções", "#solucoes"], ["Seu futuro", "#futuro"]].map(([label, href]) => <a key={href} href={href} onClick={() => setMenu(false)}>{label}</a>)}
          <a href={OPEN_ACCOUNT} onClick={() => setMenu(false)}>Abra sua conta <ArrowUpRight size={14} /></a>
        </nav>
        <button className="j-menu" onClick={() => setMenu(!menu)} aria-label={menu ? "Fechar menu" : "Abrir menu"} aria-expanded={menu}>{menu ? <X /> : <Menu />}</button>
      </header>

      <main id="j-conteudo">
        <section className="j-hero" id="inicio">
          <div className="j-hero-topline"><span>CAPITAL EM MOVIMENTO</span><span>O PRÓXIMO CAPÍTULO É SEU.</span></div>
          <div className="j-hero-copy">
            <p className="j-kicker"><i /> A VIDA NÃO PARA. SEU PATRIMÔNIO TAMBÉM NÃO.</p>
            <h1>Seu próximo<br /><em>capítulo.</em></h1>
            <p>Investir é abrir espaço para o que vem.<br />Viva suas possibilidades com a XP.</p>
            <LinkCTA>Abra sua conta</LinkCTA>
          </div>
          <div className="j-hero-art" aria-hidden="true">
            {tier === "low" ? <Image className="j-static-card" src="/images/xp-card.svg" alt="" width={1284} height={810} priority /> : <HeroCard quality={tier} />}
          </div>
          <div className="j-hero-bottom"><a href="#universo">Explore o seu próximo passo <ArrowDown size={17} /></a><span>INVESTIR. VIVER. IR ALÉM.</span></div>
        </section>

        <section className={"j-gallery " + (paused ? "is-paused" : "")} id="universo" aria-label="Universo XP em movimento">
          <div className="j-gallery-shell">
            <div className="j-gallery-columns">
              {[[0, 1, 4], [3, 2, 5], [5, 4, 0]].map((column, index) => <div className="j-gallery-column" key={index}><div className={"j-gallery-track " + (index === 1 ? "is-reverse" : "")}>
                {[0, 1].map((copy) => <div className="j-gallery-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{column.map((type, i) => <GalleryTile type={type} key={i} />)}</div>)}
              </div></div>)}
            </div>
            <div className="j-gallery-caption"><h2>Um universo de<br /><em>possibilidades.</em></h2><button onClick={() => setPaused(!paused)} aria-label={paused ? "Retomar movimento da galeria" : "Pausar movimento da galeria"} aria-pressed={paused}>{paused ? <Play size={17} /> : <Pause size={17} />}</button></div>
          </div>
        </section>

        <section className="j-intro" id="sobre">
          <div className="j-intro-left j-intro-reveal"><p className="j-kicker">01 / A SUA VIDA NO CENTRO</p><h2>Não é só<br />sobre dinheiro.<br /><em>É sobre você.</em></h2><p className="j-intro-foot">Seus planos mudam. Suas ambições crescem.<br />A sua vida financeira precisa acompanhar.</p></div>
          <div className="j-intro-right j-intro-reveal"><div className="j-intro-photo"><Photo src="/images/xp-people.jpg" alt="Pessoas reunidas para conversar e planejar" /></div><h3>Primeiro, o que<br />importa para você.<br /><em>Depois, os caminhos<br />para chegar lá.</em></h3><p>Investimentos, planejamento e soluções financeiras conectados aos seus objetivos. Tudo começa com a sua próxima escolha.</p><a className="j-text-link" href="#solucoes">Encontre o seu caminho <ArrowDown size={19} /></a></div>
        </section>

        <section className="j-solutions" id="solucoes">
          <div className="j-solutions-copy"><p className="j-kicker">02 / POSSIBILIDADES QUE SE CONECTAM</p><h2>Para cada<br /><em>próximo passo.</em></h2><div className="j-solution-list">
            {solutions.map((solution, i) => <button key={solution.name} className={active === i ? "is-active" : ""} aria-current={active === i ? "step" : undefined} onClick={() => jumpToSolution(i)}><span className="j-step-number">0{i + 1}</span><span>{solution.name}</span><ArrowUpRight size={23} /><small>{solution.tag}</small></button>)}
          </div><p className="j-scroll-note">CONTINUE ROLANDO PARA EXPLORAR <ArrowDown size={14} /></p></div>
          <div className="j-solution-images">
            {solutions.map((solution, i) => <article className={"j-solution-image j-solution-" + i} id={"solucao-" + i} key={solution.name}>
              <Photo src={solution.image} alt={solution.label} />
              <div className="j-solution-overlay"><span className="j-micro">{solution.category}</span><h3>{solution.label}</h3><p>{solution.text}</p><a href={solution.href}>Conheça as possibilidades <ArrowUpRight size={18} /></a></div>
            </article>)}
          </div>
        </section>

        <div className="j-finale" id="futuro">
          <div className="j-finale-stage">
            <section className="j-statement" aria-label="O que importa"><div className="j-color-fill" /><div className="j-statement-content"><p className="j-kicker">03 / O QUE MOVE VOCÊ</p><h2>O seu dinheiro<br />a serviço do que<br /><mark><em>realmente importa.</em></mark></h2><p>A vida que você quer viver.</p></div></section>

            <section className="j-card-scene" aria-label="Os próximos capítulos da sua vida">
              <div className="j-chapters">
                {chapters.map((chapter, index) => <article className="j-chapter" key={chapter.n}>{tier !== "low" && <ChapterShader motion={chapterMotion} onReady={registerChapterShader} index={index} dark={index === 2} />}<div className="j-chapter-top"><span>XP / {chapter.n}</span><ArrowUpRight size={24} /></div><h2>{chapter.name}</h2><h3>{chapter.title}</h3><p>{chapter.text}</p><ul>{chapter.items.map(item => <li key={item}>{item}</li>)}</ul><div className="j-chapter-ticket"><span>O PRÓXIMO CAPÍTULO É SEU</span><strong>{chapter.code}</strong><div className="j-barcode" aria-hidden="true" /></div></article>)}
              </div>
            </section>

            <section className="j-app" id="app" aria-label="Sua vida financeira conectada"><div className="j-app-copy"><p className="j-kicker">04 / TUDO SE CONECTA</p><h2>Seu universo.<br /><em>Com você.</em></h2><p>Do primeiro investimento aos próximos grandes planos. Uma experiência para acompanhar o seu movimento.</p><LinkCTA>Comece o seu próximo capítulo</LinkCTA><span className="j-app-note">XP. INVESTIR TRANSFORMA.</span></div></section>
            <div className="j-device" aria-hidden="true"><div className="j-device-screen"><div className="j-device-nav"><b>XP</b><span>Seu próximo capítulo</span><span>● ● ●</span></div><div className="j-device-bottom"><span>SEUS PLANOS. SUAS POSSIBILIDADES.</span><ArrowUpRight size={18} /></div></div><span className="j-device-camera" /></div>
          </div>
        </div>
      </main>

      <footer className="j-footer" id="contato"><div className="j-footer-top"><div><p>O futuro não espera.</p><a href={OPEN_ACCOUNT}>Vamos em frente. <ArrowUpRight /></a></div><nav aria-label="Links do rodapé"><a href="#universo">Universo XP</a><a href="#solucoes">Soluções</a><a href="#futuro">Seu futuro</a><a href="https://www.xpi.com.br/">Site oficial XP <ArrowUpRight size={14} /></a></nav><div className="j-footer-contact"><span>SEU PRÓXIMO PASSO</span><a href={OPEN_ACCOUNT}>Abra sua conta <ArrowRight size={18} /></a></div></div><a className="j-footer-wordmark" href="#inicio" aria-label="XP Investimentos — voltar ao início"><span>XP</span><span>INVESTIR<br /><em>TRANSFORMA.</em></span></a><div className="j-footer-bottom"><span>© 2026 XP · Capital em movimento</span><p>Conteúdo institucional. Imagens e interfaces ilustrativas.</p><a href="https://www.xpi.com.br/politica-de-privacidade/">Privacidade <ArrowUpRight size={12} /></a></div></footer>
    </div>
  );
}



