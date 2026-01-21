import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '../hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithGoogle } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processSession = async () => {
      try {
        // Extract session_id from URL hash
        const hash = location.hash;
        const params = new URLSearchParams(hash.substring(1));
        const sessionId = params.get('session_id');

        if (!sessionId) {
          throw new Error('No session ID found');
        }

        // Exchange session_id for user data
        const result = await loginWithGoogle(sessionId);

        if (result.success) {
          toast({
            title: 'Login Successful',
            description: 'Welcome to Monacap Trading Pro!'
          });
          
          // Navigate to dashboard with user data
          navigate('/dashboard', { 
            replace: true,
            state: { user: result.user }
          });
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast({
          title: 'Authentication Failed',
          description: error.message || 'Please try again',
          variant: 'destructive'
        });
        navigate('/login', { replace: true });
      }
    };

    processSession();
  }, [location, loginWithGoogle, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f1f3a] to-[#0a1628] flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
        <p className="text-xl">Authenticating...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
