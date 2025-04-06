import express, { type Express, type Request, type Response, type NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";
import multer from "multer";
import { z } from "zod";
import {
  insertUserSchema,
  insertFacebookSettingsSchema,
  insertCaptionSchema,
} from "@shared/schema";
// Import the type extensions
import "./types";
// Import auth setup
import { setupAuth } from "./auth";
// Import route modules
import scheduleRoutes from "./routes/schedule";
import aiCaptionRoutes from "./routes/ai-captions";

// Set up multer for video uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_config = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage_config,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "video/mp4") {
      return cb(new Error("Only MP4 videos are allowed"));
    }
    cb(null, true);
  },
});

// Helper function to handle errors
const handleError = (res: Response, error: unknown) => {
  console.error("Error:", error);
  if (error instanceof z.ZodError) {
    return res.status(400).json({ message: error.errors });
  }
  if (error instanceof Error) {
    return res.status(500).json({ message: error.message });
  }
  return res.status(500).json({ message: "Internal server error" });
};

// Current logged in user middleware (simplified for demo)
const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Hardcoded user ID for demo purposes
    const userId = 1;
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    req.user = user;
    next();
  } catch (error) {
    handleError(res, error);
  }
};

// Extended Request interface is in types.ts

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  
  // Register modular route handlers
  app.use('/api', scheduleRoutes);
  app.use('/api', aiCaptionRoutes);
  
  // Apply authentication middleware to protected API routes (except login/register)
  app.use("/api", (req, res, next) => {
    // Skip authentication for login/register/user routes
    if (req.path === "/login" || req.path === "/register" || req.path === "/logout" || req.path === "/user") {
      return next();
    }
    
    // Check if user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    next();
  });
  
  // User endpoints
  app.get("/api/user", async (req, res) => {
    try {
      res.json(req.user);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  app.patch("/api/user", async (req, res) => {
    try {
      const data = req.body;
      const updatedUser = await storage.updateUser(req.user.id, data);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(updatedUser);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Facebook settings endpoints
  app.get("/api/facebook-settings", async (req, res) => {
    try {
      const settings = await storage.getFacebookSettings(req.user.id);
      res.json(settings || {});
    } catch (error) {
      handleError(res, error);
    }
  });
  
  app.post("/api/facebook-settings", async (req, res) => {
    try {
      const data = {
        userId: req.user.id,
        ...req.body
      };
      
      insertFacebookSettingsSchema.parse(data);
      
      const settings = await storage.getFacebookSettings(req.user.id);
      if (settings) {
        const updatedSettings = await storage.updateFacebookSettings(req.user.id, req.body);
        return res.json(updatedSettings);
      }
      
      const newSettings = await storage.createFacebookSettings(data);
      res.status(201).json(newSettings);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Video endpoints
  app.get("/api/videos", async (req, res) => {
    try {
      const videos = await storage.getVideos(req.user.id);
      res.json(videos);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  app.post("/api/videos", upload.single("video"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No video file uploaded" });
      }
      
      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ message: "Title is required" });
      }
      
      const video = {
        userId: req.user.id,
        title,
        filename: req.file.filename,
        filesize: req.file.size,
        status: "pending",
        scheduledFor: null,
        createdAt: new Date()
      };
      
      const newVideo = await storage.createVideo(video);
      
      // Update usage metrics
      const metrics = await storage.getUsageMetrics(req.user.id);
      if (metrics) {
        await storage.updateUsageMetrics(req.user.id, {
          storageUsed: metrics.storageUsed + req.file.size
        });
      }
      
      res.status(201).json(newVideo);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  app.delete("/api/videos/:id", async (req, res) => {
    try {
      const videoId = parseInt(req.params.id);
      if (isNaN(videoId)) {
        return res.status(400).json({ message: "Invalid video ID" });
      }
      
      const video = await storage.getVideo(videoId);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      if (video.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to delete this video" });
      }
      
      // Delete the file
      const filePath = path.join(uploadDir, video.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      await storage.deleteVideo(videoId);
      res.status(204).send();
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Caption endpoints
  app.get("/api/captions", async (req, res) => {
    try {
      const captions = await storage.getCaptions(req.user.id);
      res.json(captions);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  app.post("/api/captions", async (req, res) => {
    try {
      const data = {
        userId: req.user.id,
        content: req.body.content
      };
      
      insertCaptionSchema.parse(data);
      
      const newCaption = await storage.createCaption(data);
      res.status(201).json(newCaption);
    } catch (error) {
      handleError(res, error);
    }
  });
  
  app.delete("/api/captions/:id", async (req, res) => {
    try {
      const captionId = parseInt(req.params.id);
      if (isNaN(captionId)) {
        return res.status(400).json({ message: "Invalid caption ID" });
      }
      
      const caption = await storage.getCaption(captionId);
      if (!caption) {
        return res.status(404).json({ message: "Caption not found" });
      }
      
      if (caption.userId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to delete this caption" });
      }
      
      await storage.deleteCaption(captionId);
      res.status(204).send();
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Subscription endpoints
  app.get("/api/subscription", async (req, res) => {
    try {
      const subscription = await storage.getSubscription(req.user.id);
      res.json(subscription || {});
    } catch (error) {
      handleError(res, error);
    }
  });
  
  // Usage metrics endpoints
  app.get("/api/usage-metrics", async (req, res) => {
    try {
      const metrics = await storage.getUsageMetrics(req.user.id);
      res.json(metrics || { storageUsed: 0, tasksUsed: 0 });
    } catch (error) {
      handleError(res, error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
