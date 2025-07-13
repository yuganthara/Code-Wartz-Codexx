
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  currency: string;
  timestamp: number;
  status: 'completed' | 'pending' | 'failed';
  hash: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-purple-200';
    }
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="text-purple-200">No transactions yet</p>
            </div>
          ) : (
            transactions.slice(0, 10).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === 'send' 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    {transaction.type === 'send' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div>
                    <div className="text-white font-medium capitalize">
                      {transaction.type} {transaction.currency}
                    </div>
                    <div className="text-purple-200 text-sm">
                      {formatTime(transaction.timestamp)}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`font-medium ${
                    transaction.type === 'send' ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {transaction.type === 'send' ? '-' : '+'}
                    {transaction.amount.toFixed(4)} {transaction.currency}
                  </div>
                  <div className={`text-xs capitalize ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
