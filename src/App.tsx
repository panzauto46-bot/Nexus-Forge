import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Radar } from './components/Radar';
import { NeuralLog } from './components/NeuralLog';
import { CountdownClock } from './components/CountdownClock';
import { KillSwitch } from './components/KillSwitch';
import { BeautyProtocol } from './components/BeautyProtocol';
import { StatusBar } from './components/StatusBar';
import { cn } from '@/utils/cn';

const THEME_STORAGE_KEY = 'nexus-forge-theme';

type Theme = 'dark' | 'light';
type SectionId = 'section-a' | 'section-b';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [activeSection, setActiveSection] = useState<SectionId>('section-a');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const sectionIds: SectionId[] = ['section-a', 'section-b'];
    const sections = sectionIds
      .map(id => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id as SectionId);
        }
      },
      {
        threshold: [0.25, 0.4, 0.7],
        rootMargin: '-20% 0px -55% 0px',
      },
    );

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-void text-[color:var(--color-text-primary)] scanlines grid-bg" id="top">
      <a href="#content-main" className="skip-link">Skip to main content</a>

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="starfield" aria-hidden="true">
          <div className="star-layer star-layer-far" />
          <div className="star-layer star-layer-near" />
          <div className="star-comet star-comet-a" />
          <div className="star-comet star-comet-b" />
        </div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-neon/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon/[0.03] rounded-full blur-[150px]" />
      </div>

      <main id="content-main" className="relative z-10 max-w-[1440px] mx-auto px-2.5 sm:px-4 lg:px-6 py-4 space-y-4">
        <nav className="section-nav" aria-label="Quick section navigation">
          <div className="section-nav-inner">
            <a
              href="#section-a"
              className="section-nav-link"
              aria-current={activeSection === 'section-a' ? 'true' : undefined}
            >
              Section A
            </a>
            <a
              href="#section-b"
              className="section-nav-link"
              aria-current={activeSection === 'section-b' ? 'true' : undefined}
            >
              Section B
            </a>
          </div>
        </nav>

        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative text-center pt-16 pb-4 sm:py-6"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-0">
            <div className="theme-toggle" role="group" aria-label="Theme switcher">
              <button
                type="button"
                onClick={() => setTheme('light')}
                aria-pressed={theme === 'light'}
                className={cn('theme-toggle-option', theme === 'light' && 'theme-toggle-option-active')}
              >
                Light
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                aria-pressed={theme === 'dark'}
                className={cn('theme-toggle-option', theme === 'dark' && 'theme-toggle-option-active')}
              >
                Dark
              </button>
            </div>
          </div>

          <div className="flex justify-center mb-3" aria-hidden="true">
            <div className="relative">
              <div className="hexagon w-14 h-14 sm:w-16 sm:h-16 bg-neon/10 flex items-center justify-center">
                <div className="hexagon w-10 h-10 sm:w-12 sm:h-12 bg-neon/20 flex items-center justify-center">
                  <span className="text-neon text-lg sm:text-xl font-bold">N</span>
                </div>
              </div>
              <div className="absolute inset-0 hexagon bg-neon/5 animate-radar-pulse" />
            </div>
          </div>

          <h1 className="font-display text-[clamp(2.6rem,10vw,6rem)] leading-none font-black tracking-[0.14em] sm:tracking-[0.18em] neon-text animate-text-flicker">
            NEXUS.FORGE
          </h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-48 sm:w-64 h-px bg-gradient-to-r from-transparent via-neon/50 to-transparent mx-auto mt-3"
          />
        </motion.header>

        <StatusBar />

        <section id="section-a" aria-labelledby="section-a-heading" className="space-y-4 scroll-mt-28">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="w-1 h-4 bg-neon rounded-full" style={{ boxShadow: '0 0 6px var(--color-neon-glow)' }} />
              <h2 id="section-a-heading" className="text-xs sm:text-base font-bold tracking-[0.08em] sm:tracking-[0.12em] text-neon/80 uppercase">
                Section A - Command Center
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-neon/20 to-transparent" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-4">
              <Radar />
            </div>
            <div className="lg:col-span-8">
              <NeuralLog />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8">
              <CountdownClock />
            </div>
            <div className="lg:col-span-4">
              <KillSwitch />
            </div>
          </div>
        </section>

        <section id="section-b" aria-labelledby="section-b-heading" className="space-y-4 scroll-mt-28">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-3 mt-4 px-1">
              <div className="w-1 h-4 bg-cyan rounded-full" style={{ boxShadow: '0 0 6px var(--color-cyan-glow)' }} />
              <h2 id="section-b-heading" className="text-xs sm:text-base font-bold tracking-[0.08em] sm:tracking-[0.12em] text-cyan/80 uppercase">
                Section B - Design Protocol
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan/20 to-transparent" />
            </div>
          </motion.div>

          <BeautyProtocol />
        </section>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center py-6 space-y-2"
        >
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-neon/20 to-transparent mx-auto" />
          <div className="text-[10px] text-neon/45 tracking-[0.2em]">
            NEXUS.FORGE COMMAND CENTER v2.1 - ALL SYSTEMS NOMINAL
          </div>
          <div className="text-[10px] text-neon/35 tracking-wider">
            CLASSIFIED // AUTHORIZED PERSONNEL ONLY
          </div>
        </motion.footer>
      </main>
    </div>
  );
}
