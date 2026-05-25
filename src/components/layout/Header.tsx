import { Link, NavLink, useNavigate } from 'react-router';
import { ArrowLeft, Search, Library, Bell } from 'lucide-react';
import { currentUser } from '../../data/mock';
import { ThemeToggle } from '../ui/ThemeToggle';

interface HeaderProps {
  back?: boolean;
  backTo?: string;
  title?: string;
  right?: React.ReactNode;
  minimal?: boolean;
}

export function Header({ back, backTo, title, right, minimal }: HeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 glass">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center gap-4">
        {back ? (
          <button
            onClick={() => backTo ? navigate(backTo) : navigate(-1)}
            className="focus-ring rounded-lg p-2 hover:bg-white/5 transition-colors text-text-secondary hover:text-text-primary"
            aria-label="Kembali"
          >
            <ArrowLeft size={20} />
          </button>
        ) : (
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg gradient-primary grid place-items-center font-display font-bold text-white text-sm glow-purple-sm">
              G
            </div>
            <span className="hidden md:block font-display font-bold text-lg text-text-primary tracking-tight">
              Git<span className="text-mauve-magic">Notes</span>
            </span>
          </Link>
        )}

        {title && (
          <h1 className="font-display font-semibold text-text-primary text-base truncate flex-1">
            {title}
          </h1>
        )}

        {!title && !minimal && (
          <nav className="flex items-center gap-1 ml-6">
            <NavItem to="/" icon={<Library size={16} />}>Beranda</NavItem>
            <NavItem to="/search" icon={<Search size={16} />}>Cari</NavItem>
          </nav>
        )}

        <div className="flex-1" />

        {right}

        <ThemeToggle />

        {!minimal && (
          <>
            <button className="focus-ring rounded-lg p-2 hover:bg-white/5 transition-colors text-text-secondary" aria-label="Notifikasi">
              <Bell size={18} />
            </button>
            <button
              className="focus-ring w-9 h-9 rounded-full grid place-items-center text-sm font-semibold text-white"
              style={{ background: currentUser.color }}
              aria-label="Profile"
            >
              {currentUser.initials}
            </button>
          </>
        )}
      </div>
    </header>
  );
}

function NavItem({ to, icon, children }: { to: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
          isActive
            ? 'text-mauve-soft bg-indigo-velvet/30'
            : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
        }`
      }
    >
      {icon}
      {children}
    </NavLink>
  );
}
