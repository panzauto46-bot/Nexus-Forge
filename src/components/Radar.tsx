import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './GlassCard';

export function Radar() {
  const [pingCount, setPingCount] = useState(0);
  const [status, setStatus] = useState<'scanning' | 'detected'>('scanning');
  const [blips, setBlips] = useState<{ id: number; x: number; y: number; opacity: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPingCount(prev => prev + 1);

      if (Math.random() > 0.5) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 30 + Math.random() * 55;
        setBlips(prev => [
          ...prev.slice(-4),
          {
            id: Date.now(),
            x: 50 + radius * Math.cos(angle),
            y: 50 + radius * Math.sin(angle),
            opacity: 1,
          },
        ]);
      }

      if (Math.random() > 0.9) {
        setStatus('detected');
        setTimeout(() => setStatus('scanning'), 1500);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fadeInterval = setInterval(() => {
      setBlips(prev =>
        prev
          .map(blip => ({ ...blip, opacity: blip.opacity - 0.05 }))
          .filter(blip => blip.opacity > 0),
      );
    }, 200);

    return () => clearInterval(fadeInterval);
  }, []);

  return (
    <GlassCard
      title="The Eye of Sauron - Radar Listener"
      icon={<span>RAD</span>}
      variant="neon"
      delay={0.1}
      className="h-full"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-56 h-56 sm:w-64 sm:h-64">
          {[1, 0.75, 0.5, 0.25].map((scale, index) => (
            <div
              key={index}
              className="absolute inset-0 rounded-full border border-neon/20"
              style={{ transform: `scale(${scale})` }}
            />
          ))}

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-px bg-neon/10" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-px h-full bg-neon/10" />
          </div>

          {[0, 1, 2].map(index => (
            <div
              key={`pulse-${index}`}
              className="absolute inset-0 rounded-full border border-neon/30 animate-pulse-ring"
              style={{ animationDelay: `${index * 1}s` }}
            />
          ))}

          <div className="absolute inset-0 animate-radar-sweep" style={{ transformOrigin: 'center center' }}>
            <div
              className="absolute top-1/2 left-1/2 h-px origin-left"
              style={{
                width: '50%',
                background: 'linear-gradient(90deg, var(--color-neon), transparent)',
                boxShadow: '0 0 12px var(--color-neon-glow)',
              }}
            />
            <div
              className="absolute top-1/2 left-1/2 origin-left"
              style={{
                width: '50%',
                height: '50%',
                background: 'conic-gradient(from 0deg, var(--color-neon-glow), transparent 30deg)',
                transform: 'translateY(-50%)',
              }}
            />
          </div>

          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-neon rounded-full"
            style={{ boxShadow: '0 0 12px var(--color-neon)' }}
          />

          <AnimatePresence>
            {blips.map(blip => (
              <motion.div
                key={blip.id}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 1, opacity: blip.opacity }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute w-2 h-2 bg-neon rounded-full"
                style={{
                  left: `${blip.x}%`,
                  top: `${blip.y}%`,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 8px var(--color-neon)',
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        <div className="w-full space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neon/60 tracking-wider">STATUS</span>
            <motion.span
              key={status}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className={status === 'detected' ? 'red-text font-bold' : 'neon-text'}
            >
              {status === 'detected' ? 'ALERT: SIGNAL DETECTED' : 'SCANNING...'}
            </motion.span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-neon/60 tracking-wider">API PING</span>
            <span className="text-neon font-mono">Every 3s</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-neon/60 tracking-wider">TOTAL PINGS</span>
            <motion.span
              key={pingCount}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-neon font-mono font-bold"
            >
              {pingCount.toString().padStart(6, '0')}
            </motion.span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-neon/60 tracking-wider">ENDPOINT</span>
            <span className="text-neon/80 font-mono text-[10px]">api.seedstr.io/v1/prompt</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
