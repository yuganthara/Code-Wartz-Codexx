
import { useState } from 'react';
import { Users, Copy, TrendingUp, Star, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Trader {
  id: string;
  name: string;
  avatar: string;
  followers: number;
  roi: number;
  winRate: number;
  risk: 'Low' | 'Medium' | 'High';
  trades: number;
  isFollowing: boolean;
}

export const SocialTrading = () => {
  const [traders, setTraders] = useState<Trader[]>([
    {
      id: '1',
      name: 'CryptoMaster',
      avatar: 'CM',
      followers: 1250,
      roi: 87.4,
      winRate: 73.2,
      risk: 'Medium',
      trades: 342,
      isFollowing: false
    },
    {
      id: '2',
      name: 'DiamondHands',
      avatar: 'DH',
      followers: 890,
      roi: 156.8,
      winRate: 68.5,
      risk: 'High',
      trades: 198,
      isFollowing: true
    },
    {
      id: '3',
      name: 'SafeTrader',
      avatar: 'ST',
      followers: 2100,
      roi: 34.2,
      winRate: 81.7,
      risk: 'Low',
      trades: 567,
      isFollowing: false
    }
  ]);

  const toggleFollow = (traderId: string) => {
    setTraders(prev => prev.map(trader =>
      trader.id === traderId ? { ...trader, isFollowing: !trader.isFollowing } : trader
    ));
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-400 bg-green-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'High': return 'text-red-400 bg-red-500/20';
      default: return 'text-purple-400 bg-purple-500/20';
    }
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Top Traders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {traders.map((trader, index) => (
            <div key={trader.id} className="p-4 bg-slate-700/30 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {trader.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-white font-semibold">{trader.name}</h3>
                      {index === 0 && <Award className="w-4 h-4 text-yellow-400" />}
                    </div>
                    <div className="text-purple-200 text-sm">
                      {trader.followers.toLocaleString()} followers
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => toggleFollow(trader.id)}
                  variant={trader.isFollowing ? "outline" : "default"}
                  size="sm"
                  className={trader.isFollowing 
                    ? "border-purple-500/30 text-purple-200 hover:bg-purple-500/10"
                    : "bg-purple-600 hover:bg-purple-700"
                  }
                >
                  {trader.isFollowing ? (
                    <>
                      <Users className="w-4 h-4 mr-1" />
                      Following
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Follow
                    </>
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">+{trader.roi}%</div>
                  <div className="text-xs text-purple-200">ROI (YTD)</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">{trader.winRate}%</div>
                  <div className="text-xs text-purple-200">Win Rate</div>
                </div>
                <div className="text-center">
                  <div className={`text-sm px-2 py-1 rounded-full ${getRiskColor(trader.risk)}`}>
                    {trader.risk}
                  </div>
                  <div className="text-xs text-purple-200 mt-1">Risk Level</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-400">{trader.trades}</div>
                  <div className="text-xs text-purple-200">Total Trades</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
