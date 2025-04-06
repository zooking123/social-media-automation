export interface UserProfile {
  id: number;
  username: string;
  name: string;
  email: string;
}

export interface FacebookSettings {
  id?: number;
  userId?: number;
  accessToken?: string;
  pageId?: string;
  uploadFrequency?: number;
}

export interface Video {
  id: number;
  userId: number;
  title: string;
  filename: string;
  filesize: number;
  status: 'pending' | 'processing' | 'scheduled' | 'published' | 'failed';
  scheduledFor?: Date | null;
  createdAt: Date;
}

export interface Caption {
  id: number;
  userId: number;
  content: string;
  createdAt: Date;
}

export interface Subscription {
  id: number;
  userId: number;
  plan: 'trial' | 'basic' | 'pro' | '5day';
  status: 'active' | 'expired' | 'cancelled';
  expiresAt?: Date | null;
  storage: number;
  tasks: number;
}

export interface UsageMetrics {
  id?: number;
  userId?: number;
  storageUsed: number;
  tasksUsed: number;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  storage: number;
  tasks: number;
  duration?: number;
  features: string[];
}

export const availablePlans: Plan[] = [
  {
    id: 'trial',
    name: 'Trial',
    price: 299,
    storage: 1024, // 1GB in MB
    tasks: 100,
    features: [
      '1GB Storage',
      '100 Tasks',
      'Priority Support'
    ]
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 500,
    storage: 1024, // 1GB in MB
    tasks: 100,
    features: [
      '1GB Storage',
      '100 Tasks',
      'Priority Support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 1000,
    storage: 2048, // 2GB in MB
    tasks: 100,
    features: [
      '2GB Storage',
      '100 Tasks',
      'Priority Support'
    ]
  },
  {
    id: '5day',
    name: '5-day Pack',
    price: 3000,
    storage: 2048, // 2GB in MB
    tasks: 100,
    duration: 60, // 60 days
    features: [
      '60 days',
      '2GB Storage',
      '100 Tasks',
      'Priority Support'
    ]
  }
];
