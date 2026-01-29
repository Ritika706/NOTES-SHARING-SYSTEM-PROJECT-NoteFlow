import { cn } from '../lib/cn';

export function Tabs({ tabs, value, onChange, className }) {
  return (
    <div className={cn('flex gap-6 border-b border-slate-200/70 dark:border-white/10', className)}>
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className={cn(
              'relative pb-3 text-sm font-medium text-slate-600 dark:text-slate-300',
              active && 'text-primary'
            )}
          >
            {t.label}
            {active ? (
              <span className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-primary" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
