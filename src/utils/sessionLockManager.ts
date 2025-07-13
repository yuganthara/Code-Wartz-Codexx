
export class SessionLockManager {
  private static readonly LOCK_KEY = 'session_lock';
  private static readonly INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes of inactivity
  private static readonly ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
  
  private static inactivityTimer: NodeJS.Timeout | null = null;
  private static isLocked = false;
  private static onLockCallback: (() => void) | null = null;

  static initialize(onLock: () => void): void {
    this.onLockCallback = onLock;
    this.setupActivityListeners();
    this.resetInactivityTimer();
    
    // Check if session was previously locked
    const lockState = localStorage.getItem(this.LOCK_KEY);
    if (lockState === 'locked') {
      this.triggerLock();
    }
  }

  static cleanup(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
    
    this.ACTIVITY_EVENTS.forEach(event => {
      document.removeEventListener(event, this.resetInactivityTimer.bind(this));
    });
    
    localStorage.removeItem(this.LOCK_KEY);
  }

  private static setupActivityListeners(): void {
    this.ACTIVITY_EVENTS.forEach(event => {
      document.addEventListener(event, () => {
        if (!this.isLocked) {
          this.resetInactivityTimer();
        }
      }, { passive: true });
    });
  }

  private static resetInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    this.inactivityTimer = setTimeout(() => {
      this.triggerLock();
    }, this.INACTIVITY_TIMEOUT);
  }

  private static triggerLock(): void {
    this.isLocked = true;
    localStorage.setItem(this.LOCK_KEY, 'locked');
    
    if (this.onLockCallback) {
      this.onLockCallback();
    }
  }

  static unlock(): void {
    this.isLocked = false;
    localStorage.removeItem(this.LOCK_KEY);
    this.resetInactivityTimer();
  }

  static isSessionLocked(): boolean {
    return this.isLocked || localStorage.getItem(this.LOCK_KEY) === 'locked';
  }

  static forceWipe(): void {
    // Clear all sensitive data when locked
    sessionStorage.clear();
    localStorage.removeItem('wallet_data');
    localStorage.removeItem('transaction_history');
    console.log('Sensitive data wiped due to inactivity');
  }
}
