export type DayOfWeek = 'monday' | 'wednesday' | 'thursday';

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
  max_capacity?: number;
  current_bookings?: number;
  notes?: string;
  mechanics?: ShiftUser[];
  hosts?: ShiftUser[];
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface ShiftSchedule {
  monday: { start: string; end: string; enabled: boolean };
  wednesday: { start: string; end: string; enabled: boolean };
  thursday: { start: string; end: string; enabled: boolean };
}

export const DEFAULT_SHIFTS: ShiftSchedule = {
  monday: { start: '14:00', end: '18:00', enabled: true },
  wednesday: { start: '12:00', end: '16:00', enabled: true },
  thursday: { start: '16:00', end: '20:00', enabled: true },
};