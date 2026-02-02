export interface Donation {
  id: string;
  transactionId: string; // Unique reference for UPI
  donorName: string;
  amount: number;
  message?: string;
  timestamp: number;
  isAnonymous: boolean;
  status: 'pending' | 'verified' | 'failed';
}

export enum SortOption {
  LATEST = 'LATEST',
  HIGHEST = 'HIGHEST'
}

export interface AppState {
  donations: Donation[];
  totalCollected: number;
  goalAmount: number;
}