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
  id
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
      className={`
        px-4 
        py-3 
        border 
        border-gray-200 
        rounded-lg 
        text-gray-700 
        placeholder-gray-400
        focus:outline-none 
        focus:ring-2 
        focus:ring-purple-500 
        focus:border-transparent
        disabled:bg-gray-50 
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