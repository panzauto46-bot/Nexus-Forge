import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './GlassCard';

export function KillSwitch() {
  const [abortActive, setAbortActive] = useState(false);
  const [injectActive, setInjectActive] = useState(false);
  const [abortConfirm, setAbortConfirm] = useState(false);
  const [injectModal, setInjectModal] = useState(false);
  const [manualPrompt, setManualPrompt] = useState('');
  const [isInjecting, setIsInjecting] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (injectModal) {
      textAreaRef.current?.focus();
    }
  }, [injectModal]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setInjectModal(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleAbort = () => {
    if (!abortConfirm) {
      setAbortConfirm(true);
      setTimeout(() => setAbortConfirm(false), 3000);
      return;
    }

    setAbortActive(true);
    setAbortConfirm(false);
    setTimeout(() => setAbortActive(false), 3000);
  };

  const executeInject = () => {
    if (!manualPrompt.trim() || isInjecting) {
      return;
    }

    setIsInjecting(true);

    setTimeout(() => {
      setInjectActive(true);
      setInjectModal(false);
      setManualPrompt('');
      setIsInjecting(false);
      setTimeout(() => setInjectActive(false), 3000);
    }, 700);
  };

  const canInject = manualPrompt.trim().length > 0 && !isInjecting;

  return (
    <GlassCard
      title="Kill-Switch and Override Control"
      icon={<span>CTL</span>}
      variant="red"
      delay={0.4}
    >
      <div className="space-y-4">
        <div className="material-surface flex items-center justify-between text-[11px] sm:text-xs px-2 py-1.5 rounded">
          <span className="text-red/60 tracking-wider">FAILSAFE STATUS</span>
          <span className={abortActive ? 'text-red font-bold animate-blink' : 'text-neon'}>
            {abortActive ? 'ABORTED' : 'OPERATIONAL'}
          </span>
        </div>

        <div className="action-grid">
          <motion.button
            type="button"
            onClick={handleAbort}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className={`
              ui-button relative rounded-xl py-5 px-3 text-sm tracking-wider
              border-2 cursor-pointer
              ${abortActive
                ? 'bg-red/20 border-red text-red animate-red-glow-pulse'
                : abortConfirm
                  ? 'bg-red/30 border-red text-[color:var(--color-text-primary)] shadow-[0_0_30px_rgba(194,70,93,0.35)]'
                  : 'bg-red/10 border-red/40 text-red hover:border-red hover:shadow-[0_0_20px_rgba(194,70,93,0.3)]'
              }
            `}
            aria-pressed={abortActive}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red via-amber to-red opacity-50" />

            <div className="flex flex-col items-center gap-1.5">
              <span className="text-2xl">{abortActive ? 'ABT' : 'OFF'}</span>
              <span>{abortActive ? 'ABORTED' : abortConfirm ? 'CONFIRM?' : 'ABORT'}</span>
              <span className="text-[9px] font-normal opacity-70">
                {abortConfirm ? 'CLICK AGAIN TO CONFIRM' : 'EMERGENCY SHUTDOWN'}
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red via-amber to-red opacity-50" />
          </motion.button>

          <motion.button
            type="button"
            onClick={() => setInjectModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className={`
              ui-button relative rounded-xl py-5 px-3 text-sm tracking-wider
              border-2 cursor-pointer
              ${injectActive
                ? 'bg-cyan/20 border-cyan text-cyan shadow-[0_0_30px_rgba(40,94,167,0.35)]'
                : 'bg-cyan/10 border-cyan/40 text-cyan hover:border-cyan hover:shadow-[0_0_20px_rgba(40,94,167,0.3)]'
              }
            `}
            aria-pressed={injectActive}
          >
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-2xl">{injectActive ? 'ON' : 'INJ'}</span>
              <span>{injectActive ? 'INJECTED' : 'MANUAL INJECT'}</span>
              <span className="text-[9px] font-normal opacity-70">
                {injectActive ? 'PROMPT QUEUED' : 'BYPASS API INPUT'}
              </span>
            </div>
          </motion.button>
        </div>

        <div className="space-y-1 text-[10px] text-red/65 px-1 leading-relaxed">
          <p>Warning: Abort instantly stops all running agent tasks.</p>
          <p>Warning: Manual inject bypasses API validation controls.</p>
        </div>
      </div>

      <AnimatePresence>
        {injectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="material-overlay fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setInjectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="manual-inject-title"
              className="glass-card rounded-xl p-6 max-w-md w-full border border-cyan/30"
              onClick={event => event.stopPropagation()}
            >
              <h4 id="manual-inject-title" className="cyan-text text-sm font-bold tracking-wider mb-4">
                MANUAL PROMPT INJECTION
              </h4>
              <label htmlFor="manual-prompt" className="sr-only">Manual prompt input</label>
              <textarea
                id="manual-prompt"
                ref={textAreaRef}
                value={manualPrompt}
                onChange={event => setManualPrompt(event.target.value)}
                placeholder="Type manual prompt here..."
                className="material-field w-full h-32 rounded-lg p-3 text-xs font-mono resize-none focus:outline-none"
              />
              <div className="mt-2 text-[10px] text-cyan/55">{manualPrompt.length} characters</div>
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setInjectModal(false)}
                  className="ui-button flex-1 py-2 rounded-lg border border-red/30 text-red text-xs hover:bg-red/10 cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={executeInject}
                  disabled={!canInject}
                  className="ui-button flex-1 py-2 rounded-lg border border-cyan/30 text-cyan text-xs hover:bg-cyan/10 bg-cyan/5 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isInjecting ? 'INJECTING...' : 'INJECT NOW'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
