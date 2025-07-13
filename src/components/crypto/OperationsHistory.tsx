
import { useState, useEffect } from 'react';
import { Clock, TrendingUp, ArrowUpDown, Coins, PiggyBank, CheckCircle, XCircle, Loader } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CryptoEngine } from '@/utils/cryptoEngine';

export const OperationsHistory = () => {
  const [operations, setOperations] = useState(CryptoEngine.getOperations());

  useEffect(() => {
    const interval = setInterval(() => {
      setOperations(CryptoEngine.getOperations());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getOperationIcon = (type: string) => {
    switch (type) {
      case 'trade': return ArrowUpDown;
      case 'stake': return PiggyBank;
      case 'swap': return Coins;
      case 'invest': return TrendingUp;
      default: return Clock;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'failed': return XCircle;
      case 'pending': return Loader;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'failed': return 'text-red-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-purple-200';
    }
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white">Operations History</CardTitle>
        <p className="text-purple-200 text-sm">Recent crypto operations (session only)</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {operations.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="text-purple-200">No operations yet</p>
            </div>
          ) : (
            operations.slice(0, 10).map((operation) => {
              const OperationIcon = getOperationIcon(operation.type);
              const StatusIcon = getStatusIcon(operation.status);
              
              return (
                <div key={operation.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <OperationIcon className="w-4 h-4 text-white" />
                    </div>
                    
                    <div>
                      <div className="text-white font-medium capitalize">
                        {operation.type} {operation.fromAsset}
                        {operation.toAsset && ` → ${operation.toAsset}`}
                      </div>
                      <div className="text-purple-200 text-sm">
                        {new Date(operation.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-white font-medium">
                      {operation.amount.toFixed(4)} {operation.fromAsset}
                    </div>
                    <div className="flex items-center space-x-1">
                      <StatusIcon className={`w-3 h-3 ${getStatusColor(operation.status)} ${operation.status === 'pending' ? 'animate-spin' : ''}`} />
                      <span className={`text-xs capitalize ${getStatusColor(operation.status)}`}>
                        {operation.status}
                      </span>
                    </div>
                    {operation.fee > 0 && (
                      <div className="text-xs text-purple-300">
                        Fee: {operation.fee.toFixed(4)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
