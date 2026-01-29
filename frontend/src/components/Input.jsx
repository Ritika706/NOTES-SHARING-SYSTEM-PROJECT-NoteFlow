import { cn } from '../lib/cn';

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'w-full rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-card/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40',
        className
      )}
      {...props}
    />
  );
}
