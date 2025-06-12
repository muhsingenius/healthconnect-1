import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
        {
          'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500': variant === 'primary',
          'bg-medical-600 text-white hover:bg-medical-700 focus:ring-medical-500': variant === 'secondary',
          'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500': variant === 'outline',
          'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-primary-500': variant === 'ghost',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}