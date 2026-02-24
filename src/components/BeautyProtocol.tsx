import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';

const COLOR_PALETTE = [
  { name: 'Obsidian Base', dark: '#0B111B', light: '#EBF1FB' },
  { name: 'Mist Surface', dark: '#151F2F', light: '#FFFFFF' },
  { name: 'Mint Accent', dark: '#8FE7CF', light: '#1F7A66' },
  { name: 'Sapphire Accent', dark: '#86BAFF', light: '#285EA7' },
  { name: 'Signal Red', dark: '#FF728A', light: '#C2465D' },
  { name: 'Warning Amber', dark: '#FFBF66', light: '#B3701A' },
];

const ANIMATIONS = [
  { name: 'fadeIn', label: 'Fade In', config: '{ opacity: [0, 1], duration: 0.5 }' },
  { name: 'slideUp', label: 'Slide Up', config: '{ y: [30, 0], opacity: [0, 1] }' },
  { name: 'slideRight', label: 'Slide Right', config: '{ x: [-30, 0], opacity: [0, 1] }' },
  { name: 'bounce', label: 'Bounce', config: '{ scale: [0.3, 1.05, 1] }' },
  { name: 'scaleIn', label: 'Scale In', config: '{ scale: [0, 1], opacity: [0, 1] }' },
  { name: 'rotateIn', label: 'Rotate In', config: '{ rotate: [-180, 0], opacity: [0, 1] }' },
];

const COMPONENTS = [
  { name: 'GlassCard', count: 3 },
  { name: 'NeonButton', count: 4 },
  { name: 'RadarWidget', count: 1 },
  { name: 'TerminalLog', count: 1 },
  { name: 'CountdownTimer', count: 1 },
  { name: 'DataTable', count: 2 },
  { name: 'ChartDisplay', count: 3 },
  { name: 'ModalOverlay', count: 2 },
  { name: 'NavBar', count: 2 },
  { name: 'FormInput', count: 5 },
  { name: 'StatusBadge', count: 6 },
  { name: 'HeroSection', count: 3 },
];

export function BeautyProtocol() {
  const [activeTab, setActiveTab] = useState<'glass' | 'motion' | 'palette'>('glass');
  const [demoAnim, setDemoAnim] = useState<string | null>(null);

  const tabs = [
    { id: 'glass' as const, label: 'MATERIAL', icon: 'MAT' },
    { id: 'motion' as const, label: 'MOTION', icon: 'MTN' },
    { id: 'palette' as const, label: 'PALETTE', icon: 'CLR' },
  ];

  const animationVariants: Record<string, { initial: Record<string, number | number[]>; animate: Record<string, number | number[]> }> = {
    fadeIn: { initial: { opacity: 0 }, animate: { opacity: 1 } },
    slideUp: { initial: { y: 30, opacity: 0 }, animate: { y: 0, opacity: 1 } },
    slideRight: { initial: { x: -30, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    bounce: { initial: { scale: 0.3 }, animate: { scale: 1 } },
    scaleIn: { initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 } },
    rotateIn: { initial: { rotate: -180, opacity: 0 }, animate: { rotate: 0, opacity: 1 } },
  };

  const tabPanelId = `${activeTab}-panel`;

  return (
    <GlassCard
      title="Design Protocol - Material UX Toolkit"
      icon={<span>ART</span>}
      variant="cyan"
      delay={0.5}
    >
      <div className="material-surface protocol-tabs flex gap-1 mb-4 p-1 rounded-lg" role="tablist" aria-label="Design protocol tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            id={`${tab.id}-tab`}
            aria-controls={`${tab.id}-panel`}
            aria-selected={activeTab === tab.id}
            className={`
              protocol-tab-btn flex-1 py-2 px-2 rounded-md text-xs sm:text-sm font-semibold tracking-[0.08em] transition-all duration-300 cursor-pointer
              ${activeTab === tab.id
                ? 'bg-cyan/15 text-cyan border border-cyan/30 shadow-[0_0_10px_rgba(40,94,167,0.2)]'
                : 'text-cyan/40 hover:text-cyan/60 border border-transparent'
              }
            `}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        role="tabpanel"
        id={tabPanelId}
        aria-labelledby={`${activeTab}-tab`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'glass' && (
          <div className="space-y-4">
            <div className="text-[11px] sm:text-xs text-cyan/55 tracking-[0.1em] mb-3">
              Premium material surfaces with controlled depth and spacing discipline.
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="glass-card rounded-lg p-3 border border-neon/20 text-center">
                <div className="text-neon text-xs mb-1">M1</div>
                <div className="text-[10px] text-neon/65">Primary Surface</div>
              </div>
              <div className="glass-card-cyan rounded-lg p-3 border border-cyan/20 text-center">
                <div className="text-cyan text-xs mb-1">M2</div>
                <div className="text-[10px] text-cyan/65">Info Surface</div>
              </div>
              <div className="glass-card rounded-lg p-3 border border-red/20 text-center col-span-2 sm:col-span-1">
                <div className="text-red text-xs mb-1">M3</div>
                <div className="text-[10px] text-red/65">Alert Surface</div>
              </div>
            </div>

            <div className="material-surface-strong rounded-lg p-3">
              <div className="text-[11px] sm:text-xs text-cyan/50 tracking-[0.1em] mb-2">COMPONENT INVENTORY ({COMPONENTS.length} PREFABS)</div>
              <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto terminal-scroll">
                {COMPONENTS.map((component, index) => (
                  <motion.div
                    key={component.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-2 py-1 px-2 rounded text-[11px]"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-neon" style={{ boxShadow: '0 0 4px var(--color-neon)' }} />
                    <span className="text-neon/70">{component.name}</span>
                    <span className="text-neon/30 ml-auto">x{component.count}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="material-surface rounded-lg p-3 font-mono text-[11px] sm:text-xs">
              <div className="text-cyan/45 mb-1">/* Material surface foundation */</div>
              <div className="text-neon/60">backdrop-filter: <span className="text-cyan">blur(22px) saturate(130%)</span>;</div>
              <div className="text-neon/60">background: <span className="text-cyan">var(--color-glass-bg)</span>;</div>
              <div className="text-neon/60">border: <span className="text-cyan">1px solid var(--color-glass-border)</span>;</div>
              <div className="text-neon/60">box-shadow: <span className="text-cyan">var(--shadow-material)</span>;</div>
            </div>
          </div>
        )}

        {activeTab === 'motion' && (
          <div className="space-y-4">
            <div className="text-[11px] sm:text-xs text-cyan/55 tracking-[0.1em] mb-3">
              Motion library with {ANIMATIONS.length} reusable transition patterns.
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ANIMATIONS.map(animation => (
                <motion.button
                  key={animation.name}
                  type="button"
                  onClick={() => setDemoAnim(demoAnim === animation.name ? null : animation.name)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`
                    rounded-lg p-3 text-center transition-all duration-300 border cursor-pointer
                    ${demoAnim === animation.name
                      ? 'bg-cyan/15 border-cyan/40 shadow-[0_0_15px_rgba(40,94,167,0.2)]'
                      : 'material-surface border-cyan/10 hover:border-cyan/25'
                    }
                  `}
                >
                  <div className="text-xs text-cyan font-bold mb-1">{animation.label}</div>
                  <div className="text-[10px] text-cyan/35 font-mono">{animation.config}</div>
                </motion.button>
              ))}
            </div>

            {demoAnim && (
              <div className="material-surface rounded-lg p-4 flex flex-col items-center gap-3">
                <div className="text-[11px] sm:text-xs text-cyan/45 tracking-[0.1em]">ANIMATION PREVIEW</div>
                <motion.div
                  key={demoAnim + Date.now()}
                  initial={animationVariants[demoAnim]?.initial}
                  animate={animationVariants[demoAnim]?.animate}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-card-cyan rounded-lg px-6 py-4 text-cyan text-sm font-bold"
                >
                  {demoAnim.toUpperCase()}
                </motion.div>
                <button
                  type="button"
                  onClick={() => setDemoAnim(prev => (prev ? prev : null))}
                  className="text-[10px] text-cyan/45 hover:text-cyan/65 cursor-pointer tracking-[0.08em]"
                >
                  REPLAY PREVIEW
                </button>
              </div>
            )}

            <div className="material-surface rounded-lg p-3 font-mono text-[11px] sm:text-xs">
              <div className="text-cyan/45 mb-1">{'// Standard animation setup'}</div>
              <div className="text-neon/60">
                {'<'}<span className="text-cyan">motion.div</span>{' '}
                <span className="text-amber">initial</span>={'{{ opacity: 0, y: 30 }}'}
              </div>
              <div className="text-neon/60 pl-4">
                <span className="text-amber">animate</span>={'{{ opacity: 1, y: 0 }}'}
              </div>
              <div className="text-neon/60 pl-4">
                <span className="text-amber">transition</span>={'{{ duration: 0.6 }}'}
              </div>
              <div className="text-neon/60">{'>'}</div>
            </div>
          </div>
        )}

        {activeTab === 'palette' && (
          <div className="space-y-4">
            <div className="text-[11px] sm:text-xs text-cyan/55 tracking-[0.1em] mb-3">
              Color token system with adaptive values for light and dark modes.
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COLOR_PALETTE.map((color, index) => (
                <motion.div
                  key={color.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="material-surface rounded-lg p-2"
                >
                  <div className="flex gap-1 mb-2">
                    <div className="h-10 flex-1 rounded-md border border-[color:var(--color-border-soft)]" style={{ backgroundColor: color.dark }} />
                    <div className="h-10 flex-1 rounded-md border border-[color:var(--color-border-soft)]" style={{ backgroundColor: color.light }} />
                  </div>
                  <div className="text-[10px] text-cyan/75 font-bold">{color.name}</div>
                  <div className="text-[10px] text-cyan/35 font-mono">D: {color.dark}</div>
                  <div className="text-[10px] text-cyan/35 font-mono">L: {color.light}</div>
                </motion.div>
              ))}
            </div>

            <div className="material-surface rounded-lg p-3 space-y-2">
              <div className="text-[11px] sm:text-xs text-cyan/45 tracking-[0.1em] mb-2">ENFORCEMENT RULES</div>
              {[
                'Use semantic tokens only, avoid hardcoded hex in components.',
                'Light mode and dark mode must share the same spacing and hierarchy.',
                'Glass surfaces need readable contrast in both modes.',
                'Accent colors are reserved for status and interaction cues.',
                'Motion should clarify structure, not distract from content.',
                'Interactive controls preserve keyboard and pointer focus states.',
              ].map((rule, index) => (
                <div key={index} className="flex items-start gap-2 text-[11px] sm:text-xs">
                  <span className="text-neon shrink-0 mt-0.5">+</span>
                  <span className="text-cyan/60">{rule}</span>
                </div>
              ))}
            </div>

            <div className="material-surface rounded-lg p-3 text-center">
              <div className="text-[11px] sm:text-xs text-cyan/45 tracking-[0.1em] mb-2">BRAND CONSISTENCY SCORE</div>
              <div className="text-3xl font-bold neon-text">100%</div>
              <div className="text-[10px] text-neon/45 mt-1">THEME TOKENS SYNCHRONIZED</div>
            </div>
          </div>
        )}
      </motion.div>
    </GlassCard>
  );
}
