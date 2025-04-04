import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
  children: React.ReactNode;
  htmlFor?: string;
}

export function Label({ htmlFor, className = '', children, ...props }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={className}
      {...props}
    >
      {children}
    </label>
  );
} 