
import { TrendingUp, Activity, PieChart, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalyticsPanelProps {
  walletData: {
    totalValue: number;
    currencies: any[];
  };
  transactions: any[];
}

export const AnalyticsPanel = ({ walletData, transactions }: AnalyticsPanelProps) => {
  const todayTransactions = transactions.filter(
    tx => new Date(tx.timestamp).toDateString() === new Date().toDateString()
  ).length;

  const weeklyVolume = transactions
    .filter(tx => Date.now() - tx.timestamp < 7 * 24 * 60 * 60 * 1000)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const portfolioDistribution = walletData.currencies.map(currency => ({
    name: currency.symbol,
    percentage: (currency.value / walletData.totalValue) * 100
  }));

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Analytics Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
            <div className="flex items-center justify-between">
              <span className="text-purple-200">Today's Transactions</span>
              <span className="text-white font-bold">{todayTransactions}</span>
            </div>
          </div>

          <div className="p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
            <div className="flex items-center justify-between">
              <span className="text-blue-200">Weekly Volume</span>
              <span className="text-white font-bold">{weeklyVolume.toFixed(4)}</span>
            </div>
          </div>

          <div className="p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
            <div className="flex items-center justify-between">
              <span className="text-green-200">Total Assets</span>
              <span className="text-white font-bold">{walletData.currencies.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <PieChart className="w-5 h-5 mr-2" />
            Portfolio Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {portfolioDistribution.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ 
                      backgroundColor: `hsl(${(index * 60) % 360}, 70%, 60%)` 
                    }}
                  />
                  <span className="text-purple-200">{item.name}</span>
                </div>
                <span className="text-white font-medium">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-purple-200">Best Performer</span>
              <div className="text-right">
                {walletData.currencies.length > 0 && (
                  <>
                    <div className="text-white font-medium">
                      {walletData.currencies.reduce((best, curr) => 
                        curr.change24h > best.change24h ? curr : best
                      ).symbol}
                    </div>
                    <div className="text-green-400 text-sm">
                      +{walletData.currencies.reduce((best, curr) => 
                        curr.change24h > best.change24h ? curr : best
                      ).change24h.toFixed(2)}%
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-purple-200">Worst Performer</span>
              <div className="text-right">
                {walletData.currencies.length > 0 && (
                  <>
                    <div className="text-white font-medium">
                      {walletData.currencies.reduce((worst, curr) => 
                        curr.change24h < worst.change24h ? curr : worst
                      ).symbol}
                    </div>
                    <div className="text-red-400 text-sm">
                      {walletData.currencies.reduce((worst, curr) => 
                        curr.change24h < worst.change24h ? curr : worst
                      ).change24h.toFixed(2)}%
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
