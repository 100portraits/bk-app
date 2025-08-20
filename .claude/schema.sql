-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  email text NOT NULL,
  shift_id uuid,
  slot_time time without time zone NOT NULL,
  duration_minutes integer NOT NULL CHECK (duration_minutes = ANY (ARRAY[30, 40, 45, 60])),
  repair_type text NOT NULL CHECK (repair_type = ANY (ARRAY['tire_tube'::text, 'chain'::text, 'brakes'::text, 'gears'::text, 'wheel'::text, 'other'::text])),
  repair_details jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'confirmed'::text CHECK (status = ANY (ARRAY['confirmed'::text, 'cancelled'::text, 'completed'::text, 'no_show'::text])),
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_member boolean NOT NULL DEFAULT false,
  CONSTRAINT bookings_pkey PRIMARY KEY (id),
  CONSTRAINT bookings_shift_id_fkey FOREIGN KEY (shift_id) REFERENCES public.shifts(id),
  CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date date NOT NULL,
  start_time time without time zone NOT NULL,
  end_time time without time zone,
  location text,
  whatsapp_link text,
  poster_url text,
  max_capacity integer,
  is_published boolean DEFAULT false,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT events_pkey PRIMARY KEY (id),
  CONSTRAINT events_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.help_messages (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  page_name text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  read_at timestamp with time zone,
  response text,
  responded_at timestamp with time zone,
  CONSTRAINT help_messages_pkey PRIMARY KEY (id),
  CONSTRAINT help_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.shifts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  date date NOT NULL,
  day_of_week text NOT NULL CHECK (day_of_week = ANY (ARRAY['monday'::text, 'wednesday'::text, 'thursday'::text])),
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  is_open boolean NOT NULL DEFAULT true,
  max_capacity integer DEFAULT 20,
  current_bookings integer DEFAULT 0,
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  created_by uuid,
  mechanics jsonb DEFAULT '[]'::jsonb,
  hosts jsonb DEFAULT '[]'::jsonb,
  CONSTRAINT shifts_pkey PRIMARY KEY (id),
  CONSTRAINT shifts_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);
CREATE TABLE public.user_profiles (
  id uuid NOT NULL,
  email text NOT NULL,
  name text NOT NULL,
  member boolean NOT NULL DEFAULT false,
  role text CHECK ((role = ANY (ARRAY['host'::text, 'mechanic'::text, 'admin'::text])) OR role IS NULL),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT user_profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.walk_ins (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_by uuid NOT NULL,
  is_community_member boolean NOT NULL DEFAULT false,
  amount_paid numeric,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT walk_ins_pkey PRIMARY KEY (id),
  CONSTRAINT walk_ins_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.user_profiles(id)
);