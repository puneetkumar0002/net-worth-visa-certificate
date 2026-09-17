import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import SEO from '../../components/SEO';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();

  // Handle Firebase Auth errors with user-friendly messages
  const getAuthErrorMessage = (code: string) => {
    console.error("Firebase Auth Error:", code);
    switch (code) {
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials.';
      case 'auth/user-not-found':
        return 'No admin account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed login attempts. Please try again later.';
      case 'auth/popup-closed-by-user':
        return 'Login popup was closed before completion.';
      case 'auth/popup-blocked':
        return 'Login popup was blocked by your browser.';
      case 'auth/cancelled-popup-request':
        return 'Login request was cancelled.';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized for authentication. Please check Firebase console.';
      case 'auth/operation-not-allowed':
        return 'This authentication method is not enabled in Firebase.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  useEffect(() => {
    // Domain authorization warning for developers
    const currentDomain = window.location.hostname;
    if (currentDomain !== 'localhost' && !currentDomain.includes('run.app')) {
      console.warn(`Note: Ensure "${currentDomain}" is added to Authorized Domains in Firebase Console > Authentication > Settings.`);
    }

    if (!authLoading && user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Success handled by useEffect
    } catch (error: any) {
      toast.error(getAuthErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      // Force account selection
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
      // Success handled by useEffect
    } catch (error: any) {
      toast.error(getAuthErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter your admin email to reset password.');
      return;
    }
    setIsResetting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset instructions have been sent.');
    } catch (error: any) {
      console.error('Password reset error', error);
      toast.error('Failed to send reset email. Verify your email address.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <SEO noindex={true} />
      <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden">
        <div className="bg-[#0B1830] h-2 w-full"></div>
        <CardHeader className="text-center pb-6 pt-8">
          <img 
            src="/images/networth-certificate-visa-logo.png" 
            alt="Networth Certificate Visa" 
            className="h-20 w-auto mx-auto mb-4 object-contain"
          />
          <CardTitle className="text-2xl font-bold text-slate-900">Networth Certificate Visa Admin Portal</CardTitle>
          <CardDescription className="text-slate-500 mt-2">
            Sign in to manage applications, documents, certificates and website content.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8 px-8">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Admin Email</label>
              <Input 
                type="email" 
                placeholder="admin@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-[#0C6D62]"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <button 
                  type="button" 
                  onClick={handleForgotPassword}
                  disabled={isResetting}
                  className="text-xs font-medium text-[#0C6D62] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:ring-[#0C6D62]"
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <input type="checkbox" id="remember" className="rounded border-slate-300 text-[#0C6D62] focus:ring-[#0C6D62]" />
              <label htmlFor="remember" className="text-sm text-slate-600">Remember me securely</label>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#0B1830] hover:bg-[#0B1830]/90 h-12 text-md font-semibold mt-6 shadow-md transition-all"
              disabled={loading || authLoading}
            >
              {loading || authLoading ? 'Verifying admin access...' : 'Sign in securely'}
            </Button>
          </form>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-3 text-slate-500 font-medium tracking-wide text-xs uppercase">Or</span>
            </div>
          </div>

          <Button 
            type="button" 
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full h-12 text-md font-semibold mt-6 border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm"
            disabled={loading || authLoading}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400">Authorized personnel only. For first-time setup, create an admin user in Firebase Authentication and assign the super_admin role.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
