import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: Date): TimeLeft {
  const now = new Date().getTime();
  const diff = Math.max(0, target.getTime() - now);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function DigitBox({ value, label }: { value: number; label: string }) {
  const display = value.toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <div className="glass-card rounded-lg px-3 py-2 sm:px-4 sm:py-3 min-w-[56px] sm:min-w-[72px] text-center border border-neon/20">
          <motion.span
            key={value}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl sm:text-4xl font-bold neon-text font-mono tracking-wider block"
          >
            {display}
          </motion.span>
        </div>
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neon/50" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neon/50" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neon/50" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-neon/50" />
      </div>
      <span className="text-[10px] sm:text-[11px] text-neon/45 tracking-[0.2em] uppercase font-bold">{label}</span>
    </div>
  );
}

export function CountdownClock() {
  const [targetDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    date.setHours(0, 0, 0, 0);
    return date;
  });

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const totalSeconds = targetDate.getTime() - new Date().getTime();
  const totalTarget = 14 * 24 * 60 * 60 * 1000;
  const progress = Math.max(0, Math.min(100, ((totalTarget - totalSeconds) / totalTarget) * 100));

  return (
    <GlassCard
      title="The Countdown Clock - Mystery Prompt ETA"
      icon={<span>TMR</span>}
      variant="neon"
      delay={0.3}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="text-[11px] sm:text-xs text-neon/45 tracking-[0.14em]">
          TARGET: {targetDate.toISOString().split('T')[0]} 00:00:00 UTC
        </div>

        <div className="w-full overflow-x-auto hide-scrollbar pb-1">
          <div className="flex items-center justify-center gap-2 sm:gap-3 min-w-[320px]">
            <DigitBox value={timeLeft.days} label="Days" />
            <span className="text-2xl sm:text-3xl neon-text font-bold animate-blink mt-[-20px]">:</span>
            <DigitBox value={timeLeft.hours} label="Hours" />
            <span className="text-2xl sm:text-3xl neon-text font-bold animate-blink mt-[-20px]">:</span>
            <DigitBox value={timeLeft.minutes} label="Minutes" />
            <span className="text-2xl sm:text-3xl neon-text font-bold animate-blink mt-[-20px]">:</span>
            <DigitBox value={timeLeft.seconds} label="Seconds" />
          </div>
        </div>

        <div className="w-full space-y-1.5">
          <div className="flex justify-between text-[11px] sm:text-xs text-neon/45">
            <span>TIMELINE PROGRESS</span>
            <span className="text-neon/70">{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full h-1.5 bg-neon/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon/60 to-neon rounded-full"
              style={{ boxShadow: '0 0 8px var(--color-neon-glow)' }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] sm:text-xs">
          <div className="w-2 h-2 rounded-full bg-amber animate-pulse" style={{ boxShadow: '0 0 6px var(--color-amber-glow)' }} />
          <span className="text-amber/70 tracking-wider">AWAITING MYSTERY PROMPT DEPLOYMENT</span>
        </div>
      </div>
    </GlassCard>
  );
}
