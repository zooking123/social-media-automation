import { Router } from "express";
import { storage } from "../storage";
import { z } from "zod";
import { generateCaption } from "../services/openai";

const router = Router();

// AI Caption generation schema
const aiCaptionRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  tone: z.string().optional(),
  length: z.enum(["short", "medium", "long"]).optional(),
  keywords: z.array(z.string()).optional(),
  creativity: z.number().min(0).max(1).optional(),
  languageStyle: z.string().optional(),
});

// Generate AI caption
router.post("/ai/generate-caption", async (req, res) => {
  try {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Validate request body
    const validatedData = aiCaptionRequestSchema.parse(req.body);
    
    // Use OpenAI to generate a caption
    const caption = await generateCaption({
      prompt: validatedData.prompt,
      tone: validatedData.tone,
      length: validatedData.length,
      keywords: validatedData.keywords,
      creativity: validatedData.creativity,
      languageStyle: validatedData.languageStyle,
    });
    
    // Update usage metrics to track API usage
    const metrics = await storage.getUsageMetrics(req.user.id);
    if (metrics) {
      await storage.updateUsageMetrics(req.user.id, {
        tasksUsed: metrics.tasksUsed + 1
      });
    }
    
    res.json({ caption });
  } catch (error) {
    console.error("Error generating AI caption:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid request data", details: error.format() });
    }
    
    res.status(500).json({ error: "Failed to generate caption" });
  }
});

export default router;