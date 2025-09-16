'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import TextInput from '@/components/ui/TextInput';
import VersionTracker from '@/components/ui/VersionTracker';
import { IconUser, IconPlus, IconMail, IconCheck, IconClock } from '@tabler/icons-react';
import { supabase } from '@/lib/supabase/singleton-client';
import { useAuth } from '@/contexts/AuthContext';
import { format, parseISO, startOfWeek, endOfWeek, isToday, isTomorrow, isAfter, isSameDay, parse, addDays, isSameWeek } from 'date-fns';
import { Shift } from '@/types/shifts';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showBookingOptions, setShowBookingOptions] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [loginFromBooking, setLoginFromBooking] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [upcomingShifts, setUpcomingShifts] = useState<Shift[]>([]);
  const [loadingShifts, setLoadingShifts] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/home');
    }
  }, [user, router]);

  // Fetch upcoming shifts in the next week that haven't passed yet
  useEffect(() => {
    const fetchUpcomingShifts = async () => {
      setLoadingShifts(true);
      try {
        const now = new Date();
        const today = format(now, 'yyyy-MM-dd');
        const endOfNextWeek = format(endOfWeek(addDays(now, 7), { weekStartsOn: 1 }), 'yyyy-MM-dd');

        // Fetch shifts from today to end of next week
        const { data: shifts, error } = await supabase
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
          // Filter out shifts that have already passed today
          const upcomingShifts = (shifts || []).filter(shift => {
            const shiftDate = parseISO(shift.date);
            const shiftEndTime = parse(shift.end_time, 'HH:mm:ss', shiftDate);

            // If the shift is today, check if it has ended
            if (isSameDay(shiftDate, now)) {
              return isAfter(shiftEndTime, now);
            }

            // If the shift is in the future, include it
            return isAfter(shiftDate, now);
          });

          setUpcomingShifts(upcomingShifts);
        }
      } catch (err) {
        console.error('Error fetching shifts:', err);
      } finally {
        setLoadingShifts(false);
      }
    };

    fetchUpcomingShifts();
  }, []);

  const handleBookAppointment = () => {
    // Show booking options dialog
    setShowBookingOptions(true);
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setShowLogin(false);
        setShowBookingOptions(false);
        // Refresh to ensure middleware picks up the new session
        router.refresh();
        // If login was initiated from booking flow, go to booking
        // Otherwise go to home
        if (loginFromBooking) {
          router.push('/booking/new');
        } else {
          router.push('/home');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Check your email for the password reset link!');
        setTimeout(() => {
          setShowForgotPassword(false);
          setSuccess('');
          setResetEmail('');
        }, 3000);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0] // Use name or email username as fallback
          }
        }
      });

      if (error) {
        setError(error.message);
      } else {
        setShowRegister(false);
        setShowEmailConfirmation(true);
        // Clear form fields
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex flex-col">
      <VersionTracker />
      <div className="absolute top-4 right-4">
        <SecondaryButton
          onClick={() => {
            setLoginFromBooking(false);
            setShowLogin(true);
          }}
          icon={<IconUser size={22} />}
          className="bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 border-accent-200 dark:border-accent-700"
          size='md'
        >
          <span className='text-lg'>Log in</span>
        </SecondaryButton>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Bike Kitchen UvA
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-md">
            Your innovative, circular bike workshop at the Roeterseilandcampus.
          </p>
        </div>

        <PrimaryButton
          onClick={handleBookAppointment}
          icon={<IconPlus size={20} />}
          size="lg"
        >
          Book an appointment
        </PrimaryButton>

        {/* Opening Hours */}
        <div className="mt-8 max-w-lg">
          <div className="flex items-center gap-2 mb-3">
            <IconClock size={18} className="text-zinc-600 dark:text-zinc-400" />
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Upcoming Opening Hours
            </h3>
          </div>
          
          {loadingShifts ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-20 h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                  <div className="w-24 h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : upcomingShifts.length > 0 ? (
            <div className="space-y-3">
              {(() => {
                const now = new Date();
                const thisWeekShifts = upcomingShifts.filter(shift =>
                  isSameWeek(parseISO(shift.date), now, { weekStartsOn: 1 })
                );
                const nextWeekShifts = upcomingShifts.filter(shift =>
                  !isSameWeek(parseISO(shift.date), now, { weekStartsOn: 1 })
                );

                return (
                  <>
                    {thisWeekShifts.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-500 uppercase tracking-wide mb-2">
                          This Week
                        </h4>
                        <div className="space-y-1.5">
                          {thisWeekShifts.map((shift) => {
                            const date = parseISO(shift.date);
                            const dayLabel = isToday(date) ? 'Today' : isTomorrow(date) ? 'Tomorrow' : format(date, 'EEEE');
                            const startTime = shift.start_time.substring(0, 5);
                            const endTime = shift.end_time.substring(0, 5);

                            return (
                              <div key={shift.id} className="flex items-center gap-3 text-sm">
                                <span className="text-zinc-600 dark:text-zinc-400 font-medium min-w-[80px]">
                                  {dayLabel}
                                </span>
                                <span className="text-zinc-700 dark:text-zinc-300">
                                  {startTime} - {endTime}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {nextWeekShifts.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-500 uppercase tracking-wide mb-2">
                          Next Week
                        </h4>
                        <div className="space-y-1.5">
                          {nextWeekShifts.map((shift) => {
                            const date = parseISO(shift.date);
                            const dayLabel = format(date, 'EEEE');
                            const startTime = shift.start_time.substring(0, 5);
                            const endTime = shift.end_time.substring(0, 5);

                            return (
                              <div key={shift.id} className="flex items-center gap-3 text-sm">
                                <span className="text-zinc-600 dark:text-zinc-400 font-medium min-w-[80px]">
                                  {dayLabel}
                                </span>
                                <span className="text-zinc-700 dark:text-zinc-300">
                                  {startTime} - {endTime}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No upcoming shifts scheduled
            </p>
          )}
        </div>
      </div>

      <BottomSheetDialog
        title='Log In'
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
      >
        <form onSubmit={handleLogin} className="space-y-6">


          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Email
              </label>
              <TextInput
                type="email"
                placeholder="Enter your email"
                fullWidth
                value={email}
                onChange={setEmail}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Password
              </label>
              <TextInput
                type="password"
                placeholder="Enter your password"
                fullWidth
                value={password}
                onChange={setPassword}
              />
            </div>

            <PrimaryButton
              type="submit"
              fullWidth
              className="bg-zinc-900 dark:bg-zinc-700 hover:bg-zinc-800 dark:hover:bg-zinc-600"
              disabled={loading || !email || !password}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </PrimaryButton>

            <div className="text-center">
              <button 
                onClick={() => {
                  setShowLogin(false);
                  setShowForgotPassword(true);
                  setResetEmail(email); // Pre-fill with email if entered
                  setError('');
                }}
                className="text-sm text-zinc-600 dark:text-zinc-400 underline hover:text-zinc-800 dark:hover:text-zinc-200"
              >
                Forgot password?
              </button>
            </div>

            <div className="text-center">
              <span className="text-zinc-600 dark:text-zinc-400">Or </span>
              <button
                onClick={() => {
                  setShowLogin(false);
                  setShowRegister(true);
                  setName('');
                  setEmail('');
                  setPassword('');
                  setError('');
                }}
                className="text-accent-600 dark:text-accent-400 underline"
              >
                make an account
              </button>
            </div>
          </div>
        </form>
      </BottomSheetDialog>

      <BottomSheetDialog
        title='Create an Account'
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
      >
        <form onSubmit={handleRegister} className="space-y-6">


          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Name
              </label>
              <TextInput
                type="text"
                placeholder="Enter your name"
                fullWidth
                value={name}
                onChange={setName}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Email
              </label>
              <TextInput
                type="email"
                placeholder="Enter your email"
                fullWidth
                value={email}
                onChange={setEmail}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Password
              </label>
              <TextInput
                type="password"
                placeholder="Enter your password"
                fullWidth
                value={password}
                onChange={setPassword}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Repeat Password
              </label>
              <TextInput
                type="password"
                placeholder="Confirm your password"
                fullWidth
                value={confirmPassword}
                onChange={setConfirmPassword}
              />
            </div>

            <PrimaryButton
              type="submit"
              fullWidth
              className="bg-zinc-900 dark:bg-zinc-700 hover:bg-zinc-800 dark:hover:bg-zinc-600"
              disabled={loading || !email || !password || !confirmPassword}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </PrimaryButton>
          </div>
        </form>
      </BottomSheetDialog>

      <BottomSheetDialog
        title='You are not logged in.'
        isOpen={showBookingOptions}
        onClose={() => setShowBookingOptions(false)}
      >
        <div className="space-y-2">
          <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium">
            Would you like to
          </p>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <PrimaryButton
              onClick={() => {
                setShowBookingOptions(false);
                router.push('/booking/guest');
              }}
            >
              continue as guest
            </PrimaryButton>
            <span className="text-zinc-500 dark:text-zinc-400 font-medium px-2">or</span>

            <PrimaryButton
              onClick={() => {
                setShowBookingOptions(false);
                setLoginFromBooking(true);
                setShowLogin(true);
              }}
            >
              log in
            </PrimaryButton>

            <span className="text-zinc-600 dark:text-zinc-400 text-lg">?</span>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-700 pt-6 space-y-4">
            <div className="bg-gradient-to-r from-accent-50 to-indigo-50 dark:from-accent-950 dark:to-indigo-950 rounded-xl p-5 border border-accent-100 dark:border-accent-800">
              <p className="text-zinc-700 dark:text-zinc-300 font-medium">
                Bookings made with an account can be managed easily through the new webpage.
              </p>
            </div>

            <p className="text-zinc-600 dark:text-zinc-400 text-center">
              Want to{' '}
              <button
                onClick={() => {
                  setShowBookingOptions(false);
                  setLoginFromBooking(true);
                  setShowRegister(true);
                }}
                className="text-accent-600 dark:text-accent-400 font-semibold hover:text-accent-700 dark:hover:text-accent-300 underline underline-offset-2 transition-colors"
              >
                make an account
              </button>
              ?
            </p>
          </div>
        </div>
      </BottomSheetDialog>

      <BottomSheetDialog
        title='Reset Password'
        isOpen={showForgotPassword}
        onClose={() => {
          setShowForgotPassword(false);
          setError('');
          setSuccess('');
        }}
      >
        <form onSubmit={handleForgotPassword} className="space-y-6">
          <p className="text-zinc-600 dark:text-zinc-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
                {success}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Email Address
              </label>
              <TextInput
                type="email"
                placeholder="Enter your email"
                fullWidth
                value={resetEmail}
                onChange={setResetEmail}
                disabled={loading || !!success}
              />
            </div>

            <PrimaryButton
              type="submit"
              fullWidth
              className="bg-zinc-900 dark:bg-zinc-700 hover:bg-zinc-800 dark:hover:bg-zinc-600"
              disabled={loading || !resetEmail || !!success}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </PrimaryButton>

            <div className="text-center">
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setShowLogin(true);
                  setError('');
                  setSuccess('');
                }}
                className="text-sm text-accent-600 dark:text-accent-400 underline hover:text-accent-700 dark:hover:text-accent-300"
              >
                Back to login
              </button>
            </div>
          </div>
        </form>
      </BottomSheetDialog>

      <BottomSheetDialog
        title=''
        isOpen={showEmailConfirmation}
        onClose={() => {
          setShowEmailConfirmation(false);
          setShowLogin(true);
        }}
      >
        <div className="space-y-6 py-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <IconMail size={40} className="text-green-600" />
            </div>
          </div>
          
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              Check your email!
            </h2>
            
            <p className="text-zinc-600 dark:text-zinc-400">
              We've sent a confirmation link to your email address. 
              Please check your inbox and click the link to verify your account.
            </p>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
              <p className="text-amber-800">
                <strong>Note:</strong> The email might take a few minutes to arrive. 
                Don't forget to check your spam folder if you don't see it.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <PrimaryButton
              onClick={() => {
                setShowEmailConfirmation(false);
                setShowLogin(true);
              }}
              fullWidth
              className="bg-zinc-900 dark:bg-zinc-700 hover:bg-zinc-800 dark:hover:bg-zinc-600"
            >
              <IconCheck size={20} className="mr-2" />
              Got it, I'll check my email
            </PrimaryButton>
            
            <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              <p>Once confirmed, you can log in with your credentials.</p>
            </div>
          </div>
        </div>
      </BottomSheetDialog>
    </div>
  );
}
