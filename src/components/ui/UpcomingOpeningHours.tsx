'use client';

import { IconClock } from '@tabler/icons-react';
import {
  format,
  parseISO,
  isToday,
  isTomorrow,
  isSameWeek,
} from 'date-fns';
import { Shift } from '@/types/shifts';
import { useUpcomingShifts } from '@/hooks/useUpcomingShifts';

type UpcomingOpeningHoursProps = {
  variant?: 'inline' | 'card';
  className?: string;
};

const getDayLabel = (date: Date) => {
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'EEEE');
};

const formatTime = (time: string) => time.substring(0, 5);

const groupShifts = (shifts: Shift[]) => {
  const now = new Date();
  const thisWeek = shifts.filter((shift) =>
    isSameWeek(parseISO(shift.date), now, { weekStartsOn: 1 })
  );
  const nextWeek = shifts.filter(
    (shift) => !isSameWeek(parseISO(shift.date), now, { weekStartsOn: 1 })
  );
  return { thisWeek, nextWeek };
};

const InlineShiftRow = ({ shift }: { shift: Shift }) => {
  const date = parseISO(shift.date);
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-zinc-600 dark:text-zinc-400 font-medium min-w-[80px]">
        {getDayLabel(date)}
      </span>
      <span className="text-zinc-700 dark:text-zinc-300">
        {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
      </span>
    </div>
  );
};

const CardShiftRow = ({ shift }: { shift: Shift }) => {
  const date = parseISO(shift.date);
  const today = isToday(date);

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <span
          className={`text-sm font-medium ${
            today
              ? 'text-accent-600 dark:text-accent-400'
              : 'text-zinc-700 dark:text-zinc-300'
          }`}
        >
          {getDayLabel(date)}
        </span>
        {today && (
          <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded bg-accent-100 dark:bg-accent-900/50 text-accent-700 dark:text-accent-300">
            Open
          </span>
        )}
      </div>
      <span className="text-sm text-zinc-500 dark:text-zinc-400 tabular-nums">
        {formatTime(shift.start_time)} – {formatTime(shift.end_time)}
      </span>
    </div>
  );
};

const LoadingSkeleton = ({ variant }: { variant: 'inline' | 'card' }) => {
  if (variant === 'card') {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <div className="w-20 h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
            <div className="w-24 h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-20 h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="w-24 h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
};

const ShiftGroup = ({
  label,
  shifts,
  variant,
}: {
  label: string;
  shifts: Shift[];
  variant: 'inline' | 'card';
}) => {
  if (shifts.length === 0) return null;

  const Row = variant === 'card' ? CardShiftRow : InlineShiftRow;

  return (
    <div>
      <h4
        className={`font-semibold uppercase tracking-wide mb-2 ${
          variant === 'card'
            ? 'text-[11px] text-zinc-400 dark:text-zinc-500'
            : 'text-xs text-zinc-500 dark:text-zinc-500'
        }`}
      >
        {label}
      </h4>
      <div className={variant === 'card' ? 'divide-y divide-zinc-100 dark:divide-zinc-700/50' : 'space-y-1.5'}>
        {shifts.map((shift) => (
          <Row key={shift.id} shift={shift} />
        ))}
      </div>
    </div>
  );
};

const UpcomingOpeningHours = ({
  variant = 'inline',
  className = '',
}: UpcomingOpeningHoursProps) => {
  const { shifts, loading } = useUpcomingShifts();
  const { thisWeek, nextWeek } = groupShifts(shifts);

  if (variant === 'card') {
    return (
      <section
        className={`bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden ${className}`}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100 dark:border-zinc-700/80">
          <div className="w-10 h-10 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center shrink-0">
            <IconClock size={20} className="text-accent-600 dark:text-accent-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white leading-tight">
              Opening Hours
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Next two weeks</p>
          </div>
        </div>

        <div className="px-5 py-4">
          {loading ? (
            <LoadingSkeleton variant="card" />
          ) : shifts.length > 0 ? (
            <div className="space-y-4">
              <ShiftGroup label="This week" shifts={thisWeek} variant="card" />
              <ShiftGroup label="Next week" shifts={nextWeek} variant="card" />
            </div>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No upcoming shifts scheduled
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <div className={`max-w-lg ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <IconClock size={18} className="text-zinc-600 dark:text-zinc-400" />
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Upcoming Opening Hours
        </h3>
      </div>

      {loading ? (
        <LoadingSkeleton variant="inline" />
      ) : shifts.length > 0 ? (
        <div className="space-y-3">
          <ShiftGroup label="This Week" shifts={thisWeek} variant="inline" />
          <ShiftGroup label="Next Week" shifts={nextWeek} variant="inline" />
        </div>
      ) : (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No upcoming shifts scheduled
        </p>
      )}
    </div>
  );
};

export default UpcomingOpeningHours;
