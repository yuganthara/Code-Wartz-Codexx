
import { useState, useEffect } from 'react';
import { WalletHeader } from './WalletHeader';
import { BalanceCard } from './BalanceCard';
import { TransactionHistory } from './TransactionHistory';
import { AnalyticsPanel } from './AnalyticsPanel';
import { CryptoOperations } from './CryptoOperations';
import { OperationsHistory } from './OperationsHistory';
import { SessionLock } from './SessionLock';
import { WalletManager } from '@/utils/walletManager';
import { SessionManager } from '@/utils/sessionManager';
import { SessionLockManager } from '@/utils/sessionLockManager';
import { CryptoEngine } from '@/utils/cryptoEngine';

interface WalletDashboardProps {
  onLogout: () => void;
}

export const WalletDashboard = ({ onLogout }: WalletDashboardProps) => {
  const [walletData, setWalletData] = useState(WalletManager.getWalletData());
  const [transactions, setTransactions] = useState(WalletManager.getTransactions());
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    // Initialize session lock manager
    SessionLockManager.initialize(() => {
      setIsLocked(true);
      // Clear sensitive data when locked
      WalletManager.clearSensitiveData();
      CryptoEngine.clearOperations();
    });

    // Simulate real-time data updates
    const interval = setInterval(() => {
      if (!SessionLockManager.isSessionLocked()) {
        // Update wallet balances with simulated market fluctuations
        const updatedWallet = WalletManager.updateBalances();
        setWalletData(updatedWallet);

        // Occasionally add new transactions
        if (Math.random() < 0.1) { // 10% chance every 5 seconds
          const newTransaction = WalletManager.generateRandomTransaction();
          setTransactions(prev => [newTransaction, ...prev]);
        }

        // Extend session on activity
        SessionManager.extendSession();
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      SessionLockManager.cleanup();
    };
  }, []);

  const handleUnlock = () => {
    setIsLocked(false);
    // Reload data after unlock
    setWalletData(WalletManager.getWalletData());
    setTransactions(WalletManager.getTransactions());
  };

  const handleOperationComplete = () => {
    // Refresh wallet data when operations are completed
    setTimeout(() => {
      setWalletData(WalletManager.getWalletData());
      setTransactions(WalletManager.getTransactions());
    }, 1000);
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

  return (
    <div className="min-h-screen p-4 space-y-6">
      <WalletHeader userEmail={session?.email || ''} onLogout={onLogout} />
      
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <BalanceCard walletData={walletData} />
          <CryptoOperations 
            walletData={walletData} 
            onOperationComplete={handleOperationComplete}
          />
        </div>
        
        <div className="xl:col-span-1 space-y-6">
          <AnalyticsPanel walletData={walletData} transactions={transactions} />
        </div>
        
        <div className="xl:col-span-1 space-y-6">
          <TransactionHistory transactions={transactions} />
          <OperationsHistory />
        </div>
      </div>
    </div>
  );
};
