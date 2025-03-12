export interface Subscription {
  id: string;
  planName: string;
  expiresAt: string; // ISO string
}

export interface MpesaTransaction {
  code: string;
  timestamp: string; // ISO string
}

const STORAGE_KEYS = {
  SUBSCRIPTIONS: 'proelitestats_subscriptions',
  MPESA_CODES: 'proelitestats_mpesa_codes'
} as const;

// Helper to get midnight of the current day
const getMidnight = () => {
  const date = new Date();
  date.setHours(24, 0, 0, 0);
  return date.toISOString();
};

// Helper to check if a date is past midnight
const isPastMidnight = (dateStr: string) => {
  return new Date(dateStr) <= new Date();
};

export const subscriptionStorage = {
  getSubscriptions(): Subscription[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
      if (!stored) return [];

      const subscriptions: Subscription[] = JSON.parse(stored);
      
      // Filter out expired subscriptions
      const active = subscriptions.filter(sub => !isPastMidnight(sub.expiresAt));
      
      // If any were filtered out, update storage
      if (active.length !== subscriptions.length) {
        this.setSubscriptions(active);
      }
      
      return active;
    } catch (error) {
      console.error('Error reading subscriptions:', error);
      return [];
    }
  },

  setSubscriptions(subscriptions: Subscription[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subscriptions));
  },

  addSubscription(planName: string): string {
    const subscriptions = this.getSubscriptions();
    const newSubscription: Subscription = {
      id: crypto.randomUUID(),
      planName,
      expiresAt: getMidnight()
    };
    
    this.setSubscriptions([...subscriptions, newSubscription]);
    return newSubscription.id;
  },

  hasActiveSubscription(planName: string): boolean {
    return this.getSubscriptions().some(sub => sub.planName === planName);
  }
};

export const mpesaStorage = {
  getTransactions(): MpesaTransaction[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MPESA_CODES);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading M-PESA transactions:', error);
      return [];
    }
  },

  setTransactions(transactions: MpesaTransaction[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.MPESA_CODES, JSON.stringify(transactions));
  },

  isCodeUsed(code: string): boolean {
    return this.getTransactions().some(tx => tx.code === code);
  },

  addTransaction(code: string) {
    const transactions = this.getTransactions();
    const newTransaction: MpesaTransaction = {
      code,
      timestamp: new Date().toISOString()
    };
    
    this.setTransactions([...transactions, newTransaction]);
  }
};