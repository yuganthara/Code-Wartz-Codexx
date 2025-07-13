
import { TrendingUp, PieChart, BarChart3, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface AnalyticsMetrics {
  sharpeRatio: number;
  volatility: number;
  maxDrawdown: number;
  roi: number;
  winRate: number;
  avgHoldTime: number;
}

export const AdvancedAnalytics = () => {
  const metrics: AnalyticsMetrics = {
    sharpeRatio: 1.34,
    volatility: 24.5,
    maxDrawdown: -12.3,
    roi: 28.7,
    winRate: 67.4,
    avgHoldTime: 8.5
  };

  const portfolioAllocation = [
    { asset: 'BTC', percentage: 45, target: 50, color: 'bg-orange-500' },
    { asset: 'ETH', percentage: 30, target: 25, color: 'bg-blue-500' },
    { asset: 'ADA', percentage: 15, target: 15, color: 'bg-green-500' },
    { asset: 'DOT', percentage: 10, target: 10, color: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{metrics.sharpeRatio}</div>
              <div className="text-purple-200 text-sm">Sharpe Ratio</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">{metrics.volatility}%</div>
              <div className="text-purple-200 text-sm">Volatility</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-red-400">{metrics.maxDrawdown}%</div>
              <div className="text-purple-200 text-sm">Max Drawdown</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-green-400">+{metrics.roi}%</div>
              <div className="text-purple-200 text-sm">Total ROI</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{metrics.winRate}%</div>
              <div className="text-purple-200 text-sm">Win Rate</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{metrics.avgHoldTime}d</div>
              <div className="text-purple-200 text-sm">Avg Hold Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Allocation */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Asset Allocation vs Target
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {portfolioAllocation.map((asset) => (
              <div key={asset.asset} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white font-medium">{asset.asset}</span>
                  <span className="text-purple-200">
                    {asset.percentage}% / {asset.target}% target
                  </span>
                </div>
                <div className="space-y-1">
                  <Progress value={asset.percentage} className="h-2" />
                  <div className="flex justify-between text-xs text-purple-300">
                    <span>Current: {asset.percentage}%</span>
                    <span className={asset.percentage > asset.target ? 'text-yellow-400' : 'text-green-400'}>
                      {asset.percentage > asset.target ? 'Overweight' : 'On Target'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
