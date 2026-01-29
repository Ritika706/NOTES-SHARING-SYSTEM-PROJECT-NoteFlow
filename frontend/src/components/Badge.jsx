import { cn } from '../lib/cn';

export function Badge({ className, variant = 'muted', ...props }) {
  const styles = {
    muted: 'bg-muted text-slate-700 dark:text-slate-200',
    primary: 'bg-primary/10 text-primary border border-primary/20',
    accent: 'bg-accent/10 text-accent border border-accent/20',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        styles[variant],
        className
      )}
      {...props}
    />
  );
}
