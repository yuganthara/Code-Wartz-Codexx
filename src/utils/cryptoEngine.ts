
interface CryptoOperation {
  id: string;
  type: 'trade' | 'stake' | 'swap' | 'invest';
  fromAsset: string;
  toAsset?: string;
  amount: number;
  fee: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
  estimatedReturn?: number;
  stakingPeriod?: number; // in days
}

interface StakingPool {
  asset: string;
  apy: number;
  minAmount: number;
  lockPeriod: number; // in days
  totalStaked: number;
}

interface TradingPair {
  from: string;
  to: string;
  rate: number;
  fee: number;
}

export class CryptoEngine {
  private static readonly OPERATIONS_KEY = 'crypto_operations';
  private static readonly STAKING_KEY = 'user_staking';

  static getStakingPools(): StakingPool[] {
    return [
      { asset: 'BTC', apy: 4.5, minAmount: 0.01, lockPeriod: 30, totalStaked: 1250.5 },
      { asset: 'ETH', apy: 6.2, minAmount: 0.1, lockPeriod: 60, totalStaked: 8945.2 },
      { asset: 'ADA', apy: 8.1, minAmount: 100, lockPeriod: 90, totalStaked: 125000 },
      { asset: 'DOT', apy: 12.5, minAmount: 10, lockPeriod: 120, totalStaked: 25000 }
    ];
  }

  static getTradingPairs(): TradingPair[] {
    return [
      { from: 'BTC', to: 'ETH', rate: 15.2, fee: 0.25 },
      { from: 'ETH', to: 'BTC', rate: 0.066, fee: 0.25 },
      { from: 'BTC', to: 'ADA', rate: 72500, fee: 0.5 },
      { from: 'ETH', to: 'ADA', rate: 4800, fee: 0.5 },
      { from: 'ADA', to: 'DOT', rate: 0.18, fee: 1.0 },
      { from: 'DOT', to: 'ADA', rate: 5.5, fee: 1.0 }
    ];
  }

  static async executeTrade(fromAsset: string, toAsset: string, amount: number): Promise<CryptoOperation> {
    const pair = this.getTradingPairs().find(p => p.from === fromAsset && p.to === toAsset);
    if (!pair) throw new Error('Trading pair not supported');

    const operation: CryptoOperation = {
      id: Math.random().toString(36).substring(7),
      type: 'trade',
      fromAsset,
      toAsset,
      amount,
      fee: (amount * pair.fee) / 100,
      status: 'pending',
      timestamp: Date.now()
    };

    // Simulate network delay
    setTimeout(() => {
      operation.status = Math.random() > 0.1 ? 'completed' : 'failed';
      this.saveOperation(operation);
    }, 2000 + Math.random() * 3000);

    this.saveOperation(operation);
    return operation;
  }

  static async executeStake(asset: string, amount: number, period: number): Promise<CryptoOperation> {
    const pool = this.getStakingPools().find(p => p.asset === asset);
    if (!pool) throw new Error('Staking not available for this asset');
    if (amount < pool.minAmount) throw new Error(`Minimum stake amount is ${pool.minAmount} ${asset}`);

    const estimatedReturn = (amount * pool.apy * period) / (365 * 100);

    const operation: CryptoOperation = {
      id: Math.random().toString(36).substring(7),
      type: 'stake',
      fromAsset: asset,
      amount,
      fee: 0,
      status: 'pending',
      timestamp: Date.now(),
      estimatedReturn,
      stakingPeriod: period
    };

    setTimeout(() => {
      operation.status = 'completed';
      this.saveOperation(operation);
    }, 1000 + Math.random() * 2000);

    this.saveOperation(operation);
    return operation;
  }

  static async executeSwap(fromAsset: string, toAsset: string, amount: number): Promise<CryptoOperation> {
    const swapRate = Math.random() * 2 + 0.5; // Random swap rate
    const swapFee = 0.3; // 0.3% swap fee

    const operation: CryptoOperation = {
      id: Math.random().toString(36).substring(7),
      type: 'swap',
      fromAsset,
      toAsset,
      amount,
      fee: (amount * swapFee) / 100,
      status: 'pending',
      timestamp: Date.now()
    };

    setTimeout(() => {
      operation.status = Math.random() > 0.05 ? 'completed' : 'failed';
      this.saveOperation(operation);
    }, 1500 + Math.random() * 2500);

    this.saveOperation(operation);
    return operation;
  }

  static async executeInvestment(asset: string, amount: number, strategy: 'conservative' | 'moderate' | 'aggressive'): Promise<CryptoOperation> {
    const expectedReturns = {
      conservative: 0.05, // 5% annually
      moderate: 0.12, // 12% annually
      aggressive: 0.25 // 25% annually
    };

    const operation: CryptoOperation = {
      id: Math.random().toString(36).substring(7),
      type: 'invest',
      fromAsset: asset,
      amount,
      fee: (amount * 1.5) / 100, // 1.5% management fee
      status: 'pending',
      timestamp: Date.now(),
      estimatedReturn: amount * expectedReturns[strategy]
    };

    setTimeout(() => {
      operation.status = 'completed';
      this.saveOperation(operation);
    }, 3000 + Math.random() * 4000);

    this.saveOperation(operation);
    return operation;
  }

  static saveOperation(operation: CryptoOperation): void {
    try {
      const operations = this.getOperations();
      const updatedOps = operations.map(op => op.id === operation.id ? operation : op);
      if (!operations.find(op => op.id === operation.id)) {
        updatedOps.unshift(operation);
      }
      sessionStorage.setItem(this.OPERATIONS_KEY, JSON.stringify(updatedOps.slice(0, 50)));
    } catch (error) {
      console.error('Error saving operation:', error);
    }
  }

  static getOperations(): CryptoOperation[] {
    try {
      const stored = sessionStorage.getItem(this.OPERATIONS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading operations:', error);
      return [];
    }
  }

  static clearOperations(): void {
    sessionStorage.removeItem(this.OPERATIONS_KEY);
    sessionStorage.removeItem(this.STAKING_KEY);
  }
}
