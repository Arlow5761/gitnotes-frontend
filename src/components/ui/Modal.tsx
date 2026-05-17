import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}

export function Modal({ open, onClose, title, subtitle, children, footer, width = 'max-w-[480px]' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 anim-backdrop bg-amethyst-900/70 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div className={`relative w-full ${width} card-surface rounded-2xl shadow-2xl anim-modal glow-purple-sm`}>
        {(title || subtitle) && (
          <div className="px-6 pt-6 pb-4 border-b border-white/5">
            {subtitle && <div className="text-xs text-text-muted mb-1 truncate">{subtitle}</div>}
            {title && <h2 className="font-display font-semibold text-xl text-text-primary">{title}</h2>}
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 focus-ring rounded-lg p-2 hover:bg-white/5 text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Tutup"
        >
          <X size={18} />
        </button>
        <div className="p-6">{children}</div>
        {footer && <div className="px-6 pb-6 pt-2 border-t border-white/5">{footer}</div>}
      </div>
    </div>
  );
}
