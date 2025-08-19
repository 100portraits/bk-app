import { UserRole } from '@/types/auth';

export interface RouteConfig {
  path: string;
  requireAuth: boolean;
  requireMember?: boolean;
  allowedRoles?: UserRole[];
  requireNonMember?: boolean; // For become-member routes
  name: string;
}

export const routeConfig: RouteConfig[] = [
  // Public routes (no auth required)
  {
    path: '/',
    requireAuth: false,
    name: 'Landing'
  },
  {
    path: '/unauthorized',
    requireAuth: false,
    name: 'Unauthorized'
  },
  
  // Authenticated routes (no membership/role required)
  {
    path: '/home',
    requireAuth: true,
    name: 'Home'
  },
  {
    path: '/booking',
    requireAuth: true,
    name: 'Bookings'
  },
  {
    path: '/booking/new',
    requireAuth: true,
    name: 'New Booking'
  },
  {
    path: '/booking/manage',
    requireAuth: true,
    name: 'Manage Bookings'
  },
  
  // Become member routes (for non-members only)
  {
    path: '/become-member',
    requireAuth: true,
    requireNonMember: true,
    name: 'Become Member'
  },
  {
    path: '/become-member/name',
    requireAuth: true,
    requireNonMember: true,
    name: 'Member Registration Name'
  },
  {
    path: '/become-member/details',
    requireAuth: true,
    requireNonMember: true,
    name: 'Member Registration Details'
  },
  
  // Membership routes (require membership)
  {
    path: '/membership',
    requireAuth: true,
    requireMember: true,
    name: 'Membership'
  },
  {
    path: '/membership/events',
    requireAuth: true,
    requireMember: true,
    name: 'Member Events'
  },
  
  // Host routes (require host, mechanic, or admin role)
  {
    path: '/host',
    requireAuth: true,
    allowedRoles: ['host', 'mechanic', 'admin'],
    name: 'Host Dashboard'
  },
  {
    path: '/host/bookings',
    requireAuth: true,
    allowedRoles: ['host', 'mechanic', 'admin'],
    name: 'Host Bookings'
  },
  {
    path: '/host/shifts',
    requireAuth: true,
    allowedRoles: ['host', 'mechanic', 'admin'],
    name: 'Host Shifts'
  },
  {
    path: '/host/walk-ins',
    requireAuth: true,
    allowedRoles: ['host', 'mechanic', 'admin'],
    name: 'Walk-ins'
  },
  {
    path: '/host/inventory',
    requireAuth: true,
    allowedRoles: ['host', 'mechanic', 'admin'],
    name: 'Inventory'
  },
  
  // Admin routes (require admin role)
  {
    path: '/admin',
    requireAuth: true,
    allowedRoles: ['admin'],
    name: 'Admin'
  },
  {
    path: '/admin/team',
    requireAuth: true,
    allowedRoles: ['admin'],
    name: 'Team Management'
  },
  {
    path: '/admin/events',
    requireAuth: true,
    allowedRoles: ['admin'],
    name: 'Event Management'
  },
  {
    path: '/admin/timeslots',
    requireAuth: true,
    allowedRoles: ['admin'],
    name: 'Timeslot Management'
  }
];

export function getRouteConfig(path: string): RouteConfig | undefined {
  return routeConfig.find(route => {
    // Handle dynamic routes
    const routeParts = route.path.split('/');
    const pathParts = path.split('/');
    
    if (routeParts.length !== pathParts.length) return false;
    
    return routeParts.every((part, index) => {
      if (part.startsWith(':')) return true; // Dynamic segment
      return part === pathParts[index];
    });
  });
}