import { IconQuestionMark } from '@tabler/icons-react';

interface HelpButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
}

const HelpButton = ({ text, onClick, className = '' }: HelpButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex 
        items-center 
        gap-3 
        w-full 
        p-4 
        bg-white 
        border 
        border-zinc-200 
        rounded-lg 
        text-zinc-700 
        font-medium
        hover:bg-zinc-50
        transition-colors
        min-h-[44px]
        ${className}
      `}
    >
      <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
        <IconQuestionMark size={18} className="text-pink-500" />
      </div>
      {text}
    </button>
  );
};

export default HelpButton;