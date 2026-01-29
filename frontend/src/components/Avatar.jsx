import { cn } from '../lib/cn';

export function Avatar({ name = '', className }) {
  const initials = String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('') || 'U';

  return (
    <div
      className={cn(
        'grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary font-semibold',
        className
      )}
      aria-label={name}
      title={name}
    >
      {initials}
    </div>
  );
}
