'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Github, Chrome, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter, useSearchParams } from 'next/navigation';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { login, setLoading, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for OAuth callback success
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    const user = urlParams.get('user');

    if (success === 'true' && user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        login(userData);

        // Redirect to intended page or dashboard
        const redirect = searchParams.get('redirect') || '/dashboard';
        router.push(redirect);
      } catch (err) {
        console.error('Failed to parse user data:', err);
        toast.error('Login failed. Please try again.');
      }
    } else if (error) {
      toast.error(decodeURIComponent(error));
    }

    // Clean up URL
    if (success || error) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [login, router, searchParams]);

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      const redirect = searchParams.get('redirect') || '/dashboard';
      router.push(redirect);
    }
  }, [isAuthenticated, router, searchParams]);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setLoading(true);

      // Generate state for security
      const state = `google_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Store state for verification
      sessionStorage.setItem('oauth_state', state);
      sessionStorage.setItem('oauth_provider', 'google');

      // Redirect directly to backend OAuth endpoint
      window.location.href = 'http://localhost:5000/api/user/auth/google';
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Failed to initiate Google login. Please try again.');
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      setIsLoading(true);
      setLoading(true);

      // Generate state for security
      const state = `github_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Store state for verification
      sessionStorage.setItem('oauth_state', state);
      sessionStorage.setItem('oauth_provider', 'github');

      // Redirect directly to backend OAuth endpoint
      window.location.href = 'http://localhost:5000/api/user/auth/github';
    } catch (error) {
      console.error('GitHub login error:', error);
      toast.error('Failed to initiate GitHub login. Please try again.');
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    // Create a guest user session
    const guestUser = {
      id: `guest_${Date.now()}`,
      email: '',
      name: 'Guest User',
      authProvider: 'guest',
      isPrime: false,
      preferences: {},
    };

    login(guestUser);
    toast.success('Logged in as guest');

    const redirect = searchParams.get('redirect') || '/dashboard';
    router.push(redirect);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md"
    >
      <Card className="shadow-2xl border-0">
        <CardHeader className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto"
          >
            <span className="text-white font-bold text-2xl">HG</span>
          </motion.div>
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <p className="text-gray-600">
            Sign in to continue your interview preparation journey
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-12 text-lg font-medium bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent mr-3" />
              ) : (
                <Chrome className="mr-3 h-5 w-5 text-blue-600" />
              )}
              Continue with Google
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={handleGithubLogin}
              disabled={isLoading}
              className="w-full h-12 text-lg font-medium bg-gray-900 hover:bg-gray-800 text-white transition-all duration-300"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
              ) : (
                <Github className="mr-3 h-5 w-5" />
              )}
              Continue with GitHub
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-4 text-sm text-gray-500">or</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <Button
              variant="ghost"
              onClick={handleGuestLogin}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Continue as Guest
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-sm text-gray-500"
          >
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
