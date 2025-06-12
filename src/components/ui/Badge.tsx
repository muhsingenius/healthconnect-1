import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'neutral', size = 'sm' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        {
          'bg-primary-100 text-primary-800': variant === 'primary',
          'bg-green-100 text-green-800': variant === 'success',
          'bg-yellow-100 text-yellow-800': variant === 'warning',
          'bg-red-100 text-red-800': variant === 'error',
          'bg-gray-100 text-gray-800': variant === 'neutral',
          'px-2.5 py-0.5 text-xs': size === 'sm',
          'px-3 py-1 text-sm': size === 'md',
        }
      )}
    >
      {children}
    </span>
  );
}