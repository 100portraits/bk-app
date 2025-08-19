-- Create shifts table to track open workshop times
CREATE TABLE IF NOT EXISTS public.shifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('monday', 'wednesday', 'thursday')),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_open BOOLEAN NOT NULL DEFAULT true,
  max_capacity INTEGER DEFAULT 20, -- Maximum people allowed in the workshop
  current_bookings INTEGER DEFAULT 0, -- Current number of bookings
  notes TEXT, -- Optional notes about the shift
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_by UUID REFERENCES auth.users(id),
  
  -- Ensure unique shift per date and time
  UNIQUE(date, day_of_week, start_time)
);

-- Create index for faster queries
CREATE INDEX idx_shifts_date ON public.shifts(date);
CREATE INDEX idx_shifts_day_of_week ON public.shifts(day_of_week);
CREATE INDEX idx_shifts_is_open ON public.shifts(is_open);

-- Enable RLS
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;

-- Policies for shifts table

-- Everyone can view open shifts
CREATE POLICY "Anyone can view open shifts" ON public.shifts
  FOR SELECT
  USING (is_open = true);

-- Admins can view all shifts
CREATE POLICY "Admins can view all shifts" ON public.shifts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can insert shifts
CREATE POLICY "Only admins can insert shifts" ON public.shifts
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can update shifts
CREATE POLICY "Only admins can update shifts" ON public.shifts
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can delete shifts
CREATE POLICY "Only admins can delete shifts" ON public.shifts
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE TRIGGER update_shifts_updated_at
  BEFORE UPDATE ON public.shifts
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();