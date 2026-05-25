import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../lib/theme';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      onClick={toggle}
      aria-label="Ganti tema"
      className="focus-ring relative h-9 w-[72px] rounded-full border border-white/10 dark:border-white/10 bg-white/5 hover:bg-white/10 transition-colors overflow-hidden"
      style={{ borderColor: 'var(--c-border)', background: 'var(--c-surface-2)' }}
    >
      <div
        className="absolute top-1 bottom-1 w-7 rounded-full gradient-primary glow-purple-sm transition-transform duration-300 ease-out grid place-items-center"
        style={{ transform: isDark ? 'translateX(4px)' : 'translateX(40px)' }}
      >
        {isDark ? <Moon size={13} className="text-white" /> : <Sun size={13} className="text-white" />}
      </div>
      <span
        className="absolute left-2 top-1/2 -translate-y-1/2 transition-opacity"
        style={{ opacity: isDark ? 0 : 1, color: 'var(--c-fg-subtle)' }}
      >
        <Moon size={13} />
      </span>
      <span
        className="absolute right-2 top-1/2 -translate-y-1/2 transition-opacity"
        style={{ opacity: isDark ? 1 : 0, color: 'var(--c-fg-subtle)' }}
      >
        <Sun size={13} />
      </span>
    </button>
  );
}
