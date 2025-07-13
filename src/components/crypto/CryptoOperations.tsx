
import { useState } from 'react';
import { ArrowUpDown, TrendingUp, Coins, PiggyBank, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CryptoEngine } from '@/utils/cryptoEngine';
import { useToast } from '@/hooks/use-toast';

interface CryptoOperationsProps {
  walletData: {
    currencies: Array<{
      symbol: string;
      name: string;
      balance: number;
      value: number;
    }>;
  };
  onOperationComplete: () => void;
}

export const CryptoOperations = ({ walletData, onOperationComplete }: CryptoOperationsProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [tradeForm, setTradeForm] = useState({ from: '', to: '', amount: '' });
  const [stakeForm, setStakeForm] = useState({ asset: '', amount: '', period: '30' });
  const [swapForm, setSwapForm] = useState({ from: '', to: '', amount: '' });
  const [investForm, setInvestForm] = useState({ asset: '', amount: '', strategy: 'moderate' });
  const { toast } = useToast();

  const currencies = walletData.currencies.map(c => c.symbol);
  const stakingPools = CryptoEngine.getStakingPools();
  const tradingPairs = CryptoEngine.getTradingPairs();

  const handleTrade = async () => {
    if (!tradeForm.from || !tradeForm.to || !tradeForm.amount) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    setLoading('trade');
    try {
      await CryptoEngine.executeTrade(tradeForm.from, tradeForm.to, parseFloat(tradeForm.amount));
      toast({ title: "Trade Submitted", description: "Your trade is being processed" });
      setTradeForm({ from: '', to: '', amount: '' });
      onOperationComplete();
    } catch (error) {
      toast({ title: "Trade Failed", description: (error as Error).message, variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const handleStake = async () => {
    if (!stakeForm.asset || !stakeForm.amount) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    setLoading('stake');
    try {
      await CryptoEngine.executeStake(stakeForm.asset, parseFloat(stakeForm.amount), parseInt(stakeForm.period));
      toast({ title: "Staking Initiated", description: "Your assets are now being staked" });
      setStakeForm({ asset: '', amount: '', period: '30' });
      onOperationComplete();
    } catch (error) {
      toast({ title: "Staking Failed", description: (error as Error).message, variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const handleSwap = async () => {
    if (!swapForm.from || !swapForm.to || !swapForm.amount) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    setLoading('swap');
    try {
      await CryptoEngine.executeSwap(swapForm.from, swapForm.to, parseFloat(swapForm.amount));
      toast({ title: "Swap Submitted", description: "Your swap is being processed" });
      setSwapForm({ from: '', to: '', amount: '' });
      onOperationComplete();
    } catch (error) {
      toast({ title: "Swap Failed", description: (error as Error).message, variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  const handleInvest = async () => {
    if (!investForm.asset || !investForm.amount) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    setLoading('invest');
    try {
      await CryptoEngine.executeInvestment(
        investForm.asset,
        parseFloat(investForm.amount),
        investForm.strategy as 'conservative' | 'moderate' | 'aggressive'
      );
      toast({ title: "Investment Created", description: "Your investment portfolio has been created" });
      setInvestForm({ asset: '', amount: '', strategy: 'moderate' });
      onOperationComplete();
    } catch (error) {
      toast({ title: "Investment Failed", description: (error as Error).message, variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white">Crypto Operations</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trade" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-700/50">
            <TabsTrigger value="trade" className="text-purple-200">Trade</TabsTrigger>
            <TabsTrigger value="stake" className="text-purple-200">Stake</TabsTrigger>
            <TabsTrigger value="swap" className="text-purple-200">Swap</TabsTrigger>
            <TabsTrigger value="invest" className="text-purple-200">Invest</TabsTrigger>
          </TabsList>

          <TabsContent value="trade" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Select value={tradeForm.from} onValueChange={(value) => setTradeForm(prev => ({ ...prev, from: value }))}>
                <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                  <SelectValue placeholder="From Asset" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-purple-500/30">
                  {currencies.map(currency => (
                    <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={tradeForm.to} onValueChange={(value) => setTradeForm(prev => ({ ...prev, to: value }))}>
                <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                  <SelectValue placeholder="To Asset" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-purple-500/30">
                  {tradingPairs
                    .filter(pair => pair.from === tradeForm.from)
                    .map(pair => (
                      <SelectItem key={pair.to} value={pair.to}>{pair.to}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>

            <input
              type="number"
              placeholder="Amount"
              value={tradeForm.amount}
              onChange={(e) => setTradeForm(prev => ({ ...prev, amount: e.target.value }))}
              className="w-full p-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300"
            />

            <Button 
              onClick={handleTrade} 
              disabled={loading === 'trade'}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading === 'trade' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ArrowUpDown className="w-4 h-4 mr-2" />}
              Execute Trade
            </Button>
          </TabsContent>

          <TabsContent value="stake" className="space-y-4">
            <Select value={stakeForm.asset} onValueChange={(value) => setStakeForm(prev => ({ ...prev, asset: value }))}>
              <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                <SelectValue placeholder="Select Asset to Stake" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-purple-500/30">
                {stakingPools.map(pool => (
                  <SelectItem key={pool.asset} value={pool.asset}>
                    {pool.asset} - {pool.apy}% APY
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Amount"
                value={stakeForm.amount}
                onChange={(e) => setStakeForm(prev => ({ ...prev, amount: e.target.value }))}
                className="p-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300"
              />

              <Select value={stakeForm.period} onValueChange={(value) => setStakeForm(prev => ({ ...prev, period: value }))}>
                <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-purple-500/30">
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="60">60 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                  <SelectItem value="120">120 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleStake} 
              disabled={loading === 'stake'}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {loading === 'stake' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <PiggyBank className="w-4 h-4 mr-2" />}
              Start Staking
            </Button>
          </TabsContent>

          <TabsContent value="swap" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Select value={swapForm.from} onValueChange={(value) => setSwapForm(prev => ({ ...prev, from: value }))}>
                <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                  <SelectValue placeholder="From" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-purple-500/30">
                  {currencies.map(currency => (
                    <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={swapForm.to} onValueChange={(value) => setSwapForm(prev => ({ ...prev, to: value }))}>
                <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                  <SelectValue placeholder="To" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-purple-500/30">
                  {currencies.filter(c => c !== swapForm.from).map(currency => (
                    <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <input
              type="number"
              placeholder="Amount to Swap"
              value={swapForm.amount}
              onChange={(e) => setSwapForm(prev => ({ ...prev, amount: e.target.value }))}
              className="w-full p-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300"
            />

            <Button 
              onClick={handleSwap} 
              disabled={loading === 'swap'}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              {loading === 'swap' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Coins className="w-4 h-4 mr-2" />}
              Execute Swap
            </Button>
          </TabsContent>

          <TabsContent value="invest" className="space-y-4">
            <Select value={investForm.asset} onValueChange={(value) => setInvestForm(prev => ({ ...prev, asset: value }))}>
              <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                <SelectValue placeholder="Select Asset" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-purple-500/30">
                {currencies.map(currency => (
                  <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Investment Amount"
                value={investForm.amount}
                onChange={(e) => setInvestForm(prev => ({ ...prev, amount: e.target.value }))}
                className="p-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300"
              />

              <Select value={investForm.strategy} onValueChange={(value) => setInvestForm(prev => ({ ...prev, strategy: value }))}>
                <SelectTrigger className="bg-slate-700/50 border-purple-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-purple-500/30">
                  <SelectItem value="conservative">Conservative (5%)</SelectItem>
                  <SelectItem value="moderate">Moderate (12%)</SelectItem>
                  <SelectItem value="aggressive">Aggressive (25%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleInvest} 
              disabled={loading === 'invest'}
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
            >
              {loading === 'invest' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <TrendingUp className="w-4 h-4 mr-2" />}
              Create Investment
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
