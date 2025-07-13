
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CryptoCurrency {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change24h: number;
  icon: React.ComponentType<any>;
}

interface BalanceCardProps {
  walletData: {
    totalValue: number;
    currencies: CryptoCurrency[];
  };
}

export const BalanceCard = ({ walletData }: BalanceCardProps) => {
  const totalChange = walletData.currencies.reduce((acc, curr) => acc + (curr.value * curr.change24h / 100), 0);
  const totalChangePercent = (totalChange / walletData.totalValue) * 100;

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Portfolio Balance</span>
          <div className={`flex items-center ${totalChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalChangePercent >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            <span className="text-sm">{totalChangePercent.toFixed(2)}%</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="text-3xl font-bold text-white mb-2">
            ${walletData.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`text-sm ${totalChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalChange >= 0 ? '+' : ''}${totalChange.toFixed(2)} (24h)
          </div>
        </div>

        <div className="space-y-4">
          {walletData.currencies.map((currency) => {
            const IconComponent = currency.icon;
            return (
              <div key={currency.symbol} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{currency.symbol}</div>
                    <div className="text-purple-200 text-sm">{currency.name}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-white font-medium">
                    {currency.balance.toFixed(4)} {currency.symbol}
                  </div>
                  <div className="text-purple-200 text-sm">
                    ${currency.value.toFixed(2)}
                  </div>
                  <div className={`text-xs ${currency.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {currency.change24h >= 0 ? '+' : ''}{currency.change24h.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
