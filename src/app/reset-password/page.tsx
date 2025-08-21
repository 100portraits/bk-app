'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PrimaryButton from '@/components/ui/PrimaryButton';
import TextInput from '@/components/ui/TextInput';
import { createClient } from '@/lib/supabase/client';
import { IconCheck, IconX } from '@tabler/icons-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check if we have a valid recovery token
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          setError('Invalid or expired reset link. Please request a new one.');
          setIsValidToken(false);
        } else {
          setIsValidToken(true);
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
        setIsValidToken(false);
      } finally {
        setCheckingToken(false);
      }
    };

    checkSession();
  }, []);

  const handleResetPassword = async () => {
    setError('');
    
    // Validate passwords
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        // Sign out to clear the recovery session
        await supabase.auth.signOut();
        
        // Redirect to home page with success message after a delay
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (checkingToken) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 dark:border-accent-400 mx-auto"></div>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
            Reset Your Password
          </h1>

          {!isValidToken ? (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-lg flex items-start gap-3">
                <IconX className="text-red-500 mt-0.5" size={20} />
                <div>
                  <p className="font-medium">Invalid Reset Link</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
              <PrimaryButton
                onClick={() => router.push('/')}
                fullWidth
                className="bg-zinc-900 hover:bg-zinc-800"
              >
                Back to Home
              </PrimaryButton>
            </div>
          ) : success ? (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 p-4 rounded-lg flex items-start gap-3">
                <IconCheck className="text-green-500 mt-0.5" size={20} />
                <div>
                  <p className="font-medium">Password Reset Successful!</p>
                  <p className="text-sm mt-1">Your password has been updated. Redirecting to login...</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-zinc-600 dark:text-zinc-400">
                Enter your new password below. Make sure it's at least 6 characters long.
              </p>

              {error && (
                <div className="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    New Password
                  </label>
                  <TextInput
                    type="password"
                    placeholder="Enter new password"
                    fullWidth
                    value={password}
                    onChange={setPassword}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Confirm New Password
                  </label>
                  <TextInput
                    type="password"
                    placeholder="Confirm new password"
                    fullWidth
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    disabled={loading}
                  />
                </div>

                <PrimaryButton
                  onClick={handleResetPassword}
                  fullWidth
                  className="bg-zinc-900 hover:bg-zinc-800"
                  disabled={loading || !password || !confirmPassword}
                >
                  {loading ? 'Updating...' : 'Reset Password'}
                </PrimaryButton>

                <div className="text-center">
                  <button
                    onClick={() => router.push('/')}
                    className="text-sm text-zinc-600 dark:text-zinc-400 underline hover:text-zinc-800 dark:hover:text-zinc-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}