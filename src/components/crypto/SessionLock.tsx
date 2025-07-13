
import { useState } from 'react';
import { Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SessionLockManager } from '@/utils/sessionLockManager';

interface SessionLockProps {
  onUnlock: () => void;
  userEmail: string;
}

export const SessionLock = ({ onUnlock, userEmail }: SessionLockProps) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState('');

  const handleUnlock = async () => {
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setIsUnlocking(true);
    setError('');

    // Simulate password verification (in real app, this would be proper authentication)
    setTimeout(() => {
      if (password.length >= 6) { // Simple validation
        SessionLockManager.unlock();
        onUnlock();
      } else {
        setError('Invalid password');
      }
      setIsUnlocking(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUnlock();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-white text-2xl">Session Locked</CardTitle>
          <p className="text-purple-200 text-sm mt-2">
            Your wallet has been locked due to inactivity for security reasons
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-purple-200 mb-4">
              <Shield className="w-4 h-4" />
              <span className="text-sm">{userEmail}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password to unlock"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full p-4 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300 pr-12"
                disabled={isUnlocking}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                {error}
              </div>
            )}

            <Button
              onClick={handleUnlock}
              disabled={isUnlocking}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
            >
              {isUnlocking ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Unlocking...</span>
                </div>
              ) : (
                'Unlock Wallet'
              )}
            </Button>
          </div>

          <div className="text-center text-purple-300 text-xs">
            <p>Session locks after 5 minutes of inactivity</p>
            <p className="mt-1">Sensitive data is automatically cleared for privacy</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
