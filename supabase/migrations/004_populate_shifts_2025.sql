-- Script to populate shifts table with all Monday, Wednesday, Thursday dates until end of 2025
-- All shifts will be created as closed (is_open = false) by default
-- Admin can then enable specific dates as needed

DO $$
DECLARE
  curr_date DATE;
  end_date DATE;
BEGIN
  -- Start from today
  curr_date := CURRENT_DATE;
  -- End at December 31, 2025
  end_date := '2025-12-31'::DATE;
  
  WHILE curr_date <= end_date LOOP
    -- Monday shift (14:00-18:00)
    IF EXTRACT(dow FROM curr_date) = 1 THEN
      INSERT INTO public.shifts (
        date, 
        day_of_week, 
        start_time, 
        end_time, 
        is_open,
        max_capacity,
        created_by
      )
      VALUES (
        curr_date, 
        'monday', 
        '14:00:00', 
        '18:00:00', 
        false,  -- Default to closed
        20,
        auth.uid()
      )
      ON CONFLICT (date, day_of_week, start_time) DO NOTHING;
    END IF;
    
    -- Wednesday shift (12:00-16:00)
    IF EXTRACT(dow FROM curr_date) = 3 THEN
      INSERT INTO public.shifts (
        date, 
        day_of_week, 
        start_time, 
        end_time, 
        is_open,
        max_capacity,
        created_by
      )
      VALUES (
        curr_date, 
        'wednesday', 
        '12:00:00', 
        '16:00:00', 
        false,  -- Default to closed
        20,
        auth.uid()
      )
      ON CONFLICT (date, day_of_week, start_time) DO NOTHING;
    END IF;
    
    -- Thursday shift (16:00-20:00)
    IF EXTRACT(dow FROM curr_date) = 4 THEN
      INSERT INTO public.shifts (
        date, 
        day_of_week, 
        start_time, 
        end_time, 
        is_open,
        max_capacity,
        created_by
      )
      VALUES (
        curr_date, 
        'thursday', 
        '16:00:00', 
        '20:00:00', 
        false,  -- Default to closed
        20,
        auth.uid()
      )
      ON CONFLICT (date, day_of_week, start_time) DO NOTHING;
    END IF;
    
    curr_date := curr_date + 1;
  END LOOP;
  
  RAISE NOTICE 'Shifts populated until December 31, 2025';
END $$;

-- Verify the results
SELECT 
  date_trunc('month', date) as month,
  COUNT(*) as shift_count,
  COUNT(CASE WHEN is_open THEN 1 END) as open_shifts
FROM public.shifts
WHERE date >= CURRENT_DATE
GROUP BY date_trunc('month', date)
ORDER BY month;