export interface BookingConfirmationEmailData {
  email: string;
  date: string;
  time: string;
  repairType: string;
  duration: string;
  isGuest?: boolean;
  bookingId: string;
}

export interface BookingCancellationEmailData {
  email: string;
  date: string;
  time: string;
  repairType: string;
  cancelledBy: 'user' | 'admin';
  reason?: string;
}

export interface AdminResponseEmailData {
  email: string;
  userName?: string;
  originalMessage: string;
  adminResponse: string;
  messagePage: string;
}

export interface RoleChangeEmailData {
  email: string;
  userName?: string;
  newRole: 'admin' | 'mechanic' | 'host' | null;
  previousRole?: string | null;
}

export interface EmailResponse {
  success: boolean;
  error?: string;
  data?: {
    id: string;
    from: string;
    to: string[];
    created_at: string;
  };
}