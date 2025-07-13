
import { useState } from 'react';
import { Newspaper, ExternalLink, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  source: string;
  timestamp: number;
  assets: string[];
}

export const NewsAlerts = () => {
  const [news] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'Bitcoin ETF Approval Boosts Market Confidence',
      summary: 'Major financial institutions show increased interest in cryptocurrency investments following regulatory clarity.',
      sentiment: 'bullish',
      source: 'CryptoNews',
      timestamp: Date.now() - 1800000,
      assets: ['BTC', 'ETH']
    },
    {
      id: '2',
      title: 'DeFi Protocol Faces Security Concerns',
      summary: 'Recent audit reveals potential vulnerabilities in popular decentralized finance platform.',
      sentiment: 'bearish',
      source: 'DeFi Weekly',
      timestamp: Date.now() - 3600000,
      assets: ['ETH', 'ADA']
    },
    {
      id: '3',
      title: 'Central Bank Digital Currency Development',
      summary: 'Multiple countries accelerate CBDC research and pilot programs.',
      sentiment: 'neutral',
      source: 'Finance Today',
      timestamp: Date.now() - 7200000,
      assets: ['BTC', 'ETH', 'ADA']
    }
  ]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'bg-green-500/20 text-green-400';
      case 'bearish': return 'bg-red-500/20 text-red-400';
      case 'neutral': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-purple-500/20 text-purple-400';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return TrendingUp;
      case 'bearish': return AlertTriangle;
      default: return Newspaper;
    }
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Newspaper className="w-5 h-5 mr-2" />
          Crypto News & Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news.map((item) => {
            const SentimentIcon = getSentimentIcon(item.sentiment);
            return (
              <div key={item.id} className="p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <SentimentIcon className="w-4 h-4 text-purple-400" />
                    <Badge className={getSentimentColor(item.sentiment)} variant="secondary">
                      {item.sentiment}
                    </Badge>
                  </div>
                  <div className="text-xs text-purple-300">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </div>
                </div>

                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-purple-200 text-sm mb-3">{item.summary}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-purple-300">Source: {item.source}</span>
                    <div className="flex space-x-1">
                      {item.assets.map((asset) => (
                        <Badge key={asset} variant="outline" className="text-xs border-purple-500/30">
                          {asset}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-purple-400 cursor-pointer hover:text-purple-300" />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
