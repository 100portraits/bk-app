export interface Version {
  version: string;
  date: string;
  changes: string[];
  type: 'major' | 'minor' | 'patch';
}

export const versionHistory: Version[] = [
  {
    version: '0.7.4',
    date: '2025-08-21',
    changes: [
      'Implemented comprehensive dark mode support across all components',
      'Added customizable accent color theming system',
      'Enhanced VersionDialog with scrollable content and max height constraints',
      'Fixed button positioning and styling in Home component',
      'Replaced SecondaryButton with anchor tag for community join link',
      'Migrated entire UI to support light/dark theme switching'
    ],
    type: 'patch'
  },
  {
    version: '0.7.3',
    date: '2025-08-21',
    changes: [
      'Fixed datepicker functionality on desktop browsers',
      'Added date format display as dd-mm-yyyy in walk-in dialog',
      'Fixed team management database queries and RLS policies',
      'Added user search functionality for team management',
      'Implemented "Add Team Member" feature with email search',
      'Extended booking cancellation to registered users',
      'Added cancel button in booking confirmation emails for all users',
      'Updated cancellation API to handle both guest and registered bookings',
      'Created comprehensive RLS policy migration for user_profiles table'
    ],
    type: 'patch'
  },
  {
    version: '0.7.2',
    date: '2025-08-21',
    changes: [
      'Refactored admin panel titles and improved navigation',
      'Implemented smooth scrolling to end of booking form on section change'
    ],
    type: 'patch'
  },
  {
    version: '0.7.1',
    date: '2025-08-21',
    changes: [
      'Added date picker to walk-in recording dialog',
      'Implemented real-time message updates for help dialog system',
      'Made name field mandatory for guest bookings',
      'Added connection retry logic for Supabase with improved session management',
      'Enhanced error handling in connection retry logic',
      'Minor email system tweaks and improvements'
    ],
    type: 'patch'
  },
  {
    version: '0.7.0',
    date: '2025-08-21',
    changes: [
      'Complete email system integration with Resend',
      'Automated emails for booking confirmations and cancellations',
      'Email notifications for admin responses to help messages',
      'Role change email notifications for team management',
      'Professional HTML email templates with branding',
      'Development/production email routing configuration'
    ],
    type: 'minor'
  },
  {
    version: '0.6.0',
    date: '2025-08-21',
    changes: [
      'Event poster upload system with Supabase Storage',
      'Fixed timezone issues with shift scheduling',
      'Admin messages delete functionality with RLS policies',
      'Fixed membership cancellation dialog flow',
      'Improved admin appointments page with accurate shift status',
      'Enhanced navigation with new icons and UI improvements'
    ],
    type: 'minor'
  },
  {
    version: '0.5.0',
    date: '2025-08-20',
    changes: [
      'Quick Links feature on homepage',
      'Pin favorite actions for quick access',
      'Extracted dialogs for global accessibility',
      'Help messages now include user names',
      'Added version tracker with changelog'
    ],
    type: 'minor'
  },
  {
    version: '0.4.2',
    date: '2025-08-20',
    changes: [
      'Minor booking form tweaks',
      'Improved guest booking flow'
    ],
    type: 'patch'
  },
  {
    version: '0.4.1',
    date: '2025-08-19',
    changes: [
      'Added admin messages inbox for help requests',
      'Fixed help messages database schema',
      'Fixed various TypeScript errors and type safety issues'
    ],
    type: 'patch'
  },
  {
    version: '0.4.0',
    date: '2025-08-18',
    changes: [
      'Major API architecture refactor',
      'Fixed tab-switching loading issues',
      'Improved data fetching performance'
    ],
    type: 'minor'
  },
  {
    version: '0.3.0',
    date: '2025-08-17',
    changes: [
      'Implemented walk-in registration system',
      'Added comprehensive booking logic',
      'Events management system',
      'Team management features',
      'Shift scheduling system'
    ],
    type: 'minor'
  },
  {
    version: '0.2.0',
    date: '2025-08-15',
    changes: [
      'Implemented authentication system',
      'Added page-level authorization',
      'Improved unauthorized access handling',
      'Visual improvements to slide-out menu'
    ],
    type: 'minor'
  },
  {
    version: '0.1.2',
    date: '2025-08-14',
    changes: [
      'Booking form UI implementation',
      'Various UI adjustments and tweaks'
    ],
    type: 'patch'
  },
  {
    version: '0.1.1',
    date: '2025-08-13',
    changes: [
      'Added global navigation menu',
      'Implemented bottom sheet component',
      'Added Inter font',
      'Text alignment and sizing improvements'
    ],
    type: 'patch'
  },
  {
    version: '0.1.0',
    date: '2025-08-12',
    changes: [
      'Initial app setup',
      'Basic UI implementation',
      'Project structure established'
    ],
    type: 'minor'
  }
];

export const currentVersion = versionHistory[0].version;