import { Bitcoin, DollarSign } from 'lucide-react';

interface CryptoCurrency {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change24h: number;
  icon: React.ComponentType<any>;
}

interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  currency: string;
  timestamp: number;
  status: 'completed' | 'pending' | 'failed';
  hash: string;
}

export class WalletManager {
  private static readonly WALLET_KEY = 'wallet_data';
  private static readonly TRANSACTIONS_KEY = 'transaction_history';

  static getWalletData() {
    try {
      // Try sessionStorage first (better privacy), fallback to localStorage
      const stored = sessionStorage.getItem(this.WALLET_KEY) || localStorage.getItem(this.WALLET_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        // Re-assign icon components since they can't be serialized
        data.currencies = data.currencies.map((currency: any) => ({
          ...currency,
          icon: this.getIconComponent(currency.symbol)
        }));
        return data;
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
    }

    // Default wallet data
    const defaultData = {
      totalValue: 45678.92,
      currencies: [
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          balance: 1.2345,
          value: 32450.67,
          change24h: 2.34,
          icon: Bitcoin
        },
        {
          symbol: 'ETH',
          name: 'Ethereum',
          balance: 5.6789,
          value: 8567.43,
          change24h: -1.23,
          icon: DollarSign
        },
        {
          symbol: 'ADA',
          name: 'Cardano',
          balance: 1000.0,
          value: 450.00,
          change24h: 0.89,
          icon: DollarSign
        },
        {
          symbol: 'DOT',
          name: 'Polkadot',
          balance: 250.5,
          value: 1875.25,
          change24h: -2.1,
          icon: DollarSign
        }
      ]
    };

    this.saveWalletData(defaultData);
    return defaultData;
  }

  private static getIconComponent(symbol: string) {
    switch (symbol) {
      case 'BTC':
        return Bitcoin;
      default:
        return DollarSign;
    }
  }

  static saveWalletData(data: any) {
    try {
      // Create a copy without the icon components for serialization
      const dataToSave = {
        ...data,
        currencies: data.currencies.map((currency: CryptoCurrency) => ({
          ...currency,
          icon: currency.symbol // Store symbol instead of component
        }))
      };
      
      // Save to sessionStorage for privacy (cleared when browser closes)
      sessionStorage.setItem(this.WALLET_KEY, JSON.stringify(dataToSave));
      // Also save to localStorage as backup for session restoration
      localStorage.setItem(this.WALLET_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving wallet data:', error);
    }
  }

  static updateBalances() {
    const walletData = this.getWalletData();
    
    // Simulate price fluctuations
    walletData.currencies.forEach((currency: CryptoCurrency) => {
      const fluctuation = (Math.random() - 0.5) * 0.02; // ±1% fluctuation
      currency.change24h += fluctuation;
      currency.value *= (1 + fluctuation);
    });

    // Recalculate total value
    walletData.totalValue = walletData.currencies.reduce(
      (total: number, currency: CryptoCurrency) => total + currency.value, 
      0
    );

    this.saveWalletData(walletData);
    return walletData;
  }

  static getTransactions(): Transaction[] {
    try {
      // Prefer sessionStorage for privacy
      const stored = sessionStorage.getItem(this.TRANSACTIONS_KEY) || localStorage.getItem(this.TRANSACTIONS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }

    // Default transactions - temporary only
    const defaultTransactions = [
      {
        id: '1',
        type: 'receive' as const,
        amount: 0.5,
        currency: 'BTC',
        timestamp: Date.now() - 3600000,
        status: 'completed' as const,
        hash: '0xabc123...'
      },
      {
        id: '2',
        type: 'send' as const,
        amount: 2.0,
        currency: 'ETH',
        timestamp: Date.now() - 7200000,
        status: 'completed' as const,
        hash: '0xdef456...'
      }
    ];

    this.saveTransactions(defaultTransactions);
    return defaultTransactions;
  }

  static saveTransactions(transactions: Transaction[]) {
    try {
      // Save to sessionStorage for privacy
      sessionStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify(transactions));
      // Keep minimal backup in localStorage
      localStorage.setItem(this.TRANSACTIONS_KEY, JSON.stringify(transactions.slice(-5))); // Only last 5
    } catch (error) {
      console.error('Error saving transactions:', error);
    }
  }

  static generateRandomTransaction(): Transaction {
    const currencies = ['BTC', 'ETH', 'ADA', 'DOT'];
    const types: ('send' | 'receive')[] = ['send', 'receive'];
    const statuses: ('completed' | 'pending' | 'failed')[] = ['completed', 'pending', 'failed'];

    const transaction: Transaction = {
      id: Math.random().toString(36).substring(7),
      type: types[Math.floor(Math.random() * types.length)],
      amount: Math.random() * 10,
      currency: currencies[Math.floor(Math.random() * currencies.length)],
      timestamp: Date.now(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      hash: '0x' + Math.random().toString(36).substring(2, 15) + '...'
    };

    const transactions = this.getTransactions();
    transactions.unshift(transaction);
    this.saveTransactions(transactions.slice(0, 50)); // Keep only last 50 transactions

    return transaction;
  }

  static clearSensitiveData(): void {
    sessionStorage.removeItem(this.WALLET_KEY);
    sessionStorage.removeItem(this.TRANSACTIONS_KEY);
    console.log('Sensitive wallet data cleared for privacy');
  }
}
