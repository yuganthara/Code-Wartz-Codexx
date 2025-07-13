
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from './Navigation';
import { WalletHeader } from '@/components/crypto/WalletHeader';
import { SessionLock } from '@/components/crypto/SessionLock';
import { SessionManager } from '@/utils/sessionManager';
import { SessionLockManager } from '@/utils/sessionLockManager';
import { WalletManager } from '@/utils/walletManager';
import { CryptoEngine } from '@/utils/cryptoEngine';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  const [isLocked, setIsLocked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    if (!SessionManager.isSessionValid()) {
      navigate('/');
      return;
    }

    // Initialize session lock manager
    SessionLockManager.initialize(() => {
      setIsLocked(true);
      WalletManager.clearSensitiveData();
      CryptoEngine.clearOperations();
    });

    // Set up session timeout checker
    const interval = setInterval(() => {
      const isValid = SessionManager.isSessionValid();
      if (!isValid) {
        navigate('/');
      }
    }, 60000);

    return () => {
      clearInterval(interval);
      SessionLockManager.cleanup();
    };
  }, [navigate]);

  const handleLogout = () => {
    SessionManager.clearSession();
    navigate('/');
  };

  const handleUnlock = () => {
    setIsLocked(false);
  };

  const session = SessionManager.getSession();

  if (isLocked || SessionLockManager.isSessionLocked()) {
    return (
      <SessionLock 
        onUnlock={handleUnlock} 
        userEmail={SessionManager.getUserEmail()}
      />
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 space-y-6">
      <WalletHeader userEmail={session.email} onLogout={handleLogout} />
      <Navigation onLogout={handleLogout} />
      <main className="space-y-6">
        {children}
      </main>
    </div>
  );
};
