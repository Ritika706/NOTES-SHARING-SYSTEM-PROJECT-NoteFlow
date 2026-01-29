import { cn } from '../lib/cn';

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-card shadow-soft border border-white/20 dark:border-white/10',
        className
      )}
      {...props}
    />
  );
}
