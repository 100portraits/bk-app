export interface Version {
  version: string;
  date: string;
  changes: string[];
  type: 'major' | 'minor' | 'patch';
}

export const versionHistory: Version[] = [
  {
    version: '0.6.0',
    date: '2025-01-21',
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
    date: '2025-01-20',
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
    date: '2025-01-20',
    changes: [
      'Minor booking form tweaks',
      'Improved guest booking flow'
    ],
    type: 'patch'
  },
  {
    version: '0.4.1',
    date: '2025-01-19',
    changes: [
      'Added admin messages inbox for help requests',
      'Fixed help messages database schema',
      'Fixed various TypeScript errors and type safety issues'
    ],
    type: 'patch'
  },
  {
    version: '0.4.0',
    date: '2025-01-18',
    changes: [
      'Major API architecture refactor',
      'Fixed tab-switching loading issues',
      'Improved data fetching performance'
    ],
    type: 'minor'
  },
  {
    version: '0.3.0',
    date: '2025-01-17',
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
    date: '2025-01-15',
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
    date: '2025-01-14',
    changes: [
      'Booking form UI implementation',
      'Various UI adjustments and tweaks'
    ],
    type: 'patch'
  },
  {
    version: '0.1.1',
    date: '2025-01-13',
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
    date: '2025-01-12',
    changes: [
      'Initial app setup',
      'Basic UI implementation',
      'Project structure established'
    ],
    type: 'minor'
  }
];

export const currentVersion = versionHistory[0].version;