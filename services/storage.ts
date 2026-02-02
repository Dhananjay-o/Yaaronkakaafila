import { Donation, AppState } from '../types';

const STORAGE_KEY = 'yaaron_ka_kaafila_data_v2';
const INITIAL_GOAL = 100000;

export const getStoredData = (): AppState => {
  if (typeof window === "undefined") {
    return {
      donations: [],
      totalCollected: 0,
      goalAmount: INITIAL_GOAL
    };
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    let donations: Donation[] = [];

    if (stored) {
      const parsed = JSON.parse(stored);
      donations = parsed?.donations || [];
    } else {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          donations: [],
          totalCollected: 0,
          goalAmount: INITIAL_GOAL
        })
      );
    }

    const verifiedDonations = donations.filter(d => d.status === 'verified');
    const totalCollected = verifiedDonations.reduce(
      (sum, d) => sum + d.amount,
      0
    );

    return {
      donations,
      totalCollected,
      goalAmount: INITIAL_GOAL
    };
  } catch (error) {
    return {
      donations: [],
      totalCollected: 0,
      goalAmount: INITIAL_GOAL
    };
  }
};

export const createPendingDonation = (
  donation: Omit<Donation, 'id' | 'timestamp' | 'status'>
): Donation => {
  const currentData = getStoredData();

  const newDonation: Donation = {
    ...donation,
    id: Math.random().toString(36).slice(2, 11),
    timestamp: Date.now(),
    status: 'pending'
  };

  const newState: AppState = {
    ...currentData,
    donations: [newDonation, ...currentData.donations],
    totalCollected: currentData.totalCollected
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  return newDonation;
};

export const verifyTransaction = async (
  transactionId: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentData = getStoredData();

      const updatedDonations = currentData.donations.map(d => {
        if (d.transactionId === transactionId) {
          return { ...d, status: 'verified' as const };
        }
        return d;
      });

      const newTotal = updatedDonations
        .filter(d => d.status === 'verified')
        .reduce((sum, d) => sum + d.amount, 0);

      const newState: AppState = {
        ...currentData,
        donations: updatedDonations,
        totalCollected: newTotal
      };

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      resolve(true);
    }, 2000);
  });
};

export const getFormattedCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};
