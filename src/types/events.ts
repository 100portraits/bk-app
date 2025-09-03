export type EventType = 'ride_out' | 'workshop' | 'borrel' | 'upcycling' | 'other';

export interface Event {
  id: string;
  title: string;
  description?: string;
  event_date: string; // ISO date string
  start_time: string; // HH:MM:SS format
  end_time?: string; // HH:MM:SS format
  location?: string;
  link?: string;
  whatsapp_link?: string;
  poster_url?: string;
  event_type?: EventType;
  is_published: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateEventInput {
  title: string;
  description?: string;
  event_date: string;
  start_time: string;
  end_time?: string;
  location?: string;
  link?: string;
  whatsapp_link?: string;
  poster_url?: string;
  event_type?: EventType;
  is_published?: boolean;
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
  id: string;
}