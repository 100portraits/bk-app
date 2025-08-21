export interface WalkIn {
  id: string;
  created_by: string;
  is_community_member: boolean;
  amount_paid: number | null; // null for community members
  notes?: string;
  date: string; // Date when the walk-in occurred (YYYY-MM-DD)
  created_at: string;
  updated_at: string;
  
  // Joined data
  creator?: {
    email: string;
  };
}

export interface CreateWalkInInput {
  is_community_member: boolean;
  amount_paid?: number;
  notes?: string;
  date?: string; // Optional date (YYYY-MM-DD format), defaults to today
}

export interface UpdateWalkInInput {
  is_community_member?: boolean;
  amount_paid?: number | null;
  notes?: string;
}