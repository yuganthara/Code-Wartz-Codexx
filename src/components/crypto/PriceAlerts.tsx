
import { useState } from 'react';
import { Bell, BellOff, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface PriceAlert {
  id: string;
  asset: string;
  condition: 'above' | 'below';
  targetPrice: number;
  currentPrice: number;
  isActive: boolean;
  created: number;
}

export const PriceAlerts = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: '1',
      asset: 'BTC',
      condition: 'above',
      targetPrice: 35000,
      currentPrice: 32450,
      isActive: true,
      created: Date.now()
    }
  ]);

  const [alertForm, setAlertForm] = useState({
    asset: 'BTC',
    condition: 'above',
    targetPrice: ''
  });

  const createAlert = () => {
    if (!alertForm.targetPrice) return;

    const newAlert: PriceAlert = {
      id: Math.random().toString(36).substring(7),
      asset: alertForm.asset,
      condition: alertForm.condition as 'above' | 'below',
      targetPrice: parseFloat(alertForm.targetPrice),
      currentPrice: 32450, // Mock current price
      isActive: true,
      created: Date.now()
    };

    setAlerts(prev => [newAlert, ...prev]);
    setAlertForm({ asset: 'BTC', condition: 'above', targetPrice: '' });
  };

  const toggleAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Price Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Alert Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-700/30 rounded-lg">
          <Select value={alertForm.asset} onValueChange={(value) => setAlertForm(prev => ({ ...prev, asset: value }))}>
            <SelectTrigger className="bg-slate-600/50 border-purple-500/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BTC">BTC</SelectItem>
              <SelectItem value="ETH">ETH</SelectItem>
              <SelectItem value="ADA">ADA</SelectItem>
              <SelectItem value="DOT">DOT</SelectItem>
            </SelectContent>
          </Select>

          <Select value={alertForm.condition} onValueChange={(value) => setAlertForm(prev => ({ ...prev, condition: value }))}>
            <SelectTrigger className="bg-slate-600/50 border-purple-500/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="above">Goes Above</SelectItem>
              <SelectItem value="below">Goes Below</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Target Price"
            value={alertForm.targetPrice}
            onChange={(e) => setAlertForm(prev => ({ ...prev, targetPrice: e.target.value }))}
            className="bg-slate-600/50 border-purple-500/30 text-white"
          />

          <Button onClick={createAlert} className="md:col-span-3 bg-purple-600 hover:bg-purple-700">
            Create Alert
          </Button>
        </div>

        {/* Active Alerts */}
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  alert.condition === 'above' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {alert.condition === 'above' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-white font-medium">
                    {alert.asset} {alert.condition} ${alert.targetPrice.toLocaleString()}
                  </div>
                  <div className="text-purple-200 text-sm">
                    Current: ${alert.currentPrice.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Switch
                  checked={alert.isActive}
                  onCheckedChange={() => toggleAlert(alert.id)}
                />
                {alert.isActive ? (
                  <Bell className="w-4 h-4 text-green-400" />
                ) : (
                  <BellOff className="w-4 h-4 text-gray-400" />
                )}
                <Button
                  onClick={() => deleteAlert(alert.id)}
                  variant="outline"
                  size="sm"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
