'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import TextInput from '@/components/ui/TextInput';
import VersionTracker from '@/components/ui/VersionTracker';
import { IconUser, IconPlus, IconMail, IconCheck } from '@tabler/icons-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  const router = useRouter();
  const supabase = createClient();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/home');
    }
  }, [user, router]);

  const handleBookAppointment = () => {
    // Show booking options dialog
    setShowBookingOptions(true);
  };

  const handleLogin = async () => {
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

  const handleForgotPassword = async () => {
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

  const handleRegister = async () => {
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <VersionTracker />
      <div className="flex justify-end p-4">
        <SecondaryButton
          onClick={() => {
            setLoginFromBooking(false);
            setShowLogin(true);
          }}
          icon={<IconUser size={20} />}
          className="bg-purple-100 text-purple-700 border-purple-200"
        >
          Log in
        </SecondaryButton>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bike Kitchen UvA
          </h1>
          <p className="text-xl text-gray-600 max-w-md">
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
      </div>

      <BottomSheetDialog
        title='Log In'
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
      >
        <div className="space-y-6">


          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              onClick={handleLogin}
              fullWidth
              className="bg-gray-900 hover:bg-gray-800"
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
                className="text-sm text-gray-600 underline hover:text-gray-800"
              >
                Forgot password?
              </button>
            </div>

            <div className="text-center">
              <span className="text-gray-600">Or </span>
              <button
                onClick={() => {
                  setShowLogin(false);
                  setShowRegister(true);
                  setName('');
                  setEmail('');
                  setPassword('');
                  setError('');
                }}
                className="text-purple-600 underline"
              >
                make an account
              </button>
            </div>
          </div>
        </div>
      </BottomSheetDialog>

      <BottomSheetDialog
        title='Create an Account'
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
      >
        <div className="space-y-6">


          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              onClick={handleRegister}
              fullWidth
              className="bg-gray-900 hover:bg-gray-800"
              disabled={loading || !email || !password || !confirmPassword}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </PrimaryButton>
          </div>
        </div>
      </BottomSheetDialog>

      <BottomSheetDialog
        title='You are not logged in.'
        isOpen={showBookingOptions}
        onClose={() => setShowBookingOptions(false)}
      >
        <div className="space-y-2">
          <p className="text-lg text-gray-600 font-medium">
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
            <span className="text-gray-500 font-medium px-2">or</span>

            <PrimaryButton
              onClick={() => {
                setShowBookingOptions(false);
                setLoginFromBooking(true);
                setShowLogin(true);
              }}
            >
              log in
            </PrimaryButton>

            <span className="text-gray-600 text-lg">?</span>
          </div>

          <div className="border-t border-gray-100 pt-6 space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-100">
              <p className="text-gray-700 font-medium">
                Bookings made with an account can be managed easily through the app.
              </p>
            </div>

            <p className="text-gray-600 text-center">
              Want to{' '}
              <button
                onClick={() => {
                  setShowBookingOptions(false);
                  setLoginFromBooking(true);
                  setShowRegister(true);
                }}
                className="text-purple-600 font-semibold hover:text-purple-700 underline underline-offset-2 transition-colors"
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
        <div className="space-y-6">
          <p className="text-gray-600">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              onClick={handleForgotPassword}
              fullWidth
              className="bg-gray-900 hover:bg-gray-800"
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
                className="text-sm text-purple-600 underline hover:text-purple-700"
              >
                Back to login
              </button>
            </div>
          </div>
        </div>
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
            <h2 className="text-2xl font-bold text-gray-900">
              Check your email!
            </h2>
            
            <p className="text-gray-600">
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
              className="bg-gray-900 hover:bg-gray-800"
            >
              <IconCheck size={20} className="mr-2" />
              Got it, I'll check my email
            </PrimaryButton>
            
            <div className="text-center text-sm text-gray-600">
              <p>Once confirmed, you can log in with your credentials.</p>
            </div>
          </div>
        </div>
      </BottomSheetDialog>
    </div>
  );
}
