'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PrimaryButton from '@/components/ui/PrimaryButton';
import SecondaryButton from '@/components/ui/SecondaryButton';
import BottomSheetDialog from '@/components/ui/BottomSheetDialog';
import TextInput from '@/components/ui/TextInput';
import { IconUser, IconPlus } from '@tabler/icons-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
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
    router.push('/booking/new');
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
        router.push('/home');
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
      });
      
      if (error) {
        setError(error.message);
      } else {
        setShowRegister(false);
        alert('Please check your email to confirm your account!');
        setShowLogin(true);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex justify-end p-4">
        <SecondaryButton
          onClick={() => setShowLogin(true)}
          icon={<IconUser size={20} />}
          className="bg-purple-100 text-purple-700 border-purple-200"
        >
          Log in
        </SecondaryButton>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
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
              <button className="text-sm text-gray-600 underline">
                Forgot password?
              </button>
            </div>

            <div className="text-center">
              <span className="text-gray-600">Or </span>
              <button
                onClick={() => {
                  setShowLogin(false);
                  setShowRegister(true);
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
    </div>
  );
}
