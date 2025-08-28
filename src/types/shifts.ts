export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface ShiftUser {
  id: string;
  email: string;
  name: string;
  added_at: string;
}

export interface Shift {
  id: string;
  date: string; // ISO date string
  day_of_week: DayOfWeek;
  start_time: string; // HH:MM:SS format
  end_time: string; // HH:MM:SS format
  is_open: boolean;
  notes?: string;
  mechanics?: ShiftUser[];
  hosts?: ShiftUser[];
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface ShiftSchedule {
  [key: string]: { start: string; end: string; enabled: boolean };
}

export const DEFAULT_SHIFTS: ShiftSchedule = {
  monday: { start: '14:00', end: '18:00', enabled: true },
  tuesday: { start: '12:00', end: '16:00', enabled: false },
  wednesday: { start: '12:00', end: '16:00', enabled: true },
  thursday: { start: '16:00', end: '20:00', enabled: true },
  friday: { start: '14:00', end: '18:00', enabled: false },
  saturday: { start: '10:00', end: '14:00', enabled: false },
  sunday: { start: '10:00', end: '14:00', enabled: false },
};

export const DAY_NAMES: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};