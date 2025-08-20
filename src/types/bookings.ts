export type RepairType = 'tire_tube' | 'chain' | 'brakes' | 'gears' | 'wheel' | 'other';
export type BookingStatus = 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export interface RepairDetails {
  // For tire/tube repairs
  wheelPosition?: 'front' | 'rear';
  bikeType?: 'city' | 'road';
  
  // For brake repairs
  brakeType?: 'rim' | 'coaster' | 'disc';
  
  // For other repairs
  description?: string;
}

export interface Booking {
  id: string;
  user_id: string;
  shift_id: string;
  slot_time: string; // HH:MM:SS format
  duration_minutes: number;
  repair_type: RepairType;
  repair_details: RepairDetails;
  status: BookingStatus;
  notes?: string;
  is_member: boolean;
  created_at: string;
  updated_at: string;
  
  // Joined data
  user?: {
    email: string;
    member: boolean;
  };
  shift?: {
    date: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
  };
}

export interface CreateBookingInput {
  shift_id: string;
  slot_time: string;
  duration_minutes: number;
  repair_type: RepairType;
  repair_details: RepairDetails;
  notes?: string;
  is_member?: boolean;
}

export interface TimeSlot {
  time: string; // HH:MM format
  available: boolean;
  reason?: 'booked' | 'insufficient_time' | 'past_time';
}

export interface AvailableSlot {
  shift_id: string;
  date: string;
  day_of_week: string;
  slots: TimeSlot[];
}

// Helper function to convert display repair type to database format
export function toDbRepairType(displayType: string): RepairType {
  const mapping: Record<string, RepairType> = {
    'Tire/Tube': 'tire_tube',
    'Chain': 'chain',
    'Brakes': 'brakes',
    'Gears': 'gears',
    'Wheel': 'wheel',
    'Other': 'other'
  };
  return mapping[displayType] || 'other';
}

// Helper function to calculate repair duration in minutes
export function getRepairDuration(
  repairType: string,
  details: RepairDetails
): number {
  switch(repairType) {
    case 'Tire/Tube':
      if (details.wheelPosition === 'front') return 30;
      if (details.wheelPosition === 'rear' && details.bikeType === 'city') return 60;
      if (details.wheelPosition === 'rear' && details.bikeType === 'road') return 40;
      return 45;
    case 'Chain':
      if (details.bikeType === 'city') return 45;
      if (details.bikeType === 'road') return 30;
      return 35;
    case 'Brakes':
      if (details.brakeType === 'rim') return 30;
      if (details.brakeType === 'coaster') return 40;
      if (details.brakeType === 'disc') return 45;
      return 35;
    case 'Gears':
      if (details.bikeType === 'city') return 60;
      if (details.bikeType === 'road') return 40;
      return 45;
    case 'Wheel':
      return 60;
    case 'Other':
      return 45;
    default:
      return 45;
  }
}