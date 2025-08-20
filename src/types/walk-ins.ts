export interface WalkIn {
  id: string;
  created_by: string;
  is_community_member: boolean;
  amount_paid: number | null; // null for community members
  notes?: string;
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
}

export interface UpdateWalkInInput {
  is_community_member?: boolean;
  amount_paid?: number | null;
  notes?: string;
}