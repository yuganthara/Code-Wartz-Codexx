// WARNING: This is for demo/testing only. Never use this for real funds or mainnet!
import { Wallet } from 'ethers';

const WALLET_KEY = 'demo_inbrowser_wallet';

export class InBrowserWalletManager {
  static getWallet(): Wallet {
    let pk = localStorage.getItem(WALLET_KEY);
    if (!pk) {
      const wallet = Wallet.createRandom();
      pk = wallet.privateKey;
      localStorage.setItem(WALLET_KEY, pk);
      return wallet;
    }
    return new Wallet(pk);
  }

  static getAddress(): string {
    return this.getWallet().address;
  }

  static getPrivateKey(): string {
    return this.getWallet().privateKey;
  }

  static clearWallet() {
    localStorage.removeItem(WALLET_KEY);
  }
} 