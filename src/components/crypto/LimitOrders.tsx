
import { useState } from 'react';
import { TrendingUp, TrendingDown, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LimitOrder {
  id: string;
  type: 'buy' | 'sell';
  asset: string;
  amount: number;
  limitPrice: number;
  currentPrice: number;
  status: 'pending' | 'filled' | 'cancelled';
  created: number;
}

export const LimitOrders = () => {
  const [orders, setOrders] = useState<LimitOrder[]>([
    {
      id: '1',
      type: 'buy',
      asset: 'BTC',
      amount: 0.5,
      limitPrice: 32000,
      currentPrice: 32450,
      status: 'pending',
      created: Date.now() - 3600000
    }
  ]);

  const [orderForm, setOrderForm] = useState({
    type: 'buy',
    asset: 'BTC',
    amount: '',
    limitPrice: ''
  });

  const createOrder = () => {
    if (!orderForm.amount || !orderForm.limitPrice) return;

    const newOrder: LimitOrder = {
      id: Math.random().toString(36).substring(7),
      type: orderForm.type as 'buy' | 'sell',
      asset: orderForm.asset,
      amount: parseFloat(orderForm.amount),
      limitPrice: parseFloat(orderForm.limitPrice),
      currentPrice: 32450, // Mock current price
      status: 'pending',
      created: Date.now()
    };

    setOrders(prev => [newOrder, ...prev]);
    setOrderForm({ type: 'buy', asset: 'BTC', amount: '', limitPrice: '' });
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'cancelled' as const } : order
    ));
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white">Limit Orders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Form */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-700/30 rounded-lg">
          <Select value={orderForm.type} onValueChange={(value) => setOrderForm(prev => ({ ...prev, type: value }))}>
            <SelectTrigger className="bg-slate-600/50 border-purple-500/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buy">Buy</SelectItem>
              <SelectItem value="sell">Sell</SelectItem>
            </SelectContent>
          </Select>

          <Select value={orderForm.asset} onValueChange={(value) => setOrderForm(prev => ({ ...prev, asset: value }))}>
            <SelectTrigger className="bg-slate-600/50 border-purple-500/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BTC">BTC</SelectItem>
              <SelectItem value="ETH">ETH</SelectItem>
              <SelectItem value="ADA">ADA</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Amount"
            value={orderForm.amount}
            onChange={(e) => setOrderForm(prev => ({ ...prev, amount: e.target.value }))}
            className="bg-slate-600/50 border-purple-500/30 text-white"
          />

          <Input
            placeholder="Limit Price"
            value={orderForm.limitPrice}
            onChange={(e) => setOrderForm(prev => ({ ...prev, limitPrice: e.target.value }))}
            className="bg-slate-600/50 border-purple-500/30 text-white"
          />

          <Button onClick={createOrder} className="md:col-span-4 bg-purple-600 hover:bg-purple-700">
            Create Limit Order
          </Button>
        </div>

        {/* Active Orders */}
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  order.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {order.type === 'buy' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-white font-medium">
                    {order.type.toUpperCase()} {order.amount} {order.asset}
                  </div>
                  <div className="text-purple-200 text-sm">
                    Limit: ${order.limitPrice.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className={`flex items-center space-x-1 ${
                  order.status === 'pending' ? 'text-yellow-400' :
                  order.status === 'filled' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {order.status === 'pending' && <Clock className="w-3 h-3" />}
                  {order.status === 'filled' && <CheckCircle className="w-3 h-3" />}
                  <span className="text-sm capitalize">{order.status}</span>
                </div>
                {order.status === 'pending' && (
                  <Button
                    onClick={() => cancelOrder(order.id)}
                    variant="outline"
                    size="sm"
                    className="mt-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
