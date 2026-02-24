import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function StatusBar() {
  const [time, setTime] = useState(new Date());
  const [cpuLoad, setCpuLoad] = useState(3);
  const [memUsage, setMemUsage] = useState(47);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      setCpuLoad(Math.round(2 + Math.random() * 8));
      setMemUsage(Math.round(40 + Math.random() * 20));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="status"
      aria-live="polite"
      className="glass-card rounded-2xl px-4 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] sm:text-xs font-mono"
    >
      {/* Left - System info */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-neon animate-glow-pulse" />
        <span className="text-neon/65 tracking-wider">NEXUS.FORGE</span>
        <span className="text-neon/30">v2.1.0</span>
      </div>

      <div className="hidden sm:block h-3 w-px bg-neon/10" />

      {/* CPU */}
      <div className="flex items-center gap-1.5">
        <span className="text-neon/30">CPU:</span>
        <span className={cpuLoad > 6 ? 'text-amber' : 'text-neon/60'}>{cpuLoad}%</span>
      </div>

      {/* Memory */}
      <div className="flex items-center gap-1.5">
        <span className="text-neon/30">MEM:</span>
        <span className="text-neon/60">{memUsage}MB</span>
      </div>

      {/* Agent Status */}
      <div className="flex items-center gap-1.5">
        <span className="text-neon/30">AGENT:</span>
        <span className="text-neon font-bold">STANDBY</span>
      </div>

      {/* Right - Time */}
      <div className="flex items-center gap-1.5 sm:ml-auto">
        <span className="text-neon/30">UTC:</span>
        <span className="text-cyan/70">{time.toISOString().replace('T', ' ').substring(0, 19)}</span>
      </div>
    </motion.div>
  );
}
