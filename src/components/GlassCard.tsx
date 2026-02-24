import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'neon' | 'cyan' | 'red';
  title?: string;
  icon?: React.ReactNode;
  delay?: number;
}

export function GlassCard({ children, className, variant = 'neon', title, icon, delay = 0 }: GlassCardProps) {
  const cardClass = variant === 'cyan' ? 'glass-card-cyan' : 'glass-card';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(cardClass, 'overflow-hidden', className)}
    >
      {title && (
        <div className={cn(
          'flex items-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 border-b',
          variant === 'neon' && 'border-neon/10',
          variant === 'cyan' && 'border-cyan/10',
          variant === 'red' && 'border-red/10',
        )}>
          {icon && (
            <span className={cn(
              'text-sm',
              variant === 'neon' && 'text-neon',
              variant === 'cyan' && 'text-cyan',
              variant === 'red' && 'text-red',
            )}>
              {icon}
            </span>
          )}
          <h3 className={cn(
            'text-xs sm:text-sm font-semibold tracking-[0.1em] sm:tracking-[0.14em] uppercase',
            variant === 'neon' && 'neon-text',
            variant === 'cyan' && 'cyan-text',
            variant === 'red' && 'red-text',
          )}>
            {title}
          </h3>
          <div className={cn(
            'ml-auto w-2 h-2 rounded-full',
            variant === 'neon' && 'bg-neon animate-glow-pulse',
            variant === 'cyan' && 'bg-cyan',
            variant === 'red' && 'bg-red animate-red-glow-pulse',
          )} />
        </div>
      )}
      <div className="p-4 sm:p-5">
        {children}
      </div>
    </motion.div>
  );
}
