
import { useState, useEffect } from 'react';
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout';
import { CryptoOperations } from '@/components/crypto/CryptoOperations';
import { OperationsHistory } from '@/components/crypto/OperationsHistory';
import { LimitOrders } from '@/components/crypto/LimitOrders';
import { WalletManager } from '@/utils/walletManager';

const Trading = () => {
  const [walletData, setWalletData] = useState(WalletManager.getWalletData());

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedWallet = WalletManager.updateBalances();
      setWalletData(updatedWallet);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleOperationComplete = () => {
    // Refresh wallet data when operations are completed
    setTimeout(() => {
      setWalletData(WalletManager.getWalletData());
    }, 1000);
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <CryptoOperations 
            walletData={walletData} 
            onOperationComplete={handleOperationComplete}
          />
          <OperationsHistory />
        </div>
        <LimitOrders />
      </div>
    </AuthenticatedLayout>
  );
};

export default Trading;
