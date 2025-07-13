
import { useState, useEffect } from 'react';
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout';
import { AnalyticsPanel } from '@/components/crypto/AnalyticsPanel';
import { AdvancedAnalytics } from '@/components/crypto/AdvancedAnalytics';
import { TransactionHistory } from '@/components/crypto/TransactionHistory';
import { WalletManager } from '@/utils/walletManager';

const Analytics = () => {
  const [walletData, setWalletData] = useState(WalletManager.getWalletData());
  const [transactions, setTransactions] = useState(WalletManager.getTransactions());

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedWallet = WalletManager.updateBalances();
      setWalletData(updatedWallet);

      if (Math.random() < 0.1) {
        const newTransaction = WalletManager.generateRandomTransaction();
        setTransactions(prev => [newTransaction, ...prev]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <AdvancedAnalytics />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AnalyticsPanel walletData={walletData} transactions={transactions} />
          <TransactionHistory transactions={transactions} />
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Analytics;
