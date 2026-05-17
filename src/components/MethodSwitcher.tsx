import { NavLink } from 'react-router';
import { FileImage, FileInput, FileType2 } from 'lucide-react';

const items = [
  { to: '/upload?mode=scan', label: 'Scan Catatan', icon: FileImage, match: '/upload' },
  { to: '/upload?mode=import', label: 'Import Dokumen', icon: FileInput, match: '/upload' },
  { to: '/templates', label: 'Pilih Template', icon: FileType2, match: '/templates' },
];

export function MethodSwitcher({ active }: { active: 'scan' | 'import' | 'template' }) {
  const activeTo = active === 'scan' ? '/upload?mode=scan' : active === 'import' ? '/upload?mode=import' : '/templates';
  return (
    <div className="mb-8">
      <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">Mulai dengan</div>
      <div className="inline-flex p-1 rounded-xl card-surface gap-1">
        {items.map(it => {
          const Icon = it.icon;
          const isActive = it.to === activeTo;
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
