export const mockUser = {
  name: 'Sahir',
  email: 'sahirde@gmail.com',
  roles: ['Member', 'Participant', 'Mechanic', 'Host', 'Admin'],
  memberSince: '02-12-2024'
};

export const mockBookings = [
  {
    id: '1',
    customerName: 'Sahir',
    time: '14:00',
    date: '25-08-2025',
    dayOfWeek: 'Monday',
    repairType: 'Tire/Tube (Front)',
    bikeType: 'City Bike',
    mechanic: 'Woy-tek',
    experienceLevel: 3,
    status: 'pending' as const,
    isUpcoming: true
  },
  {
    id: '2',
    customerName: 'Sahir',
    time: '16:00',
    date: '17-08-2025',
    dayOfWeek: 'Monday',
    repairType: 'Chain',
    bikeType: 'Road Bike',
    mechanic: 'Woy-tek',
    experienceLevel: 5,
    status: 'completed' as const,
    isUpcoming: false
  }
];

export const mockEvents = [
  {
    id: '1',
    title: 'Ride Out',
    subtitle: 'Gooi&Vecht',
    date: '03',
    dayOfWeek: 'Mon',
    month: 'August',
    location: 'Central Station',
    time: '12:00-16:00',
    whatsappGroup: 'https://chat.whatsapp.com/example'
  },
  {
    id: '2',
    title: 'Workshop',
    subtitle: 'Gears and shifters',
    date: '12',
    dayOfWeek: 'Wed',
    month: 'August',
    location: 'Bike Kitchen',
    time: '18:00-20:00'
  },
  {
    id: '3',
    title: 'Upcycling',
    subtitle: '@ De Sering',
    date: '20',
    dayOfWeek: 'Sat',
    month: 'August',
    location: 'De Sering',
    time: '14:00-17:00'
  },
  {
    id: '4',
    title: 'Community Borrel',
    subtitle: 'Monthly social',
    date: '28',
    dayOfWeek: 'Thu',
    month: 'August',
    location: 'Bike Kitchen',
    time: '19:00-22:00'
  }
];

export const mockWalkIns = [
  {
    id: '1',
    amount: 5.00,
    timestamp: '14:04',
    isCommunityMember: false,
    recordedAt: new Date('2025-08-19T14:04:00')
  },
  {
    id: '2',
    amount: 'Community Member',
    timestamp: '15:30',
    isCommunityMember: true,
    recordedAt: new Date('2025-08-19T15:30:00')
  }
];

export const mockShifts = [
  {
    id: '1',
    date: 'Monday, 3rd August',
    startTime: '14:00',
    endTime: '18:00',
    mechanic: 'Sahir',
    hosts: ['David', 'Maud']
  },
  {
    id: '2',
    date: 'Monday, 10th August',
    startTime: '14:00',
    endTime: '18:00',
    mechanic: 'Woy-tek',
    hosts: ['Sarah', 'Tom']
  },
  {
    id: '3',
    date: 'Monday, 17th August',
    startTime: '14:00',
    endTime: '18:00',
    mechanic: 'Sahir',
    hosts: ['David', 'Lisa']
  },
  {
    id: '4',
    date: 'Monday, 24th August',
    startTime: '14:00',
    endTime: '18:00',
    mechanic: 'Chain',
    hosts: ['Maud', 'Alex']
  }
];

export const mockTeam = {
  admins: ['Sahir', 'Chain'],
  mechanics: {
    'Tire/Tube': ['Woy-tek', 'Sarah'],
    'Chain': ['Chain', 'Tom'],
    'Brakes': ['David', 'Lisa'],
    'Gears': ['Sahir', 'Alex'],
    'Other': ['Woy-tek', 'Chain']
  },
  hosts: ['David', 'Maud', 'Sarah', 'Tom', 'Lisa', 'Alex']
};

export const mockAvailableDates = [
  new Date('2025-08-20'),
  new Date('2025-08-21'),
  new Date('2025-08-22'),
  new Date('2025-08-25'),
  new Date('2025-08-26'),
  new Date('2025-08-27'),
  new Date('2025-08-28'),
  new Date('2025-08-29')
];

export const mockTimeSlots = [
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

export const quickLinksOptions = [
  {
    id: 'booking-form',
    title: 'Booking form',
    subtitle: 'Make an appointment',
    path: '/booking/new'
  },
  {
    id: 'host-app',
    title: 'Host app',
    subtitle: 'Manage today\'s bookings',
    path: '/host'
  },
  {
    id: 'event-calendar',
    title: 'Event calendar',
    subtitle: 'Members-only!',
    path: '/membership/events'
  },
  {
    id: 'my-data',
    title: 'My data',
    subtitle: 'Involvement history',
    path: '/booking/manage'
  }
];

export const widgetOptions = [
  {
    id: 'upcoming-events',
    title: 'Upcoming Events',
    subtitle: 'See your next events'
  },
  {
    id: 'next-appointment',
    title: 'Next appointment',
    subtitle: 'Your next booking'
  }
];