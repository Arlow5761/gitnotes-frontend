import { Lock, Globe, EyeOff } from 'lucide-react';
import type { Visibility } from '../../data/mock';

export function VisibilityBadge({ visibility, size = 'sm' }: { visibility: Visibility; size?: 'sm' | 'md' }) {
  const map = {
    public: { icon: Globe, label: 'Publik', color: 'text-success bg-success/10 border-success/30' },
    private: { icon: Lock, label: 'Privat', color: 'text-mauve-soft bg-mauve-soft/10 border-mauve-soft/25' },
    hidden: { icon: EyeOff, label: 'Tersembunyi', color: 'text-warning bg-warning/10 border-warning/25' },
  };
  const v = map[visibility];
  const Icon = v.icon;
  const sz = size === 'md' ? 'h-7 px-2.5 text-xs' : 'h-6 px-2 text-[11px]';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${v.color} ${sz}`}>
      <Icon size={size === 'md' ? 12 : 11} />
      {v.label}
    </span>
  );
}

export function Chip({ children, onRemove, active, onClick }: { children: React.ReactNode; onRemove?: () => void; active?: boolean; onClick?: () => void }) {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-medium transition-colors border ${
        active
          ? 'bg-indigo-velvet/50 text-mauve-soft border-mauve-magic/50'
          : 'bg-white/5 text-text-secondary border-white/10 hover:bg-white/10 hover:text-text-primary'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      {children}
      {onRemove && (
        <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="hover:text-danger ml-0.5" aria-label="Hapus">
          ×
        </button>
      )}
    </span>
  );
}

export function Avatar({ user, size = 32 }: { user: { initials: string; color: string }; size?: number }) {
  return (
    <div
      className="rounded-full grid place-items-center font-semibold text-white shrink-0"
      style={{ background: user.color, width: size, height: size, fontSize: size * 0.4 }}
    >
      {user.initials}
    </div>
  );
}
