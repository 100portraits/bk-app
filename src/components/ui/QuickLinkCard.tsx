'use client';

import { useRouter } from 'next/navigation';
import { useDialog } from '@/contexts/DialogContext';
import { QuickLinkAction } from '@/lib/quickLinks/registry';
import { IconX, IconChevronRight } from '@tabler/icons-react';

interface QuickLinkCardProps {
  action: QuickLinkAction;
  onRemove?: () => void;
  editMode?: boolean;
}

export default function QuickLinkCard({ 
  action, 
  onRemove,
  editMode = false 
}: QuickLinkCardProps) {
  const router = useRouter();
  const { openDialog } = useDialog();

  const handleClick = () => {
    // Don't navigate in edit mode
    if (editMode) {
      return;
    }
    
    if (action.type === 'navigation' && action.path) {
      router.push(action.path);
    } else if (action.type === 'dialog' && action.dialogId) {
      openDialog(action.dialogId);
    }
  };

  const Icon = action.icon;
  
  // Determine variant classes based on edit mode
  const getVariantClasses = () => {
    if (editMode) {
      // In edit mode, all cards get dashed zinc border
      return 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-2 border-dashed border-zinc-400 dark:border-zinc-600';
    }
    
    // Normal mode - use the action's variant
    const variant = action.variant || 'secondary';
    const variantClasses = {
      primary: 'bg-accent-500 text-white',
      secondary: 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700',
      border: 'bg-accent-50 dark:bg-accent-950 text-zinc-700 dark:text-zinc-300 border-2 border-accent-500'
    };
    
    return variantClasses[variant];
  };
  
  const iconColor = editMode 
    ? 'text-zinc-400' 
    : (action.variant === 'primary' ? 'text-accent-200' : 'text-zinc-400 dark:text-zinc-500');

  const Container = editMode ? 'div' : 'button';
  
  return (
    <Container
      onClick={editMode ? undefined : handleClick}
      className={`
        w-full 
        p-4 
        rounded-lg 
        flex 
        items-center 
        gap-3 
        text-left
        transition-colors
        min-h-[80px]
        ${getVariantClasses()}
        ${!editMode && action.variant === 'primary' ? 'hover:bg-accent-600' : ''}
        ${!editMode && action.variant !== 'primary' ? 'hover:bg-zinc-50 dark:hover:bg-zinc-700' : ''}
        ${editMode ? 'cursor-default' : 'cursor-pointer'}
      `}
    >
      <div className={iconColor}>
        {Icon ? <Icon size={24} /> : null}
      </div>
      
      <div className="flex-1">
        <div className="font-medium text-base">{action.title}</div>
        <div className={`text-sm ${action.variant === 'primary' && !editMode ? 'text-accent-100' : 'text-zinc-500 dark:text-zinc-400'}`}>
          {action.subtitle}
        </div>
      </div>
      
      {editMode && onRemove ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-2 bg-red-50 dark:bg-red-950 rounded-full border border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
          aria-label={`Remove ${action.title} from quick links`}
        >
          <IconX size={18} className="text-red-600 dark:text-red-400" />
        </button>
      ) : (
        <IconChevronRight 
          size={20} 
          className={action.variant === 'primary' ? 'text-accent-200' : 'text-zinc-400 dark:text-zinc-500'} 
        />
      )}
    </Container>
  );
}