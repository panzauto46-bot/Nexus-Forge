import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';

type LogType = 'info' | 'warn' | 'success' | 'error' | 'system';

interface LogEntry {
  id: number;
  timestamp: string;
  message: string;
  type: LogType;
}

interface BridgeLogPayload {
  timestamp?: string;
  level?: string;
  source?: string;
  message?: string;
}

const LOG_MESSAGES: { message: string; type: LogType }[] = [
  { message: 'Standing by... No prompt detected.', type: 'info' },
  { message: 'Neural cortex idle. Awaiting stimulus.', type: 'info' },
  { message: 'Heartbeat sent to Seedstr API -> 200 OK', type: 'success' },
  { message: 'Material engine loaded. Templates: 12/12', type: 'system' },
  { message: 'Framer Motion injector: ARMED', type: 'system' },
  { message: 'Theme manager: premium material active', type: 'system' },
  { message: 'API response: { "prompt": null, "status": "pending" }', type: 'info' },
  { message: 'Memory allocation: 47.3MB / 512MB', type: 'info' },
  { message: 'Scanning mystery prompt endpoint...', type: 'info' },
  { message: 'No new challenges detected in queue.', type: 'warn' },
  { message: 'Component arsenal: 24 prefabs loaded', type: 'success' },
  { message: 'Beauty protocol v2.1 - Status: OPERATIONAL', type: 'success' },
  { message: 'WebSocket connection stable. Latency: 12ms', type: 'info' },
  { message: 'Pre-cognitive analysis: matrix updating...', type: 'info' },
  { message: 'Agent NEXUS.FORGE online. Cognitive load: 3%', type: 'system' },
  { message: 'Threat assessment: LOW. No competing agents detected.', type: 'info' },
  { message: 'Design token cache refreshed. 48 tokens active.', type: 'success' },
  { message: 'WARNING: latency spike detected (340ms)', type: 'warn' },
  { message: 'Latency normalized. Resuming standard operations.', type: 'info' },
  { message: 'Kill-switch failsafe: ARMED. Override: READY.', type: 'system' },
];

function getTimestamp(): string {
  const now = new Date();
  return now.toISOString().replace('T', ' ').substring(0, 19);
}

function toLogType(level?: string): LogType {
  if (level === 'warn') return 'warn';
  if (level === 'error') return 'error';
  if (level === 'success') return 'success';
  return 'info';
}

function pushLog(
  setLogs: Dispatch<SetStateAction<LogEntry[]>>,
  entry: Omit<LogEntry, 'id'>,
): void {
  setLogs(prev => [
    ...prev.slice(-50),
    {
      id: Date.now() + Math.floor(Math.random() * 1000),
      ...entry,
    },
  ]);
}

export function NeuralLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [bridgeConnected, setBridgeConnected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const msgIndex = useRef(0);

  useEffect(() => {
    setLogs([
      {
        id: 0,
        timestamp: getTimestamp(),
        message: 'NEXUS.FORGE Neural Log initialized. Stream active.',
        type: 'system',
      },
    ]);
  }, []);

  useEffect(() => {
    const bridgeUrl = import.meta.env.VITE_ENGINE_EVENTS_URL ?? 'http://127.0.0.1:8787/events';
    const source = new EventSource(bridgeUrl);

    source.onopen = () => {
      setBridgeConnected(true);
      pushLog(setLogs, {
        timestamp: getTimestamp(),
        message: 'Bridge connected. Streaming backend logs in real-time.',
        type: 'success',
      });
    };

    source.onerror = () => {
      setBridgeConnected(false);
    };

    source.addEventListener('engine-log', event => {
      try {
        const payload = JSON.parse((event as MessageEvent).data) as BridgeLogPayload;
        const sourceLabel = payload.source ? `[${payload.source}] ` : '';

        pushLog(setLogs, {
          timestamp: payload.timestamp?.replace('T', ' ').substring(0, 19) ?? getTimestamp(),
          message: `${sourceLabel}${payload.message ?? 'Engine event received.'}`,
          type: toLogType(payload.level),
        });
      } catch {
        pushLog(setLogs, {
          timestamp: getTimestamp(),
          message: 'Bridge sent malformed log payload.',
          type: 'warn',
        });
      }
    });

    source.addEventListener('engine-error', event => {
      pushLog(setLogs, {
        timestamp: getTimestamp(),
        message: `Engine error: ${(event as MessageEvent).data}`,
        type: 'error',
      });
    });

    return () => {
      source.close();
    };
  }, []);

  // Listen for custom events from INJ button (Vercel serverless results)
  useEffect(() => {
    const handler = (e: Event) => {
      const { type, message } = (e as CustomEvent).detail ?? {};
      pushLog(setLogs, {
        timestamp: getTimestamp(),
        message: message ?? 'Event received.',
        type: (type as LogType) ?? 'info',
      });
    };

    window.addEventListener('nexus-log', handler);
    return () => window.removeEventListener('nexus-log', handler);
  }, []);

  useEffect(() => {
    if (bridgeConnected) {
      return;
    }

    const interval = setInterval(() => {
      const msgData = LOG_MESSAGES[msgIndex.current % LOG_MESSAGES.length];
      msgIndex.current++;

      setLogs(prev => [
        ...prev.slice(-50),
        {
          id: Date.now(),
          timestamp: getTimestamp(),
          message: msgData.message,
          type: msgData.type,
        },
      ]);
    }, 2500 + Math.random() * 1500);

    return () => clearInterval(interval);
  }, [bridgeConnected]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const typeColors: Record<LogType, string> = {
    info: 'text-neon/70',
    warn: 'text-amber',
    success: 'text-neon',
    error: 'text-red',
    system: 'text-cyan',
  };

  const typePrefixes: Record<LogType, string> = {
    info: 'INF',
    warn: 'WRN',
    success: 'OK ',
    error: 'ERR',
    system: 'SYS',
  };

  return (
    <GlassCard
      title="Live Neural Log - Terminal Stream"
      icon={<span>LOG</span>}
      variant="cyan"
      delay={0.2}
      className="h-full"
    >
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        className="material-surface-strong h-64 sm:h-72 overflow-y-auto terminal-scroll font-mono text-xs sm:text-[13px] leading-6 space-y-0.5 rounded-lg p-3"
      >
        {logs.map((log, index) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex gap-1 flex-wrap sm:flex-nowrap"
          >
            <span className="text-neon/30 shrink-0">[{log.timestamp}]</span>
            <span className={`${typeColors[log.type]} shrink-0 font-bold`}>[{typePrefixes[log.type]}]</span>
            <span className={typeColors[log.type]}>{log.message}</span>
            {index === logs.length - 1 && <span className="text-neon animate-blink ml-0.5">|</span>}
          </motion.div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3 text-[11px] sm:text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-neon animate-glow-pulse" />
          <span className="text-neon/50 tracking-wider">{bridgeConnected ? 'BRIDGE ACTIVE' : 'SIMULATION MODE'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-neon/30">BUFFER:</span>
          <span className="text-neon/60">{logs.length}/50</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-neon/30">RATE:</span>
          <span className="text-cyan/60">{bridgeConnected ? 'REAL-TIME' : '~3s'}</span>
        </div>
      </div>
    </GlassCard>
  );
}
