
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/crypto/LoginForm';
import { SessionManager } from '@/utils/sessionManager';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session on component mount
    const checkSession = () => {
      const isValid = SessionManager.isSessionValid();
      if (isValid) {
        navigate('/dashboard');
      } else {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  const handleLogin = (credentials: { email: string; password: string }) => {
    // Simulate authentication
    if (credentials.email && credentials.password) {
      SessionManager.createSession(credentials.email);
      console.log('User authenticated successfully');
      navigate('/dashboard');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};

export default Index;
