'use client';

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';

/** Motion values update the cursor without rendering the page on every pointer event. */
export function DesktopCursor() {
  const reduced = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 440, damping: 35, mass: .35 });
  const springY = useSpring(y, { stiffness: 440, damping: 35, mass: .35 });
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const finePointer = window.matchMedia('(pointer: fine)');
    const move = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType === 'touch') return;
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
      setHovered(Boolean((event.target as HTMLElement).closest('a,button,[data-drag]')));
    };
    const hide = () => setVisible(false);
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
    };
  }, [reduced, x, y]);

  return <motion.div className={`custom-cursor ${hovered ? 'is-hover' : ''}`} style={{ x: springX, y: springY }} animate={{ opacity: visible && !reduced ? 1 : 0 }} transition={{ duration: .18 }} aria-hidden="true"><span/></motion.div>;
}

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div className="reading-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true"/>;
}

/** Section-scoped parallax uses transforms only and stops when reduced motion is enabled. */
export function CinematicScene({ image, children }: { image: ReactNode; children: ReactNode }) {
  const target = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-48, 48]);
  return <section ref={target} className="experience-section"><motion.div className="experience-parallax" style={{ y: reduced ? 0 : y }}>{image}</motion.div><div className="experience-shade"/>{children}</section>;
}
