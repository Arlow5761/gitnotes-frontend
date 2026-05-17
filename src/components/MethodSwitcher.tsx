import { NavLink } from 'react-router';
import { ScanLine, FileType2 } from 'lucide-react';

const items = [
  { to: '/upload', label: 'Scan Catatan', icon: ScanLine, match: 'scan' as const },
  { to: '/templates', label: 'Pilih Template', icon: FileType2, match: 'template' as const },
];

export function MethodSwitcher({ active }: { active: 'scan' | 'template' }) {
  return (
    <div className="mb-8">
      <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">Mulai dengan</div>
      <div className="inline-flex p-1 rounded-xl card-surface gap-1">
        {items.map(it => {
          const Icon = it.icon;
          const isActive = it.match === active;
          return (
            <NavLink
              key={it.to}
              to={it.to}
              className={`relative flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'gradient-primary text-white glow-purple-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              }`}
            >
              <Icon size={15} />
              {it.label}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
