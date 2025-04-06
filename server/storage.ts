import {
  users, 
  facebookSettings, 
  videos,
  captions,
  subscriptions,
  usageMetrics,
  type User, 
  type InsertUser,
  type FacebookSettings,
  type InsertFacebookSettings,
  type Video,
  type InsertVideo,
  type Caption,
  type InsertCaption,
  type Subscription,
  type InsertSubscription,
  type UsageMetrics,
  type InsertUsageMetrics
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  sessionStore: session.Store;
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;

  // Facebook settings operations
  getFacebookSettings(userId: number): Promise<FacebookSettings | undefined>;
  createFacebookSettings(settings: InsertFacebookSettings): Promise<FacebookSettings>;
  updateFacebookSettings(userId: number, data: Partial<FacebookSettings>): Promise<FacebookSettings | undefined>;

  // Video operations
  getVideos(userId: number): Promise<Video[]>;
  getVideo(id: number): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: number, data: Partial<Video>): Promise<Video | undefined>;
  deleteVideo(id: number): Promise<boolean>;

  // Caption operations
  getCaptions(userId: number): Promise<Caption[]>;
  getCaption(id: number): Promise<Caption | undefined>;
  createCaption(caption: InsertCaption): Promise<Caption>;
  updateCaption(id: number, data: Partial<Caption>): Promise<Caption | undefined>;
  deleteCaption(id: number): Promise<boolean>;

  // Subscription operations
  getSubscription(userId: number): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(userId: number, data: Partial<Subscription>): Promise<Subscription | undefined>;

  // Usage metrics operations
  getUsageMetrics(userId: number): Promise<UsageMetrics | undefined>;
  createUsageMetrics(metrics: InsertUsageMetrics): Promise<UsageMetrics>;
  updateUsageMetrics(userId: number, data: Partial<UsageMetrics>): Promise<UsageMetrics | undefined>;
}

export class MemStorage implements IStorage {
  sessionStore: any;
  private users: Map<number, User>;
  private facebookSettings: Map<number, FacebookSettings>;
  private videos: Map<number, Video>;
  private captions: Map<number, Caption>;
  private subscriptions: Map<number, Subscription>;
  private usageMetrics: Map<number, UsageMetrics>;
  private currentId: { [key: string]: number };

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
    this.users = new Map();
    this.facebookSettings = new Map();
    this.videos = new Map();
    this.captions = new Map();
    this.subscriptions = new Map();
    this.usageMetrics = new Map();
    this.currentId = {
      users: 1,
      facebookSettings: 1,
      videos: 1,
      captions: 1,
      subscriptions: 1,
      usageMetrics: 1
    };

    // Add a default user for testing
    const defaultUser: User = {
      id: 1,
      username: 'aman',
      password: 'password',
      name: 'Aman',
      email: 'aman@example.com'
    };
    this.users.set(defaultUser.id, defaultUser);

    // Add default subscription for the user
    const defaultSubscription: Subscription = {
      id: 1,
      userId: 1,
      plan: 'trial',
      status: 'active',
      expiresAt: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000), // 26 days from now
      storage: 512, // 512 MB
      tasks: 100
    };
    this.subscriptions.set(defaultSubscription.id, defaultSubscription);

    // Add default usage metrics
    const defaultMetrics: UsageMetrics = {
      id: 1,
      userId: 1,
      storageUsed: 0,
      tasksUsed: 0
    };
    this.usageMetrics.set(defaultMetrics.id, defaultMetrics);

    // Set next IDs
    this.currentId.users = 2;
    this.currentId.subscriptions = 2;
    this.currentId.usageMetrics = 2;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Facebook settings operations
  async getFacebookSettings(userId: number): Promise<FacebookSettings | undefined> {
    return Array.from(this.facebookSettings.values()).find(
      (settings) => settings.userId === userId
    );
  }

  async createFacebookSettings(settings: InsertFacebookSettings): Promise<FacebookSettings> {
    const id = this.currentId.facebookSettings++;
    const facebookSettings: FacebookSettings = { ...settings, id };
    this.facebookSettings.set(id, facebookSettings);
    return facebookSettings;
  }

  async updateFacebookSettings(userId: number, data: Partial<FacebookSettings>): Promise<FacebookSettings | undefined> {
    const settings = Array.from(this.facebookSettings.values()).find(
      (settings) => settings.userId === userId
    );
    
    if (!settings) {
      // If settings don't exist, create them
      return this.createFacebookSettings({ 
        userId, 
        ...data as InsertFacebookSettings 
      });
    }
    
    const updatedSettings = { ...settings, ...data };
    this.facebookSettings.set(settings.id, updatedSettings);
    return updatedSettings;
  }

  // Video operations
  async getVideos(userId: number): Promise<Video[]> {
    return Array.from(this.videos.values()).filter(
      (video) => video.userId === userId
    );
  }

  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const id = this.currentId.videos++;
    const newVideo: Video = { 
      ...video, 
      id, 
      createdAt: new Date() 
    };
    this.videos.set(id, newVideo);
    
    // Update usage metrics
    await this.updateStorageUsage(video.userId, video.filesize);
    
    return newVideo;
  }

  async updateVideo(id: number, data: Partial<Video>): Promise<Video | undefined> {
    const video = this.videos.get(id);
    if (!video) return undefined;
    
    const updatedVideo = { ...video, ...data };
    this.videos.set(id, updatedVideo);
    return updatedVideo;
  }

  async deleteVideo(id: number): Promise<boolean> {
    const video = this.videos.get(id);
    if (!video) return false;
    
    // Update usage metrics (subtract file size)
    await this.updateStorageUsage(video.userId, -video.filesize);
    
    return this.videos.delete(id);
  }

  // Caption operations
  async getCaptions(userId: number): Promise<Caption[]> {
    return Array.from(this.captions.values()).filter(
      (caption) => caption.userId === userId
    );
  }

  async getCaption(id: number): Promise<Caption | undefined> {
    return this.captions.get(id);
  }

  async createCaption(caption: InsertCaption): Promise<Caption> {
    const id = this.currentId.captions++;
    const newCaption: Caption = { 
      ...caption, 
      id, 
      createdAt: new Date() 
    };
    this.captions.set(id, newCaption);
    return newCaption;
  }

  async updateCaption(id: number, data: Partial<Caption>): Promise<Caption | undefined> {
    const caption = this.captions.get(id);
    if (!caption) return undefined;
    
    const updatedCaption = { ...caption, ...data };
    this.captions.set(id, updatedCaption);
    return updatedCaption;
  }

  async deleteCaption(id: number): Promise<boolean> {
    return this.captions.delete(id);
  }

  // Subscription operations
  async getSubscription(userId: number): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values()).find(
      (subscription) => subscription.userId === userId
    );
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const id = this.currentId.subscriptions++;
    const newSubscription: Subscription = { ...subscription, id };
    this.subscriptions.set(id, newSubscription);
    return newSubscription;
  }

  async updateSubscription(userId: number, data: Partial<Subscription>): Promise<Subscription | undefined> {
    const subscription = Array.from(this.subscriptions.values()).find(
      (subscription) => subscription.userId === userId
    );
    
    if (!subscription) return undefined;
    
    const updatedSubscription = { ...subscription, ...data };
    this.subscriptions.set(subscription.id, updatedSubscription);
    return updatedSubscription;
  }

  // Usage metrics operations
  async getUsageMetrics(userId: number): Promise<UsageMetrics | undefined> {
    return Array.from(this.usageMetrics.values()).find(
      (metrics) => metrics.userId === userId
    );
  }

  async createUsageMetrics(metrics: InsertUsageMetrics): Promise<UsageMetrics> {
    const id = this.currentId.usageMetrics++;
    const newMetrics: UsageMetrics = { ...metrics, id };
    this.usageMetrics.set(id, newMetrics);
    return newMetrics;
  }

  async updateUsageMetrics(userId: number, data: Partial<UsageMetrics>): Promise<UsageMetrics | undefined> {
    const metrics = Array.from(this.usageMetrics.values()).find(
      (metrics) => metrics.userId === userId
    );
    
    if (!metrics) return undefined;
    
    const updatedMetrics = { ...metrics, ...data };
    this.usageMetrics.set(metrics.id, updatedMetrics);
    return updatedMetrics;
  }

  // Helper methods
  private async updateStorageUsage(userId: number, bytesChange: number): Promise<void> {
    const metrics = await this.getUsageMetrics(userId);
    if (!metrics) return;
    
    const updatedStorageUsed = Math.max(0, metrics.storageUsed + bytesChange);
    await this.updateUsageMetrics(userId, { storageUsed: updatedStorageUsed });
  }
}

export const storage = new MemStorage();
