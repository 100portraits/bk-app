'use client';

import { useRouter } from 'next/navigation';
import { useDialog } from '@/contexts/DialogContext';
import { QuickLinkAction } from '@/lib/quickLinks/registry';
import NavigationCard from './NavigationCard';
import { IconX } from '@tabler/icons-react';

interface QuickLinkCardProps {
  action: QuickLinkAction;
  onRemove?: () => void;
  showRemoveButton?: boolean;
}

export default function QuickLinkCard({ 
  action, 
  onRemove,
  showRemoveButton = false 
}: QuickLinkCardProps) {
  const router = useRouter();
  const { openDialog } = useDialog();

  const handleClick = () => {
    if (action.type === 'navigation' && action.path) {
      router.push(action.path);
    } else if (action.type === 'dialog' && action.dialogId) {
      openDialog(action.dialogId);
    }
  };

  const Icon = action.icon;

  return (
    <div className="relative group">
      <NavigationCard
        title={action.title}
        subtitle={action.subtitle}
        variant={action.variant || 'secondary'}
        onClick={handleClick}
        icon={Icon ? <Icon size={20} /> : undefined}
      />
      
      {showRemoveButton && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-2 -right-2 p-1 bg-white border border-gray-200 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:border-red-200"
          aria-label={`Remove ${action.title} from quick links`}
        >
          <IconX size={16} className="text-gray-600 hover:text-red-600" />
        </button>
      )}
    </div>
  );
}