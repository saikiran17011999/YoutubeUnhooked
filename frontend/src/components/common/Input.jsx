/**
 * Input Component
 * Reusable input field
 */

import { forwardRef } from 'react';
import { clsx } from 'clsx';

export const Input = forwardRef(function Input(
  { label, error, className = '', ...props },
  ref
) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-yt-text-secondary">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={clsx(
          'input',
          error && 'border-red-500 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
});

export default Input;
