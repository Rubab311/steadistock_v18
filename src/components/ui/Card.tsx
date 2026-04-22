import { cn } from '../../lib/utils';
import { ReactNode, HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  key?: string | number;
}

export const Card = ({ children, className, title, subtitle, ...props }: CardProps) => {
  return (
    <div className={cn('bg-white rounded-2xl card-shadow overflow-hidden p-6 border border-gray-100 flex flex-col', className)} {...props}>
      {(title || subtitle) && (
        <div className="mb-6 flex-shrink-0">
          {title && <h3 className="text-xl font-black text-neutral-text leading-tight">{title}</h3>}
          {subtitle && <p className="text-[10px] font-bold text-neutral-secondary uppercase tracking-widest mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="flex-1 min-w-0 min-h-0">
        {children}
      </div>
    </div>
  );
};
