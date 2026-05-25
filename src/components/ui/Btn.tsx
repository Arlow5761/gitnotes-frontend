import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Btn({ variant = 'primary', size = 'md', className, children, ...rest }: ButtonProps) {
  const sizes = {
    sm: 'h-8 px-3 text-sm rounded-lg',
    md: 'h-10 px-4 text-sm rounded-lg',
    lg: 'h-12 px-6 text-base rounded-xl',
  };
  const variants = {
    primary: 'gradient-primary text-white font-semibold glow-purple-sm hover:glow-purple',
    secondary: 'bg-white/5 hover:bg-white/10 text-text-primary border border-white/10',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-white/5',
    danger: 'bg-danger/15 hover:bg-danger/25 text-danger border border-danger/30',
  };
  return (
    <button
      className={cn(
        'focus-ring inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap',
        sizes[size],
        variants[variant],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
