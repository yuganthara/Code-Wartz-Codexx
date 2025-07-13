export class SessionManager {
  private static readonly SESSION_KEY = 'crypto_wallet_session';
  private static readonly SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

  static createSession(email: string): void {
    const sessionData = {
      email,
      loginTime: Date.now(),
      expiresAt: Date.now() + this.SESSION_DURATION
    };
    
    // Use sessionStorage for better privacy - data cleared when browser closes
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
    
    // Only keep minimal data in localStorage for session restoration
    localStorage.setItem('user_email', email);
  }

  static isSessionValid(): boolean {
    try {
      const sessionStr = sessionStorage.getItem(this.SESSION_KEY);
      if (!sessionStr) return false;

      const session = JSON.parse(sessionStr);
      const now = Date.now();
      
      if (now > session.expiresAt) {
        this.clearSession();
        return false;
      }

      return true;
    } catch {
      this.clearSession();
      return false;
    }
  }

  static getSession(): { email: string; loginTime: number } | null {
    try {
      const sessionStr = sessionStorage.getItem(this.SESSION_KEY);
      if (!sessionStr) return null;

      const session = JSON.parse(sessionStr);
      return this.isSessionValid() ? session : null;
    } catch {
      return null;
    }
  }

  static clearSession(): void {
    sessionStorage.clear(); // Clear all session data for privacy
    localStorage.removeItem('user_email');
    localStorage.removeItem('wallet_data');
    localStorage.removeItem('transaction_history');
    console.log('Session cleared - all temporary data removed for privacy');
  }

  static extendSession(): void {
    const session = this.getSession();
    if (session) {
      this.createSession(session.email);
    }
  }

  static getUserEmail(): string {
    const session = this.getSession();
    return session?.email || localStorage.getItem('user_email') || '';
  }
}
