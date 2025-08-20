import { UserRole } from '@/types/auth';
import { 
  IconCalendarEvent, 
  IconClipboardList, 
  IconUsers, 
  IconClock,
  IconPackage,
  IconUserPlus,
  IconEye,
  IconCalendar,
  IconSettings,
  IconMessage,
  IconIdBadge2
} from '@tabler/icons-react';

export type ActionType = 'navigation' | 'dialog';
export type ActionCategory = 'booking' | 'host' | 'admin' | 'membership' | 'general';

export interface QuickLinkAction {
  id: string;
  title: string;
  subtitle: string;
  type: ActionType;
  path?: string; // For navigation actions
  dialogId?: string; // For dialog actions
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  variant?: 'primary' | 'secondary';
  permissions: {
    requireAuth?: boolean;
    requireMember?: boolean;
    requireNonMember?: boolean;
    allowedRoles?: UserRole[];
  };
  category: ActionCategory;
}

export const quickLinksRegistry: QuickLinkAction[] = [
  // Booking Actions (available to all authenticated users)
  {
    id: 'booking-form',
    title: 'Booking form',
    subtitle: 'Make an appointment',
    type: 'navigation',
    path: '/booking/new',
    icon: IconCalendarEvent,
    variant: 'primary',
    permissions: {
      requireAuth: true
    },
    category: 'booking'
  },
  {
    id: 'manage-bookings',
    title: 'Manage bookings',
    subtitle: 'See upcoming and previous appointments',
    type: 'navigation',
    path: '/booking/manage',
    icon: IconClipboardList,
    variant: 'secondary',
    permissions: {
      requireAuth: true
    },
    category: 'booking'
  },

  // Host Actions (available to host, mechanic, admin)
  {
    id: 'todays-bookings',
    title: "Today's Bookings",
    subtitle: 'Manage appointments',
    type: 'navigation',
    path: '/host/bookings',
    icon: IconCalendarEvent,
    variant: 'primary',
    permissions: {
      requireAuth: true,
      allowedRoles: ['host', 'mechanic', 'admin']
    },
    category: 'host'
  },
  {
    id: 'record-walkin',
    title: 'Record walk-in',
    subtitle: 'Add a walk-in customer',
    type: 'dialog',
    dialogId: 'record-walkin-dialog',
    icon: IconUserPlus,
    variant: 'secondary',
    permissions: {
      requireAuth: true,
      allowedRoles: ['host', 'mechanic', 'admin']
    },
    category: 'host'
  },
  {
    id: 'see-walkins',
    title: 'See Walk-ins',
    subtitle: 'View and manage walk-in customers',
    type: 'navigation',
    path: '/host/walk-ins',
    icon: IconEye,
    variant: 'secondary',
    permissions: {
      requireAuth: true,
      allowedRoles: ['host', 'mechanic', 'admin']
    },
    category: 'host'
  },
  {
    id: 'shift-calendar',
    title: 'Shift Calendar',
    subtitle: 'View and edit your shifts',
    type: 'navigation',
    path: '/host/shifts',
    icon: IconCalendar,
    variant: 'secondary',
    permissions: {
      requireAuth: true,
      allowedRoles: ['host', 'mechanic', 'admin']
    },
    category: 'host'
  },
  {
    id: 'inventory',
    title: 'Inventory',
    subtitle: 'Manage workshop inventory',
    type: 'navigation',
    path: '/host/inventory',
    icon: IconPackage,
    variant: 'secondary',
    permissions: {
      requireAuth: true,
      allowedRoles: ['host', 'mechanic', 'admin']
    },
    category: 'host'
  },

  // Admin Actions (admin only)
  {
    id: 'manage-timeslots',
    title: 'Manage Timeslots',
    subtitle: 'Open shifts for bookings',
    type: 'navigation',
    path: '/admin/timeslots',
    icon: IconClock,
    variant: 'primary',
    permissions: {
      requireAuth: true,
      allowedRoles: ['admin']
    },
    category: 'admin'
  },
  {
    id: 'manage-events',
    title: 'Manage Events',
    subtitle: 'Create and edit events',
    type: 'navigation',
    path: '/admin/events',
    icon: IconCalendarEvent,
    variant: 'secondary',
    permissions: {
      requireAuth: true,
      allowedRoles: ['admin']
    },
    category: 'admin'
  },
  {
    id: 'manage-team',
    title: 'Manage team',
    subtitle: 'Change roles/access',
    type: 'navigation',
    path: '/admin/team',
    icon: IconUsers,
    variant: 'secondary',
    permissions: {
      requireAuth: true,
      allowedRoles: ['admin']
    },
    category: 'admin'
  },
  {
    id: 'manage-appointments',
    title: 'Manage Appointments',
    subtitle: 'View and edit bookings',
    type: 'navigation',
    path: '/admin/appointments',
    icon: IconClipboardList,
    variant: 'secondary',
    permissions: {
      requireAuth: true,
      allowedRoles: ['admin']
    },
    category: 'admin'
  },
  {
    id: 'admin-messages',
    title: 'Messages',
    subtitle: 'Respond to user help requests',
    type: 'navigation',
    path: '/admin/messages',
    icon: IconMessage,
    variant: 'secondary',
    permissions: {
      requireAuth: true,
      allowedRoles: ['admin']
    },
    category: 'admin'
  },

  // Membership Actions (members only)
  {
    id: 'event-calendar',
    title: 'Event Calendar',
    subtitle: "See this month's plan",
    type: 'navigation',
    path: '/membership/events',
    icon: IconCalendarEvent,
    variant: 'primary',
    permissions: {
      requireAuth: true,
      requireMember: true
    },
    category: 'membership'
  },
  {
    id: 'manage-membership',
    title: 'Manage Membership',
    subtitle: 'View membership details',
    type: 'dialog',
    dialogId: 'manage-membership-dialog',
    icon: IconIdBadge2,
    variant: 'secondary',
    permissions: {
      requireAuth: true,
      requireMember: true
    },
    category: 'membership'
  }
];

// Helper function to get actions available to a user
export function getAvailableActions(
  isAuthenticated: boolean,
  isMember: boolean,
  userRole: UserRole | null
): QuickLinkAction[] {
  return quickLinksRegistry.filter(action => {
    const { permissions } = action;
    
    // Check authentication
    if (permissions.requireAuth && !isAuthenticated) return false;
    
    // Check membership requirements
    if (permissions.requireMember && !isMember) return false;
    if (permissions.requireNonMember && isMember) return false;
    
    // Check role requirements
    if (permissions.allowedRoles && permissions.allowedRoles.length > 0) {
      if (!userRole || !permissions.allowedRoles.includes(userRole)) {
        return false;
      }
    }
    
    return true;
  });
}

// Helper to get action by ID
export function getActionById(id: string): QuickLinkAction | undefined {
  return quickLinksRegistry.find(action => action.id === id);
}

// Helper to group actions by category
export function getActionsByCategory(actions: QuickLinkAction[]): Record<ActionCategory, QuickLinkAction[]> {
  const grouped: Record<ActionCategory, QuickLinkAction[]> = {
    booking: [],
    host: [],
    admin: [],
    membership: [],
    general: []
  };
  
  actions.forEach(action => {
    grouped[action.category].push(action);
  });
  
  return grouped;
}