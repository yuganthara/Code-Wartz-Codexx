
import { LogOut, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SessionManager } from '@/utils/sessionManager';
import { useState, useEffect } from 'react';

interface WalletHeaderProps {
  userEmail: string;
  onLogout: () => void;
}

export const WalletHeader = ({ userEmail, onLogout }: WalletHeaderProps) => {
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const session = SessionManager.getSession();
      if (session) {
        const remaining = session.loginTime + 30 * 60 * 1000 - Date.now();
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-4 bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">CryptoWallet Pro</h1>
            <p className="text-purple-200 text-sm">{userEmail}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-purple-200">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Session: {timeRemaining}</span>
          </div>
          
          <Button
            onClick={onLogout}
            variant="outline"
            className="border-purple-500/30 text-purple-200 hover:bg-purple-500/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </Card>
  );
};
