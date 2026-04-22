import { cn } from '../../lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-hover',
      secondary: 'bg-neutral-text text-white hover:bg-neutral-secondary',
      outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
      ghost: 'hover:bg-gray-100 text-neutral-text',
      danger: 'bg-red-500 text-white hover:bg-red-600',
      success: 'bg-success text-white hover:bg-emerald-600',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
      icon: 'p-2',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-primary/50',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
