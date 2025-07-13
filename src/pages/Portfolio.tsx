
import { useState, useEffect } from 'react';
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout';
import { BalanceCard } from '@/components/crypto/BalanceCard';
import { AnalyticsPanel } from '@/components/crypto/AnalyticsPanel';
import { WalletManager } from '@/utils/walletManager';

const Portfolio = () => {
  const [walletData, setWalletData] = useState(WalletManager.getWalletData());
  const [transactions, setTransactions] = useState(WalletManager.getTransactions());

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedWallet = WalletManager.updateBalances();
      setWalletData(updatedWallet);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthenticatedLayout>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <BalanceCard walletData={walletData} />
        </div>
        <div className="xl:col-span-1">
          <AnalyticsPanel walletData={walletData} transactions={transactions} />
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Portfolio;
