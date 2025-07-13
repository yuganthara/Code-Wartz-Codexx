export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'alert' | 'info' | 'chart' | 'portfolio';
  data?: any;
}

export interface ChatResponse {
  message: string;
  type: 'text' | 'suggestion' | 'alert' | 'info' | 'chart' | 'portfolio';
  data?: any;
  suggestions?: string[];
}

class ChatbotService {
  private context: {
    lastQuery?: string;
    userPreferences?: any;
    sessionData?: any;
  } = {};

  private cryptoData = {
    portfolio: {
      totalValue: 125000,
      change24h: 12.5,
      topHoldings: [
        { symbol: 'BTC', value: 45000, change: 18.2 },
        { symbol: 'ETH', value: 32000, change: 15.7 },
        { symbol: 'ADA', value: 18000, change: 8.9 },
        { symbol: 'DOT', value: 15000, change: 12.3 },
        { symbol: 'LINK', value: 15000, change: 6.8 }
      ]
    },
    marketTrends: {
      btc: { price: 43250, change: 2.5, trend: 'bullish' },
      eth: { price: 2650, change: 1.8, trend: 'bullish' },
      ada: { price: 0.85, change: -0.5, trend: 'neutral' },
      dot: { price: 12.5, change: 3.2, trend: 'bullish' },
      link: { price: 18.75, change: 1.1, trend: 'bullish' }
    },
    alerts: [
      { id: 1, crypto: 'BTC', target: 45000, type: 'above', active: true },
      { id: 2, crypto: 'ETH', target: 2500, type: 'below', active: true }
    ]
  };

  async processMessage(input: string): Promise<ChatResponse> {
    const lowerInput = input.toLowerCase();
    
    // Update context
    this.context.lastQuery = input;

    // Portfolio related queries
    if (this.matchesKeywords(lowerInput, ['portfolio', 'holdings', 'balance', 'assets'])) {
      return this.handlePortfolioQuery(lowerInput);
    }

    // Market related queries
    if (this.matchesKeywords(lowerInput, ['market', 'trend', 'price', 'crypto', 'bitcoin', 'ethereum'])) {
      return this.handleMarketQuery(lowerInput);
    }

    // Alert related queries
    if (this.matchesKeywords(lowerInput, ['alert', 'notification', 'price alert', 'set alert'])) {
      return this.handleAlertQuery(lowerInput);
    }

    // Trading strategy queries
    if (this.matchesKeywords(lowerInput, ['strategy', 'trading', 'buy', 'sell', 'dca', 'hodl'])) {
      return this.handleStrategyQuery(lowerInput);
    }

    // News and updates
    if (this.matchesKeywords(lowerInput, ['news', 'update', 'latest', 'what happened'])) {
      return this.handleNewsQuery(lowerInput);
    }

    // Help and general queries
    if (this.matchesKeywords(lowerInput, ['help', 'what can you do', 'assist'])) {
      return this.handleHelpQuery();
    }

    // Default response
    return {
      message: "I'm here to help with crypto trading! I can assist with portfolio analysis, market trends, price alerts, trading strategies, and news updates. What would you like to know?",
      type: 'text',
      suggestions: ['Show my portfolio', 'Market trends', 'Set price alert', 'Trading tips', 'Latest news']
    };
  }

  private matchesKeywords(input: string, keywords: string[]): boolean {
    return keywords.some(keyword => input.includes(keyword));
  }

  private handlePortfolioQuery(input: string): ChatResponse {
    const portfolio = this.cryptoData.portfolio;
    
    if (input.includes('performance') || input.includes('gain') || input.includes('loss')) {
      return {
        message: `Your portfolio is performing well! 📈\n\nTotal Value: $${portfolio.totalValue.toLocaleString()}\n24h Change: +${portfolio.change24h}%\n\nTop Performers:\n${portfolio.topHoldings.slice(0, 3).map(h => `• ${h.symbol}: +${h.change}%`).join('\n')}`,
        type: 'portfolio',
        data: portfolio,
        suggestions: ['Show detailed breakdown', 'Compare with market', 'Set profit targets']
      };
    }

    return {
      message: `Here's your portfolio overview:\n\n💰 Total Value: $${portfolio.totalValue.toLocaleString()}\n📊 24h Change: +${portfolio.change24h}%\n\nYour holdings:\n${portfolio.topHoldings.map(h => `• ${h.symbol}: $${h.value.toLocaleString()} (+${h.change}%)`).join('\n')}`,
      type: 'portfolio',
      data: portfolio,
      suggestions: ['Performance analysis', 'Risk assessment', 'Rebalance suggestions']
    };
  }

  private handleMarketQuery(input: string): ChatResponse {
    const trends = this.cryptoData.marketTrends;
    
    if (input.includes('bitcoin') || input.includes('btc')) {
      const btc = trends.btc;
      return {
        message: `Bitcoin (BTC) Analysis:\n\n💰 Current Price: $${btc.price.toLocaleString()}\n📈 24h Change: ${btc.change > 0 ? '+' : ''}${btc.change}%\n🎯 Trend: ${btc.trend.toUpperCase()}\n\nMarket sentiment is positive with strong institutional buying.`,
        type: 'text',
        suggestions: ['ETH analysis', 'Market overview', 'Set BTC alert']
      };
    }

    if (input.includes('ethereum') || input.includes('eth')) {
      const eth = trends.eth;
      return {
        message: `Ethereum (ETH) Analysis:\n\n💰 Current Price: $${eth.price.toLocaleString()}\n📈 24h Change: ${eth.change > 0 ? '+' : ''}${eth.change}%\n🎯 Trend: ${eth.trend.toUpperCase()}\n\nETH showing strength with DeFi growth and upcoming upgrades.`,
        type: 'text',
        suggestions: ['BTC analysis', 'DeFi tokens', 'Set ETH alert']
      };
    }

    return {
      message: `Market Overview:\n\n🔥 Hot: BTC (+${trends.btc.change}%), ETH (+${trends.eth.change}%), DOT (+${trends.dot.change}%)\n📊 Overall: Bullish momentum continues\n💡 Tip: Consider diversifying into promising altcoins`,
      type: 'text',
      suggestions: ['BTC analysis', 'ETH analysis', 'Portfolio check', 'Set alerts']
    };
  }

  private handleAlertQuery(input: string): ChatResponse {
    if (input.includes('set') || input.includes('create')) {
      return {
        message: "I can help you set up price alerts! 🚨\n\nWhich cryptocurrency would you like to monitor?\n\nPopular choices:\n• Bitcoin (BTC)\n• Ethereum (ETH)\n• Cardano (ADA)\n• Polkadot (DOT)\n• Chainlink (LINK)\n\nJust tell me the crypto and your target price!",
        type: 'text',
        suggestions: ['BTC alert', 'ETH alert', 'View my alerts']
      };
    }

    const alerts = this.cryptoData.alerts;
    return {
      message: `Your Active Alerts:\n\n${alerts.map(alert => `🔔 ${alert.crypto} ${alert.type} $${alert.target.toLocaleString()}`).join('\n')}\n\nYou can create new alerts or modify existing ones.`,
      type: 'text',
      suggestions: ['Create new alert', 'Modify alerts', 'Delete alerts']
    };
  }

  private handleStrategyQuery(input: string): ChatResponse {
    if (input.includes('dca') || input.includes('dollar cost')) {
      return {
        message: `DCA (Dollar Cost Averaging) Strategy:\n\n💡 Invest fixed amounts regularly regardless of price\n✅ Reduces timing risk\n✅ Smooths out volatility\n✅ Great for beginners\n\nExample: $100 every week into BTC`,
        type: 'text',
        suggestions: ['Swing trading', 'Scalping', 'HODL strategy']
      };
    }

    if (input.includes('swing') || input.includes('medium term')) {
      return {
        message: `Swing Trading Strategy:\n\n📈 Hold positions for days to weeks\n🎯 Target: 5-20% gains per trade\n📊 Use technical analysis\n⚠️ Requires more time and knowledge\n\nBest for: Intermediate traders`,
        type: 'text',
        suggestions: ['DCA strategy', 'Scalping', 'Risk management']
      };
    }

    return {
      message: `Popular Trading Strategies:\n\n1️⃣ DCA (Dollar Cost Averaging)\n   • Regular fixed investments\n   • Reduces timing risk\n\n2️⃣ Swing Trading\n   • Medium-term positions\n   • Technical analysis based\n\n3️⃣ Scalping\n   • Short-term trades\n   • Requires experience\n\n4️⃣ HODL\n   • Long-term holding\n   • Belief in fundamentals\n\nWhich interests you?`,
      type: 'text',
      suggestions: ['DCA details', 'Swing trading', 'Risk management', 'Portfolio review']
    };
  }

  private handleNewsQuery(input: string): ChatResponse {
    return {
      message: `Latest Crypto News:\n\n📰 Bitcoin ETF approval expected soon\n🔄 Ethereum upgrade successful\n🚀 New DeFi protocols launching\n📊 Institutional adoption increasing\n🌍 Global crypto regulations evolving\n\nWant details on any specific topic?`,
      type: 'text',
      suggestions: ['ETF details', 'Ethereum upgrade', 'DeFi news', 'Regulation updates']
    };
  }

  private handleHelpQuery(): ChatResponse {
    return {
      message: `I'm your AI crypto trading assistant! 🤖\n\nI can help you with:\n\n📊 Portfolio Analysis\n   • Performance tracking\n   • Asset allocation\n   • Risk assessment\n\n📈 Market Insights\n   • Price trends\n   • Technical analysis\n   • Market sentiment\n\n🔔 Price Alerts\n   • Set notifications\n   • Monitor targets\n   • Track movements\n\n💡 Trading Strategies\n   • DCA, Swing, Scalping\n   • Risk management\n   • Best practices\n\n📰 News & Updates\n   • Market news\n   • Regulatory updates\n   • Project developments\n\nJust ask me anything!`,
      type: 'text',
      suggestions: ['Portfolio check', 'Market trends', 'Set alerts', 'Trading tips']
    };
  }

  // Utility methods
  getContext() {
    return this.context;
  }

  updateContext(newContext: Partial<typeof this.context>) {
    this.context = { ...this.context, ...newContext };
  }

  clearContext() {
    this.context = {};
  }
}

export const chatbotService = new ChatbotService(); 