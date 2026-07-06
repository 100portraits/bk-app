'use client';

import { useState, useEffect } from 'react';
import { format, parseISO, endOfWeek, isAfter, isSameDay, parse, addDays } from 'date-fns';
import { supabase } from '@/lib/supabase/singleton-client';
import { Shift } from '@/types/shifts';

export const useUpcomingShifts = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingShifts = async () => {
      setLoading(true);
      try {
        const now = new Date();
        const today = format(now, 'yyyy-MM-dd');
        const endOfNextWeek = format(endOfWeek(addDays(now, 7), { weekStartsOn: 1 }), 'yyyy-MM-dd');

        const { data, error } = await supabase
          .from('shifts')
          .select('*')
          .eq('is_open', true)
          .gte('date', today)
          .lte('date', endOfNextWeek)
          .order('date')
          .order('start_time');

        if (error) {
          console.error('Error fetching shifts:', error);
        } else {
          const upcoming = (data || []).filter((shift) => {
            const shiftDate = parseISO(shift.date);
            const shiftEndTime = parse(shift.end_time, 'HH:mm:ss', shiftDate);

            if (isSameDay(shiftDate, now)) {
              return isAfter(shiftEndTime, now);
            }

            return isAfter(shiftDate, now);
          });

          setShifts(upcoming);
        }
      } catch (err) {
        console.error('Error fetching shifts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingShifts();
  }, []);

  return { shifts, loading };
};
