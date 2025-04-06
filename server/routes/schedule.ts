import { Router } from "express";
import { storage } from "../storage";
import { z } from "zod";

const router = Router();

// Schedule data schema
const scheduleVideoSchema = z.object({
  videoId: z.number(),
  scheduledFor: z.string().datetime(),
});

// Get all scheduled videos
router.get("/schedule", async (req, res) => {
  try {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = req.user.id;
    
    // Get videos with a scheduledFor date set
    const videos = await storage.getVideos(userId);
    const scheduledVideos = videos
      .filter(video => video.scheduledFor !== null)
      .map(video => ({
        id: video.id,
        videoId: video.id,
        title: video.title,
        scheduledFor: video.scheduledFor,
      }));
    
    res.json(scheduledVideos);
  } catch (error) {
    console.error("Error getting scheduled videos:", error);
    res.status(500).json({ error: "Failed to get scheduled videos" });
  }
});

// Schedule a video
router.post("/schedule", async (req, res) => {
  try {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = req.user.id;
    
    // Validate request body
    const validatedData = scheduleVideoSchema.parse(req.body);
    
    // Check if the video exists and belongs to the user
    const video = await storage.getVideo(validatedData.videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    
    if (video.userId !== userId) {
      return res.status(403).json({ error: "You don't have permission to schedule this video" });
    }
    
    // Update the video with the scheduled date
    const scheduledVideo = await storage.updateVideo(validatedData.videoId, {
      scheduledFor: new Date(validatedData.scheduledFor),
      status: "scheduled",
    });
    
    res.json(scheduledVideo);
  } catch (error) {
    console.error("Error scheduling video:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.format() });
    }
    
    res.status(500).json({ error: "Failed to schedule video" });
  }
});

// Cancel a scheduled video
router.delete("/schedule/:id", async (req, res) => {
  try {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userId = req.user.id;
    const videoId = parseInt(req.params.id);
    
    // Check if the video exists and belongs to the user
    const video = await storage.getVideo(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    
    if (video.userId !== userId) {
      return res.status(403).json({ error: "You don't have permission to update this video" });
    }
    
    // Update the video to remove scheduling
    const updatedVideo = await storage.updateVideo(videoId, {
      scheduledFor: null,
      status: "pending",
    });
    
    res.json(updatedVideo);
  } catch (error) {
    console.error("Error canceling scheduled video:", error);
    res.status(500).json({ error: "Failed to cancel scheduled video" });
  }
});

export default router;