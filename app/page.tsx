'use client';

import Image from 'next/image';
import { asset } from '@/lib/assets';
import { CinematicScene, DesktopCursor, ReadingProgress } from '@/components/motion-details';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ArrowRight, ArrowLeft, ArrowDown, Play, X, Menu, Crosshair, ExternalLink, Shield, Users, Youtube, Instagram } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

const maps = [
  { name: 'Erangel', terrain: 'THE ORIGINAL BATTLEGROUND', size: '8 × 8 KM', image: asset('/images/erangel.webp'), climate: 'Temperate', description: 'Where it all began. Open fields, quiet villages, and a thousand places to make your last stand. On this island, every familiar road leads to a different story.', landmark: 'Sosnovka Military Base' },
  { name: 'Miramar', terrain: 'NO PLACE TO HIDE', size: '8 × 8 KM', image: asset('/images/miramar.webp'), climate: 'Arid desert', description: 'Under a relentless sun, the desert rewards a steady hand. Navigate rugged canyons, take the high ground, and turn distance into your greatest advantage.', landmark: 'Los Leones' },
  { name: 'Sanhok', terrain: 'INTO THE WILD', size: '4 × 4 KM', image: asset('/images/sanhok.webp'), climate: 'Tropical', description: 'The jungle is alive. Move through rain-soaked ruins and dense foliage in an intimate battleground where the next encounter is always closer than you think.', landmark: 'Bootcamp' },
  { name: 'Vikendi', terrain: 'COLD GROUND. HIGH STAKES.', size: '8 × 8 KM', image: asset('/images/vikendi.webp'), climate: 'Subarctic', description: 'Leave your mark on the frozen frontier. Snow-covered forests and exposed ridgelines demand sharp instincts. Keep moving. The cold is only the beginning.', landmark: 'Cosmodrome' },
];
const weapons = [
  { name: 'M416', kind: 'ASSAULT RIFLE', ammo: '5.56 mm', range: 'Mid-range', damage: 68, stability: 86, rate: 82, description: 'Precision meets versatility. A dependable all-rounder, built to adapt to the way you play.', image: asset('/images/m416-display.webp') },
  { name: 'AKM', kind: 'ASSAULT RIFLE', ammo: '7.62 mm', range: 'Close–mid', damage: 87, stability: 55, rate: 70, description: 'Raw stopping power. Make every shot count with a hard-hitting classic that commands respect.', image: asset('/images/akm.webp') },
  { name: 'AWM', kind: 'SNIPER RIFLE', ammo: '.300 Magnum', range: 'Long-range', damage: 100, stability: 72, rate: 22, description: 'One opportunity. One shot. A rare airdrop weapon for the moments that decide everything.', image: asset('/images/awm.webp') },
];
const news = [
  { category: 'BATTLEGROUNDS GUIDE', title: 'Your first drop starts here.', image: asset('/images/erangel.webp'), text: 'Learn the essentials before your boots hit the ground. Pick a quieter landing spot, secure a weapon and armor, and keep an eye on the next safe zone. Survival starts with the decisions you make before your first encounter.', link: 'https://pubg.com/en/game-info/overview' },
  { category: 'GAMEPLAY', title: 'A battleground for every playstyle.', image: asset('/images/miramar.webp'), text: 'From the open sightlines of Miramar to the dense canopy of Sanhok, every battleground changes the way you play. Explore the terrain, learn the rotations, and find the place that brings out your best.', link: 'https://pubg.com/en/game-info/maps' },
  { category: 'OFFICIAL UPDATES', title: 'The next chapter is always loading.', image: asset('/images/vikendi.webp'), text: 'The battlegrounds never stand still. Visit the official PUBG news hub for the latest patch notes, live events, announcements, and development updates, straight from the team.', link: 'https://pubg.com/en/news' },
];
type Modal = { type: 'play' } | { type: 'trailer' } | { type: 'map'; index: number } | { type: 'news'; index: number } | null;
const navItems = [['HOME', '#home'], ['GAME', '#game'], ['MAPS', '#maps'], ['ARSENAL', '#arsenal'], ['NEWS', '#news']];

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: reduced ? 0 : .75, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}
function Wordmark({ footer = false }: { footer?: boolean }) {
  return <a className={`wordmark ${footer ? 'footer-wordmark' : ''}`} href="#home" aria-label="PUBG Battlegrounds home"><span>PUBG</span><small>BATTLEGROUNDS</small></a>;
}
function SteamIcon() { return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-9.8 12l5.3 2.2a3 3 0 0 1 2.7-.5l2.3-3.4v-.2a4.2 4.2 0 1 1 4.2 4.2h-.2l-3.5 2.4a3.1 3.1 0 0 1-5.9.6L3.6 18A10 10 0 1 0 12 2Zm-2 14.8a1.9 1.9 0 0 0-.7.1l1.2.5a1.4 1.4 0 0 1-1.1 2.6L8.2 19a2 2 0 1 0 1.8-2.2Zm6.7-7.4a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4Zm0 .7a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"/></svg>; }

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [activeNav, setActiveNav] = useState('#home');
  const [activeWeapon, setActiveWeapon] = useState(0);
  const [modal, setModal] = useState<Modal>(null);
  const modalOpen = Boolean(modal);
  const heroRef = useRef<HTMLElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const weapon = weapons[activeWeapon];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    const observer = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) setActiveNav(`#${e.target.id}`); }), { rootMargin: '-20% 0px -55% 0px' });
    ['home','game','maps','arsenal','news'].forEach(id => { const el = document.getElementById(id); if(el) observer.observe(el); });
    return () => { window.removeEventListener('scroll', onScroll); observer.disconnect(); };
  }, []);
  useEffect(() => {
    if(!modalOpen) return;
    triggerRef.current = document.activeElement as HTMLElement;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => modalRef.current?.querySelector<HTMLButtonElement>('button')?.focus(), 60);
    const key = (e: KeyboardEvent) => {
      if(e.key === 'Escape') setModal(null);
      if(e.key === 'Tab') {
        const elements = modalRef.current?.querySelectorAll<HTMLElement>('a[href], button, iframe, [tabindex="0"]');
        if(!elements?.length) return;
        const first = elements[0], last = elements[elements.length - 1];
        if(e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if(!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', key);
    return () => { clearTimeout(timer); document.body.style.overflow = previous; document.removeEventListener('keydown', key); triggerRef.current?.focus(); };
  }, [modalOpen]);
  useEffect(() => {
    if(reduced || !window.matchMedia('(pointer: fine)').matches) return;
    const cleanups: (() => void)[] = [];
    document.querySelectorAll<HTMLElement>('.button').forEach(button => {
      const move = (event: MouseEvent) => {
        const box = button.getBoundingClientRect();
        const x = Math.max(-5, Math.min(5, (event.clientX - box.left - box.width / 2) * .07));
        const y = Math.max(-4, Math.min(4, (event.clientY - box.top - box.height / 2) * .12));
        button.style.transform = `translate3d(${x}px, ${y - 2}px, 0)`;
      };
      const reset = () => { button.style.transform = ''; };
      button.addEventListener('mousemove', move);
      button.addEventListener('mouseleave', reset);
      cleanups.push(() => { button.removeEventListener('mousemove', move); button.removeEventListener('mouseleave', reset); });
    });
    return () => cleanups.forEach(cleanup => cleanup());
  }, [reduced, modalOpen]);
  const moveHero = (e: React.MouseEvent<HTMLElement>) => {
    if(reduced || !window.matchMedia('(pointer: fine)').matches) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    heroRef.current?.style.setProperty('--mouse-x', `${(e.clientX / bounds.width - .5) * 14}px`);
    heroRef.current?.style.setProperty('--mouse-y', `${((e.clientY - bounds.top) / bounds.height - .5) * 10}px`);
  };

  return <>
    <a className="skip-link" href="#game">Skip to content</a>
    <DesktopCursor/>
    <ReadingProgress/>
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <Wordmark />
      <nav className="desktop-nav" aria-label="Main navigation">{navItems.map(([label, href]) => <a key={href} href={href} aria-current={activeNav === href ? 'location' : undefined} className={activeNav === href ? 'active' : ''}>{label}</a>)}</nav>
      <div className="nav-actions"><button className="button button-yellow nav-play" onClick={() => setModal({ type: 'play' })}>PLAY NOW <ArrowUpRight size={16} /></button><button className="menu-toggle icon-button" aria-label={mobileNav ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileNav} onClick={() => setMobileNav(!mobileNav)}>{mobileNav ? <X/> : <Menu/>}</button></div>
    </header>
    <AnimatePresence>{mobileNav && <motion.nav className="mobile-nav" initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} aria-label="Mobile navigation">{navItems.map(([label, href], i) => <a key={href} href={href} onClick={() => setMobileNav(false)}><span>0{i + 1}</span>{label}<ArrowUpRight size={22}/></a>)}</motion.nav>}</AnimatePresence>

    <main>
      <section id="home" className="hero" ref={heroRef} onMouseMove={moveHero} onMouseLeave={() => { heroRef.current?.style.setProperty('--mouse-x','0px'); heroRef.current?.style.setProperty('--mouse-y','0px'); }}>
        <div className="hero-image"><Image src={asset('/images/hero.webp')} alt="Helmeted battlegrounds survivor overlooking a smoke-filled landscape at sunset" fill priority sizes="100vw" quality={90}/></div>
        <div className="hero-shade"/><div className="grain"/>
        <div className="hero-content page-width">
          <motion.div className="eyebrow hero-eyebrow" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduced ? 0 : .2, duration: .8 }}><span className="status-dot"/> THE ORIGINAL BATTLE ROYALE <span className="eyebrow-line"/></motion.div>
          <h1 aria-label="Winner winner chicken dinner.">{['WINNER WINNER', 'CHICKEN DINNER.'].map((line, i) => <span className="headline-mask" key={line}><motion.span className={i === 1 ? 'yellow' : ''} initial={reduced ? false : { y: '105%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: reduced ? 0 : .95, delay: .25 + i * .13, ease: [.22,1,.36,1] }}>{line}</motion.span></span>)}</h1>
          <motion.div initial={reduced ? false : { opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .75, duration: .8 }}><p className="hero-subtitle">Survive. Adapt. Conquer.</p><p className="hero-description">One battleground. A hundred stories.<br/>Only one way to become the last one standing.</p><div className="hero-buttons"><a href="#game" className="button button-yellow">EXPLORE THE GAME <ArrowUpRight size={18}/></a><button className="button button-trailer" onClick={() => setModal({ type: 'trailer' })}><span className="play-circle"><Play size={12} fill="currentColor"/></span> WATCH TRAILER</button></div></motion.div>
        </div>
        <div className="hero-side-note"><span>EST. 2017</span><span className="side-line"/> REDEFINING SURVIVAL</div>
        <div className="hero-bottom page-width"><a href="#game" className="scroll-cue"><span className="scroll-box"><ArrowDown size={14}/></span> SCROLL TO EXPLORE</a><div className="hero-coordinates">36°17′ N <span>/</span> 59°36′ E</div><span className="hero-edition"><span className="status-dot"/> FREE TO PLAY. BUILT TO SURVIVE.</span></div>
      </section>

      <div className="platform-strip"><span>DROP IN. FOR FREE.</span><div className="platform-links"><button onClick={() => setModal({ type: 'play' })}><SteamIcon/><span>STEAM</span></button><span className="platform-divider"/><button onClick={() => setModal({ type: 'play' })}><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 2v16l4 1.3V5.9c0-.7.3-1.2.9-1 .8.2 1.1.9 1.1 1.8v5.2c2.5 1.2 4.5 0 4.5-3.2 0-3.3-1.2-4.8-4.8-6C13.4 2.3 11.1 1.8 9 2ZM4 16l-3 1.1c-1.7.6-2 1.9-.5 2.5 1.4.6 3.5.7 5 .2l2.5-.9v-2.2l-2.5.9c-.6.2-1.2.2-1.5 0-.3-.1-.2-.4.2-.5L8 15.7v-2.2Zm10 3.2 6-2.1c.6-.2 1.2-.2 1.5 0 .3.1.2.4-.2.5L14 20.1v2.1l8.5-3c1.7-.6 2-1.9.5-2.5-1.4-.6-3.5-.7-5-.2l-4 1.4Z" transform="translate(1 0) scale(.9)"/></svg><span>PlayStation®</span></button><span className="platform-divider"/><button onClick={() => setModal({ type: 'play' })}><span className="xbox-symbol">X</span><span>XBOX</span></button></div><span className="platform-end">YOUR NEXT CHAPTER STARTS HERE <ArrowUpRight size={14}/></span></div>

      <section id="game" className="about-section page-width section-space">
        <Reveal><div className="section-label"><span className="label-index">01 /</span> THIS IS BATTLEGROUNDS <Crosshair size={15}/></div></Reveal>
        <div className="about-grid"><Reveal><h2>EVERY DROP.<br/>A <span className="text-muted">NEW STORY.</span></h2></Reveal><Reveal delay={.12} className="about-copy"><p>Not just a game.<br/>A test of who you become.</p><div>Drop into a world where every decision matters. Gear up, trust your instincts, and outplay the unexpected. From the first jump to the final circle, your story is yours to write.</div><a href="#maps" className="text-link">FIND YOUR BATTLEGROUND <ArrowUpRight size={17}/></a></Reveal></div>
        <Reveal className="stat-row"><div><strong>100</strong><span>PLAYERS. ONE GOAL.</span></div><div><strong>01</strong><span>LAST ONE STANDING.</span></div><div><strong>∞</strong><span>WAYS TO MAKE IT YOURS.</span></div><Crosshair className="stat-crosshair" size={44} strokeWidth={.7}/></Reveal>
      </section>

      <section id="maps" className="maps-section section-space">
        <div className="page-width"><Reveal><div className="section-label"><span className="label-index">02 /</span> CHOOSE YOUR GROUND <span className="section-label-right">FOUR WORLDS. NO SECOND CHANCES.</span></div><div className="section-heading"><h2>THE BATTLEGROUNDS<span className="yellow">.</span></h2><span className="heading-note">Different terrain. Same instinct.<br/>Survive them all.</span></div></Reveal>
          <div className="map-grid">{maps.map((map, i) => <Reveal key={map.name} delay={i * .07}><button className="map-card" onClick={() => setModal({ type: 'map', index: i })} aria-label={`Explore ${map.name}`}><motion.div className="map-photo" initial={reduced ? false : { clipPath: 'inset(0 0 100% 0)' }} whileInView={{ clipPath: 'inset(0 0 0% 0)' }} viewport={{ once: true, amount: .15 }} transition={{ duration: 1.05, delay: i * .07, ease: [.22,1,.36,1] }}><Image src={map.image} alt={`${map.name} battleground landscape`} fill sizes="(max-width: 600px) 84vw, (max-width: 950px) 45vw, 30vw"/></motion.div><div className="map-overlay"/><span className="map-number">0{i + 1} <span>/ {map.size}</span></span><span className="map-card-content"><span className="map-terrain">{map.terrain}</span><span className="map-name">{map.name.toUpperCase()}<span className="map-arrow"><ArrowUpRight size={21}/></span></span><span className="map-discover">EXPLORE THE MAP <ArrowRight size={14}/></span></span></button></Reveal>)}</div>
          <div className="maps-footnote"><span><span className="status-dot"/> EVERY LANDING IS A NEW BEGINNING.</span><span>EXPLORE. ADAPT. OWN THE TERRAIN.</span></div>
        </div>
      </section>

      <section id="arsenal" className="arsenal-section section-space page-width">
        <Reveal><div className="section-label"><span className="label-index">03 /</span> TOOLS OF SURVIVAL <Crosshair size={15}/></div><div className="section-heading"><h2>FIND YOUR <span className="text-muted">EDGE.</span></h2><p className="heading-note">The right weapon. The right moment.<br/>Make every shot a statement.</p></div></Reveal>
        <Reveal><div className="arsenal-showcase"><div className="weapon-tabs" role="tablist" aria-label="Select a weapon">{weapons.map((w,i) => <button id={`weapon-tab-${i}`} role="tab" aria-selected={activeWeapon === i} aria-controls="weapon-panel" tabIndex={activeWeapon === i ? 0 : -1} onKeyDown={e => { if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)) { e.preventDefault(); const next = e.key === 'Home' ? 0 : e.key === 'End' ? weapons.length - 1 : (activeWeapon + (e.key === 'ArrowRight' ? 1 : -1) + weapons.length) % weapons.length; setActiveWeapon(next); document.getElementById(`weapon-tab-${next}`)?.focus(); } }} key={w.name} className={activeWeapon === i ? 'selected' : ''} onClick={() => setActiveWeapon(i)}><span>0{i + 1}</span>{w.name}<span className="weapon-tab-kind">{w.kind}</span></button>)}</div><div className="weapon-content" id="weapon-panel" role="tabpanel" aria-labelledby={`weapon-tab-${activeWeapon}`}><div className="weapon-visual"><span className="weapon-visual-label"><Crosshair size={14}/> FIELD-TESTED. BATTLE-READY.</span><span className="weapon-watermark" aria-hidden="true">{weapon.name}</span><AnimatePresence mode="wait"><motion.div className="weapon-image" data-drag="true" key={weapon.name} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={.12} onDragEnd={(_, info) => { if(Math.abs(info.offset.x) > 45) setActiveWeapon(current => (current + (info.offset.x < 0 ? 1 : -1) + weapons.length) % weapons.length); }} initial={{ opacity: 0, x: reduced ? 0 : 35 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduced ? 0 : -35 }} transition={{ duration: .3 }}><Image src={weapon.image} alt={`${weapon.name} ${weapon.kind.toLowerCase()}, full side profile`} fill sizes="(max-width: 760px) 90vw, 60vw" draggable={false}/></motion.div></AnimatePresence><span className="weapon-caliber">{weapon.ammo} <span>/</span> {weapon.range.toUpperCase()}</span></div><div className="weapon-info" aria-live="polite" aria-atomic="true"><span className="eyebrow yellow">{weapon.kind}</span><h3>{weapon.name}</h3><p>{weapon.description}</p><div className="weapon-stats">{[['DAMAGE',weapon.damage],['STABILITY',weapon.stability],['FIRE RATE',weapon.rate]].map(([label,value]) => <div key={label}><div><span>{label}</span><span>{value}<span className="stat-max"> / 100</span></span></div><div className="stat-track"><motion.span animate={{ width: `${value}%` }} transition={{ duration: reduced ? 0 : .6 }}/></div></div>)}</div><span className="stat-disclaimer">Relative showcase ratings, not in-game damage values.</span></div></div><div className="weapon-bottom"><span className="weapon-swipe-hint">SWIPE TO FIND YOUR EDGE <ArrowRight size={12}/></span><div><span>0{activeWeapon + 1} <span className="text-muted">/ 03</span></span><button className="icon-button" onClick={() => setActiveWeapon((activeWeapon + 2) % 3)} aria-label="Previous weapon"><ArrowLeft size={18}/></button><button className="icon-button" onClick={() => setActiveWeapon((activeWeapon + 1) % 3)} aria-label="Next weapon"><ArrowRight size={18}/></button></div></div></div></Reveal>
      </section>

      <CinematicScene image={<Image src={asset('/images/experience.webp')} alt="A squad of survivors approaches a smoke-filled village as the last light fades" fill sizes="(max-width: 700px) 1200px, 100vw" className="experience-image"/>}><div className="page-width experience-content"><Reveal><div className="section-label"><span className="label-index">04 /</span> MORE THAN SURVIVAL</div><h2>THE SILENCE.<br/>THE TENSION.<br/><span className="yellow">THE LAST CIRCLE.</span></h2><p>Some moments can’t be explained.<br/>They have to be survived.</p><button className="text-link" onClick={() => setModal({ type: 'trailer' })}><span className="play-circle"><Play size={11} fill="currentColor"/></span> FEEL THE BATTLEGROUNDS <ArrowUpRight size={17}/></button></Reveal><span className="experience-note">NOTHING ELSE COMES CLOSE.</span></div><div className="scene-caption page-width"><span><span className="status-dot"/> IN THE FIELD / AFTER THE DROP</span><span>STAY TOGETHER. STAY ALIVE.</span></div></CinematicScene>

      <section id="news" className="news-section section-space page-width"><Reveal><div className="section-label"><span className="label-index">05 /</span> FROM THE BATTLEGROUNDS</div><div className="section-heading"><h2>STAY IN <span className="text-muted">THE KNOW.</span></h2><a className="text-link news-all" href="https://pubg.com/en/news" target="_blank" rel="noreferrer">ALL OFFICIAL UPDATES <ArrowUpRight size={17}/></a></div></Reveal><div className="news-grid">{news.map((item,i) => <Reveal key={item.title} delay={i * .08}><button className="news-card" onClick={() => setModal({ type: 'news', index: i })}><div className="news-image"><Image src={item.image} alt={i === 0 ? 'Green countryside and abandoned buildings on Erangel' : i === 1 ? 'Sunlit desert landscape in Miramar' : 'Snow-covered Vikendi landscape'} fill sizes="(max-width: 760px) 90vw, 30vw"/><span className="news-image-arrow"><ArrowUpRight size={22}/></span></div><div className="news-meta"><span>{item.category}</span><span>0{i + 1}</span></div><h3>{item.title}</h3><span className="news-read">READ THE STORY <ArrowRight size={14}/></span></button></Reveal>)}</div></section>

      <section className="final-cta page-width"><Reveal><span className="eyebrow">YOUR STORY IS WAITING.</span><h2>SEE YOU ON THE<br/><span className="yellow">BATTLEGROUNDS.</span></h2><button className="button button-yellow" onClick={() => setModal({ type: 'play' })}>DROP IN. PLAY FREE. <ArrowUpRight size={19}/></button><div className="cta-note"><Shield size={13}/> NO PURCHASE REQUIRED. JUST THE WILL TO SURVIVE.</div></Reveal><Crosshair className="cta-crosshair" strokeWidth={.3} aria-hidden="true"/></section>
    </main>
    <footer className="site-footer page-width"><div className="footer-main"><Wordmark footer/><p>Every drop is a beginning.<br/>Make yours count.</p><div className="footer-nav"><a href="#game">THE GAME</a><a href="#maps">BATTLEGROUNDS</a><a href="#arsenal">ARSENAL</a><a href="#news">NEWS & STORIES</a></div><div className="footer-socials"><a href="https://www.youtube.com/@PUBG" target="_blank" rel="noreferrer" aria-label="PUBG on YouTube"><Youtube size={20}/></a><a href="https://www.instagram.com/pubg_battlegrounds/" target="_blank" rel="noreferrer" aria-label="PUBG on Instagram"><Instagram size={19}/></a><a href="https://x.com/PUBG" target="_blank" rel="noreferrer" aria-label="PUBG on X"><span className="social-x">𝕏</span></a><a href="https://discord.com/invite/battlegrounds" target="_blank" rel="noreferrer" aria-label="PUBG on Discord"><Users size={20}/></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} PUBG: BATTLEGROUNDS FAN EXPERIENCE.</span><span>INDEPENDENT CONCEPT. NOT AFFILIATED WITH KRAFTON, INC.</span><a href="#home">BACK TO TOP <ArrowUpRight size={13}/></a></div></footer>

    <AnimatePresence>{modal && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={e => {if(e.target === e.currentTarget) setModal(null);}}><motion.div className={`modal ${modal.type === 'trailer' ? 'trailer-modal' : ''} ${modal.type === 'map' ? 'map-modal' : ''}`} ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="modal-title" initial={{ opacity: 0, y: reduced ? 0 : 25, scale: reduced ? 1 : .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduced ? 0 : 15 }} transition={{ duration: .25 }}><button className="modal-close icon-button" onClick={() => setModal(null)} aria-label="Close dialog"><X size={23}/></button>
      {modal.type === 'play' && <div className="play-modal-content"><span className="eyebrow yellow">THE BATTLEGROUNDS ARE CALLING.</span><h2 id="modal-title">CHOOSE YOUR<br/>PLATFORM<span className="yellow">.</span></h2><p>Same adrenaline. Your way to play.<br/>Get PUBG: BATTLEGROUNDS for free.</p><div className="platform-options">{[['STEAM', 'PC', 'https://store.steampowered.com/app/578080/PUBG_BATTLEGROUNDS/'],['PLAYSTATION', 'PS4 · PS5', 'https://www.playstation.com/en-us/games/pubg-battlegrounds/'],['XBOX', 'XBOX ONE · SERIES X|S', 'https://www.xbox.com/en-US/games/pubg']].map(([name, detail, href]) => <a key={name} href={href} target="_blank" rel="noreferrer"><div><strong>{name}</strong><span>{detail}</span></div><ArrowUpRight size={22}/></a>)}</div><span className="modal-fine-print">Opens the official platform store in a new tab.</span></div>}
      {modal.type === 'trailer' && <><div className="trailer-top"><span className="eyebrow yellow">THE ORIGINAL BATTLE ROYALE</span><h2 id="modal-title">THIS IS BATTLEGROUNDS.</h2></div><div className="trailer-frame"><iframe src="https://www.youtube-nocookie.com/embed/hfjazBN0DwA?autoplay=1&rel=0&mute=1" title="PUBG: BATTLEGROUNDS official trailer" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/></div><div className="trailer-foot"><span>SURVIVE. ADAPT. CONQUER.</span><a href="https://www.youtube.com/@PUBG/videos" target="_blank" rel="noreferrer">MORE OFFICIAL TRAILERS <ExternalLink size={13}/></a></div></>}
      {modal.type === 'map' && <><div className="map-modal-image"><AnimatePresence initial={false}><motion.div className="map-modal-image-layer" key={modal.index} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .45 }}><Image src={maps[modal.index].image} alt={`${maps[modal.index].name} landscape`} fill sizes="(max-width: 700px) 95vw, 50vw"/></motion.div></AnimatePresence></div><motion.div className="map-modal-body" initial={reduced ? false : { opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .4 }}><span className="eyebrow yellow">{maps[modal.index].terrain}</span><motion.h2 id="modal-title" key={`map-heading-${modal.index}`} initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}>{maps[modal.index].name.toUpperCase()}<span className="yellow">.</span></motion.h2><p>{maps[modal.index].description}</p><div className="map-details"><div><span>AREA</span><strong>{maps[modal.index].size}</strong></div><div><span>CLIMATE</span><strong>{maps[modal.index].climate}</strong></div><div><span>LANDMARK</span><strong>{maps[modal.index].landmark}</strong></div></div><button className="button button-yellow" onClick={() => setModal({ type: 'play' })}>MAKE YOUR FIRST DROP <ArrowUpRight size={17}/></button><div className="modal-map-navigation"><button className="text-link" onClick={() => setModal({ type: 'map', index: (modal.index + 3) % 4 })}><ArrowLeft size={15}/> PREVIOUS</button><button className="text-link" onClick={() => setModal({ type: 'map', index: (modal.index + 1) % 4 })}>NEXT MAP <ArrowRight size={15}/></button></div></motion.div></>}
      {modal.type === 'news' && <><div className="article-image"><Image src={news[modal.index].image} alt="Battleground landscape" fill sizes="(max-width: 700px) 95vw, 700px"/></div><div className="article-body"><span className="eyebrow yellow">{news[modal.index].category}</span><h2 id="modal-title">{news[modal.index].title}</h2><p>{news[modal.index].text}</p><a className="button button-yellow" href={news[modal.index].link} target="_blank" rel="noreferrer">EXPLORE OFFICIAL PUBG <ArrowUpRight size={17}/></a><span className="modal-fine-print">Editorial introduction · Independent fan experience</span></div></>}
    </motion.div></motion.div>}</AnimatePresence>
  </>;
}
