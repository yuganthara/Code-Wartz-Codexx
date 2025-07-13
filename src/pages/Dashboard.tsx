
import { useState } from 'react';
import { AuthenticatedLayout } from '@/components/layout/AuthenticatedLayout';
import PrivacyScoreCard from '@/components/crypto/PrivacyScoreCard';
import { TransactionHistory } from '@/components/crypto/TransactionHistory';
import { SessionManager } from '@/utils/sessionManager';

const Dashboard = () => {
  // Example privacy score, in a real app this would come from user data/logic
  const privacyScore = 87;
  const email = SessionManager.getUserEmail();
  let userName = 'User';
  if (email) {
    const namePart = email.split('@')[0];
    userName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
  }
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <AuthenticatedLayout>
      <div className="max-w-5xl mx-auto px-2 py-6">
        {/* Dashboard Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1 drop-shadow">Welcome back, <span className="text-purple-400">{userName}</span>!</h1>
            <div className="text-purple-200 text-base font-medium">{today}</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <PrivacyScoreCard score={privacyScore} />
          <TransactionHistory transactions={[]} />
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Dashboard;
