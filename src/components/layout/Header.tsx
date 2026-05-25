import { useState } from 'react';
import {
  Link,
  NavLink,
  useNavigate,
} from 'react-router-dom';

import {
  ArrowLeft,
  Search,
  Library,
  Bell,
  Menu,
  X,
} from 'lucide-react';

import { currentUser } from '../../data/mock';
import { ThemeToggle } from '../ui/ThemeToggle';

interface HeaderProps {
  back?: boolean;
  backTo?: string;
  title?: string;
  right?: React.ReactNode;
  minimal?: boolean;
}

export function Header({
  back,
  backTo,
  title,
  right,
  minimal,
}: HeaderProps) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 glass">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
        {back ? (
          <button
            onClick={() =>
              backTo ? navigate(backTo) : navigate(-1)
            }
            className="focus-ring rounded-lg p-2 hover:bg-white/5 transition-colors text-text-secondary hover:text-text-primary"
            aria-label="Kembali"
          >
            <ArrowLeft size={20} />
          </button>
        ) : (
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg gradient-primary grid place-items-center font-display font-bold text-white text-sm glow-purple-sm">
              G
            </div>

            <span className="font-display font-bold text-lg text-text-primary tracking-tight">
              Git<span className="text-mauve-magic">Notes</span>
            </span>
          </Link>
        )}

        {title && (
          <h1 className="font-display font-semibold text-text-primary text-base truncate flex-1">
            {title}
          </h1>
        )}

        {/* Desktop Navigation */}
        {!title && !minimal && (
          <nav className="hidden md:flex items-center gap-1 ml-6">
            <NavItem to="/" icon={<Library size={16} />}>
              Beranda
            </NavItem>

            <NavItem to="/search" icon={<Search size={16} />}>
              Cari
            </NavItem>
          </nav>
        )}

        <div className="flex-1" />

        {right}

        <ThemeToggle />

        {!minimal && (
          <>
            {/* Mobile Menu Button */}
            <button
              onClick={() =>
                setMobileMenuOpen(!mobileMenuOpen)
              }
              className="md:hidden focus-ring rounded-lg p-2 hover:bg-white/5 transition-colors text-text-secondary"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center gap-1">
              <button
                className="focus-ring rounded-lg p-2 hover:bg-white/5 transition-colors text-text-secondary"
                aria-label="Notifikasi"
              >
                <Bell size={18} />
              </button>

              <button
                className="focus-ring w-9 h-9 rounded-full grid place-items-center text-sm font-semibold text-white"
                style={{ background: currentUser.color }}
                aria-label="Profile"
              >
                {currentUser.initials}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      {!title && !minimal && mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 px-4 py-3 bg-background/95 backdrop-blur">
          <nav className="flex flex-col gap-1">
            <MobileNavItem
              to="/"
              icon={<Library size={18} />}
              onClick={() => setMobileMenuOpen(false)}
            >
              Beranda
            </MobileNavItem>

            <MobileNavItem
              to="/search"
              icon={<Search size={18} />}
              onClick={() => setMobileMenuOpen(false)}
            >
              Cari
            </MobileNavItem>
          </nav>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <button
              className="focus-ring rounded-lg p-2 hover:bg-white/5 transition-colors text-text-secondary"
              aria-label="Notifikasi"
            >
              <Bell size={18} />
            </button>

            <button
              className="focus-ring w-9 h-9 rounded-full grid place-items-center text-sm font-semibold text-white"
              style={{ background: currentUser.color }}
              aria-label="Profile"
            >
              {currentUser.initials}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function NavItem({
  to,
  icon,
  children,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
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

function MobileNavItem({
  to,
  icon,
  children,
  onClick,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
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
