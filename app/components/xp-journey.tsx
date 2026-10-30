"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight, ArrowRight, Pause, Play, Menu, X } from "lucide-react";
import { usePerformanceTier } from "./use-performance-tier";
import { ChapterShader, type ChapterMotion } from "./chapter-shader";
import { ApproachSection, approachShapePoints } from "./approach-section";
import "./xp-journey.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);
const MAIN_SITE_URL = "https://valor-ia.com";
const WHATSAPP_URL = "https://wa.me/5511999819297?text=Olá!%20Quero%20entender%20como%20a%20gestão%20financeira%20e%20contábil%20pode%20ajudar%20minha%20operação%20no%20Magalu.";

const solutions = [
  { name: "CPF", tag: "Comece com clareza", text: "Vende como pessoa física? Organize entradas, custos e obrigações para entender o resultado real das suas vendas", image: "/images/seller-cpf.jpg", label: "Sua venda também merece gestão", category: "SELLER PESSOA FÍSICA", href: MAIN_SITE_URL },
  { name: "MEI", tag: "Separe o negócio da vida pessoal", text: "Tenha apoio financeiro e contábil para cuidar da rotina do MEI e acompanhar cada etapa da operaçã.", image: "/images/seller-mei.jpg", label: "Mais controle para crescer com segurança", category: "SELLER MEI", href: MAIN_SITE_URL },
  { name: "Simples", tag: "Decisões melhores começam nos números", text: "Organize a gestão da empresa, acompanhe o financeiro e conte com orientação contábil para o Simples Nacional", image: "/images/seller-simples.png", label: "Gestão alinhada ao tamanho do seu negócio", category: "SIMPLES NACIONAL", href: MAIN_SITE_URL },
];
const chapters = [
  { n: "01", name: "Pessoa física", title: "Vende com CPF no Magalu?", text: "Entenda como organizar a rotina financeira de quem vende como pessoa física e quais são os próximos passos para formalizar a operação", items: ["Organização de receitas e custos", "Visão do resultado das vendas", "Orientação para o próximo passo"], code: "CPF" },
  { n: "02", name: "MEI", title: "Cuide bem da sua estrutura", text: "Apoio para manter a rotina financeira e contábil do MEI organizada enquanto você toca suas vendas", items: ["Contabilidade para MEI", "Acompanhamento financeiro", "Rotina e obrigações em dia"], code: "MEI" },
  { n: "03", name: "Simples Nacional", title: "Gestão para a empresa crescer", text: "Uma visão financeira e contábil conectada à operação de quem vende no marketplace e está no Simples Nacional", items: ["Gestão financeira da empresa", "Acompanhamento contábil", "Informação para decidir"], code: "SIMPLES" },
];

function Photo({ src, alt = "", className = "" }: { src: string; alt?: string; className?: string }) {
  return <Image className={className} src={src} alt={alt} fill sizes="(max-width: 760px) 95vw, 55vw" />;
}
function LinkCTA({ children, href = MAIN_SITE_URL }: { children: React.ReactNode; href?: string }) {
  return <a className="j-cta" href={href}>{children}<ArrowUpRight size={19} aria-hidden="true" /></a>;
}
function PortfolioGraphic() {
  return <div className="j-portfolio"><span className="j-micro">UMA VISÃO DO TODO</span><h3>Seu patrimônio<br />Em perspectiva</h3><svg viewBox="0 0 400 150" aria-hidden="true"><path d="M0 130 48 110 85 118 130 80 165 90 215 44 250 58 295 24 340 38 400 4" fill="none" stroke="currentColor" strokeWidth="3" /><path d="M0 150h400M0 100h400M0 50h400" stroke="currentColor" strokeOpacity=".14" /></svg><div className="j-portfolio-bottom"><span>Planejar</span><span>Diversificar</span><span>Acompanhar</span></div></div>;
}
function GalleryTile({ type }: { type: number }) {
  if (type === 0) return <div className="j-tile j-tile-card"><span className="j-micro">GESTÃO PARA SELLERS</span><Image src="/images/client-logo.png" width={260} height={154} alt="Marca do cliente" /><strong>Números claros<br />Escolhas melhores</strong></div>;
  if (type === 1) return <div className="j-tile j-tile-photo"><Photo src="/images/seller-cpf.jpg" alt="Equipe conversando sobre gestão e riscos" /><span>Gestão mais próxima da operação</span></div>;
  if (type === 2) return <div className="j-tile j-tile-chart"><PortfolioGraphic /></div>;
  if (type === 3) return <div className="j-tile j-tile-photo"><Photo src="/images/seller-packing.png" alt="Seller preparando pedidos para envio" /><span>Construir, pedido por pedido</span></div>;
  if (type === 4) return <div className="j-tile j-tile-type"><span className="j-micro">SELLER MAGALU</span><strong>Seu negócio<br />em boa<br /><em>gestão</em></strong><ArrowUpRight size={54} /></div>;
  return <div className="j-tile j-tile-photo"><Photo src="/images/seller-mei.jpg" alt="Empreendedor trabalhando em seu negócio" /><span>Organize sua próxima etapa</span></div>;
}

export function SellerLanding() {
  const root = useRef<HTMLDivElement>(null);
  const introMotion = useRef<ChapterMotion[]>([{ progress: 0 }]);
  const registerIntroShader = useCallback((index: number, render: () => void) => {
    const surface = introMotion.current[index];
    surface.render = render;
    return () => { if (surface.render === render) surface.render = undefined; };
  }, []);
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
    mm.add({ motion: "(prefers-reduced-motion: no-preference)", mobile: "(max-width: 760px)", approachDesktop: "(min-width: 1024px)" }, (context) => {
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

      const intro = scope.querySelector<HTMLElement>(".j-intro")!;
      const introSurface = introMotion.current[0];
      const introSlot = intro.querySelector<HTMLElement>(".j-intro-photo-slot")!;
      const introLeft = intro.querySelector<HTMLElement>(".j-intro-left")!;
      const introTitle = introLeft.querySelector<HTMLElement>("h2")!;
      const introTimeline = gsap.timeline({
        scrollTrigger: { id: "xp-intro-photo", trigger: introTitle, start: "bottom bottom", endTrigger: intro, end: "top top", scrub: .45, invalidateOnRefresh: true },
      });
      introTimeline.fromTo(".j-intro-photo", {
        x: 0, y: 0, rotation: 0, rotationY: 0, rotationX: 0,
        transformPerspective: 1100,
      }, {
        x: () => mobile ? -introSlot.offsetLeft * .35 : introLeft.getBoundingClientRect().left - introSlot.getBoundingClientRect().left,
        y: () => mobile ? 24 : introTitle.getBoundingClientRect().bottom + 42 - introSlot.getBoundingClientRect().top,
        rotation: -360, duration: 1, ease: "power2.inOut",
      }, 0)
        .fromTo(introSurface, { progress: 0 }, { progress: 1, duration: 1, ease: "none", onUpdate: () => introSurface.render?.() }, 0);

      const approach = scope.querySelector<HTMLElement>(".approach-section");
      if (context.conditions?.approachDesktop && approach) {
        const approachPanels = Array.from(approach.querySelectorAll<HTMLElement>(".approach-card-panel"));
        const approachCopies = Array.from(approach.querySelectorAll<HTMLElement>(".approach-card-copy"));
        const approachShape = approach.querySelector<SVGSVGElement>(".approach-shape")!;
        const approachPolygon = approachShape.querySelector<SVGPolygonElement>("polygon")!;
        gsap.set(approachPanels, { scaleY: .58 });
        gsap.set(approachCopies, { y: 24, opacity: 0 });
        gsap.set(approachPanels[0], { scaleY: 1 });
        gsap.set(approachCopies[0], { y: 0, opacity: 1 });

        const approachTimeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            id: "approach", trigger: approach, start: "top top",
            end: () => "+=" + window.innerHeight * 2.35,
            pin: true, scrub: .55, invalidateOnRefresh: true,
          },
        });
        approachTimeline.to({}, { duration: .35 });
        approachPanels.slice(1).forEach((panel, position) => {
          const index = position + 1;
          const at = position + .35;
          approachTimeline.to(panel, { scaleY: 1, duration: .72 }, at)
            .to(approachCopies[index], { y: 0, opacity: 1, duration: .58 }, at + .18);
          approachTimeline.to(approachShape, { left: `${10 + index * 20}%`, duration: .78 }, at - .12)
            .to(approachPolygon, { attr: { points: approachShapePoints[index] }, duration: .78 }, at - .12);
        });
        approachTimeline.to({}, { duration: .25 });
      }

      const panels = select(".j-solution-image") as HTMLElement[];
      const steps = gsap.timeline({
        defaults: { ease: "none" },
        onUpdate: function (this: gsap.core.Timeline) {
          const time = this.time();
          const index = Math.min(panels.length - 1, time < 1.1 ? 0 : time < 2.3 ? 1 : 2);
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
        introSurface.progress = 0;
        introSurface.render?.();
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
        <a href="#inicio" className="j-logo" aria-label="Página inicial"><Image src="/images/client-logo.png" width={104} height={62} alt="" /><span>GESTÃO PARA<br />SELLERS MAGALU</span></a>
        <nav aria-label="Navegação principal" className={menu ? "j-nav is-open" : "j-nav"}>
          {[["Para sellers", "#universo"], ["Abordagem", "#abordagem"], ["Encontre seu perfil", "#solucoes"]].map(([label, href]) => <a key={href} href={href} onClick={() => setMenu(false)}>{label}</a>)}
          <a href={MAIN_SITE_URL} onClick={() => setMenu(false)}>Conheça a Valor IA <ArrowUpRight size={14} /></a>
        </nav>
        <button className="j-menu" onClick={() => setMenu(!menu)} aria-label={menu ? "Fechar menu" : "Abrir menu"} aria-expanded={menu}>{menu ? <X /> : <Menu />}</button>
      </header>

      <main id="j-conteudo">
        <section className="j-hero" id="inicio">
          <div className="j-hero-topline"><span>GESTÃO FINANCEIRA E CONTÁBIL</span><span>GESTÃO PARA SELLERS MAGALU</span></div>
          <div className="j-hero-copy">
            <p className="j-kicker"><i /> VOCÊ VENDE NO MAGALU. A GENTE CUIDA DOS NÚMEROS.</p>
            <h1>Venda mais<br /><em>Organize melhor</em></h1>
            <p>Gestão financeira e contábil feita para a realidade de quem vende em marketplace</p>
            <div className="j-hero-actions">
              <LinkCTA>Conheça a Valor IA</LinkCTA>
              <a className="j-whatsapp-link" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Tire dúvidas pelo WhatsApp <ArrowUpRight size={15} /></a>
            </div>
          </div>
          <div className="j-hero-art" aria-hidden="true">
            <video className="j-hero-video" autoPlay loop muted playsInline preload="metadata" poster="/images/client-logo-higgsfield.png">
              <source src="/videos/hf_20261030_113443_0dc9aed9-f778-4a8c-9f81-b73d3d48ab5a.mp4" type="video/mp4" />
            </video>
            <Image className="j-hero-still" src="/images/client-logo.png" alt="" width={1040} height={616} />
          </div>
          <div className="j-hero-bottom"><a href="#universo">Veja como podemos ajudar <ArrowDown size={17} /></a><span>CONTABILIDADE • FINANCEIRO • GESTÃO</span></div>
        </section>

        <section className={"j-gallery " + (paused ? "is-paused" : "")} id="universo" aria-label="Gestão financeira e contábil para sellers">
          <div className="j-gallery-shell">
            <div className="j-gallery-columns">
              {[[0, 1, 4], [3, 2, 5], [5, 4, 0]].map((column, index) => <div className="j-gallery-column" key={index}><div className={"j-gallery-track " + (index === 1 ? "is-reverse" : "")}>
                {[0, 1].map((copy) => <div className="j-gallery-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{column.map((type, i) => <GalleryTile type={type} key={i} />)}</div>)}
              </div></div>)}
            </div>
            <div className="j-gallery-caption"><h2>Seu negócio merece<br /><em>uma boa gestão</em></h2><button onClick={() => setPaused(!paused)} aria-label={paused ? "Retomar movimento da galeria" : "Pausar movimento da galeria"} aria-pressed={paused}>{paused ? <Play size={17} /> : <Pause size={17} />}</button></div>
          </div>
        </section>

        <section className="j-intro" id="sobre">
          <div className="j-intro-left j-intro-reveal"><p className="j-kicker">01 / QUEM VENDE NO MAGALU</p><h2>Você cuida<br />das vendas<br /><em>A gente dos números</em></h2><p className="j-intro-foot">A operação cresce, as tarefas se acumulam.<br />Tenha apoio para cuidar da gestão</p></div>
          <div className="j-intro-right j-intro-reveal"><div className="j-intro-photo-slot"><div className="j-intro-photo"><Photo src="/images/client-team.png" alt="Equipe da Valor IA" />{tier !== "low" && <ChapterShader motion={introMotion} onReady={registerIntroShader} index={0} imageSrc="/images/client-team.png" />}</div></div><h3>Financeiro<br />e contábil<br /><em>no mesmo time</em></h3><p>Uma equipe para apoiar a rotina do seu negócio: organização financeira, contabilidade e informação para orientar suas decisões</p><a className="j-text-link" href="#solucoes">Encontre seu perfil <ArrowDown size={19} /></a></div>
        </section>

        <ApproachSection />

        <section className="j-solutions" id="solucoes">
          <div className="j-solutions-copy"><p className="j-kicker">02 / ESCOLHA O SEU PERFIL</p><h2>Uma gestão para<br /><em>cada fase</em></h2><div className="j-solution-list">
            {solutions.map((solution, i) => <button key={solution.name} className={active === i ? "is-active" : ""} aria-current={active === i ? "step" : undefined} onClick={() => jumpToSolution(i)}><span className="j-step-number">0{i + 1}</span><span>{solution.name}</span><ArrowUpRight size={23} /><small>{solution.tag}</small></button>)}
          </div><p className="j-scroll-note">ESCOLHA O PERFIL QUE COMBINA COM VOCÊ <ArrowDown size={14} /></p></div>
          <div className="j-solution-images">
            {solutions.map((solution, i) => <article className={"j-solution-image j-solution-" + i} id={"solucao-" + i} key={solution.name}>
              <Photo src={solution.image} alt={solution.label} />
              <div className="j-solution-overlay"><span className="j-micro">{solution.category}</span><h3>{solution.label}</h3><p>{solution.text}</p><a href={solution.href}>Conheça as possibilidades <ArrowUpRight size={18} /></a></div>
            </article>)}
          </div>
        </section>

        <div className="j-finale" id="futuro">
          <div className="j-finale-stage">
            <section className="j-statement" aria-label="Gestão para o seu negócio"><div className="j-color-fill" /><div className="j-statement-content"><p className="j-kicker">03 / MAIS TEMPO PARA A SUA OPERAÇÃO</p><h2>Você faz o negócio<br />acontecer<br /><mark><em>Conte com a gente</em></mark></h2><p>Gestão financeira e contábil para sellers Magalu</p></div></section>

            <section className="j-card-scene" aria-label="Trilhas para cada perfil de seller">
              <div className="j-chapters">
                {chapters.map((chapter, index) => <article className="j-chapter" key={chapter.n}>{tier !== "low" && <ChapterShader motion={chapterMotion} onReady={registerChapterShader} index={index} dark={index === 2} />}<div className="j-chapter-top"><span>SELLER / {chapter.n}</span><ArrowUpRight size={24} /></div><h2>{chapter.name}</h2><h3>{chapter.title}</h3><p>{chapter.text}</p><ul>{chapter.items.map(item => <li key={item}>{item}</li>)}</ul><div className="j-chapter-ticket"><span>FALE COM A NOSSA EQUIPE</span><strong>{chapter.code}</strong><div className="j-barcode" aria-hidden="true" /></div></article>)}
              </div>
            </section>

            <section className="j-app" id="app" aria-label="Gestão financeira e contábil"><div className="j-app-copy"><p className="j-kicker">04 / CONTE COM A VALOR IA</p><h2>Seu negócio<br /><em>Em boas mãos</em></h2><p>Acesse o site principal para conhecer os serviços de gestão financeira e contábil para a sua operação</p><LinkCTA>Conheça a Valor IA</LinkCTA><a className="j-whatsapp-link" href={WHATSAPP_URL} target="_blank" rel="noreferrer">Prefere conversar? Chame no WhatsApp <ArrowUpRight size={15} /></a><span className="j-app-note">GESTÃO FINANCEIRA • CONTABILIDADE</span></div></section>
            <div className="j-device" aria-hidden="true"><div className="j-device-screen"><div className="j-device-nav"><b>SELLER</b><span>Resumo da operação</span><span>● ● ●</span></div><div className="j-device-bottom"><span>FINANCEIRO • CONTÁBIL • GESTÃO</span><ArrowUpRight size={18} /></div></div><span className="j-device-camera" /></div>
          </div>
        </div>
      </main>

      <footer className="j-footer" id="contato"><div className="j-footer-top"><div><p>Você cuida das vendas</p><a href={MAIN_SITE_URL}>Conheça a Valor IA <ArrowUpRight /></a></div><nav aria-label="Links do rodapé"><a href="#universo">Como podemos ajudar</a><a href="#solucoes">Escolha seu perfil</a><a href="#futuro">Sobre o serviço</a><a href={MAIN_SITE_URL} target="_blank" rel="noreferrer">Site principal <ArrowUpRight size={14} /></a></nav><div className="j-footer-contact"><span>FALE COM A NOSSA EQUIPE</span><a href={WHATSAPP_URL} target="_blank" rel="noreferrer">WhatsApp <ArrowRight size={18} /></a></div></div><a className="j-footer-wordmark" href="#inicio" aria-label="Voltar ao início"><span><Image src="/images/client-logo.png" width={260} height={154} alt="" /></span><span>GESTÃO<br /><em>PARA SELLERS</em></span></a><div className="j-footer-bottom"><span>Valor IA · Gestão financeira e contábil</span><p>Atendimento especializado para sellers do Magalu</p><a href={MAIN_SITE_URL} target="_blank" rel="noreferrer">Conheça a empresa <ArrowUpRight size={12} /></a></div></footer>
    </div>
  );
}





