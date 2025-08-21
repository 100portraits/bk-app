import { forwardRef } from 'react';

interface TextInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  name?: string;
  id?: string;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({
  placeholder = 'Value',
  value,
  onChange,
  type = 'text',
  disabled = false,
  fullWidth = false,
  className = '',
  name,
  id,
  autoFocus,
  onKeyDown
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      name={name}
      id={id}
      autoFocus={autoFocus}
      onKeyDown={onKeyDown}
      className={`
        px-4 
        py-3 
        border 
        border-zinc-200 dark:border-zinc-700 
        rounded-lg 
        text-zinc-700 dark:text-white 
        placeholder-zinc-400 dark:placeholder-zinc-500
        bg-white dark:bg-zinc-800
        focus:outline-none 
        focus:ring-2 
        focus:ring-accent-500 
        focus:border-transparent
        disabled:bg-zinc-50 dark:disabled:bg-zinc-900 
        disabled:cursor-not-allowed
        min-h-[44px]
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    />
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;