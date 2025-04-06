import OpenAI from "openai";

// Initialize OpenAI client with OpenRouter API key and configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export interface GenerateCaptionParams {
  prompt: string;
  tone?: string;
  length?: 'short' | 'medium' | 'long';
  keywords?: string[];
  creativity?: number;
  languageStyle?: string;
}

export async function generateCaption(params: GenerateCaptionParams): Promise<string> {
  const { prompt, tone, length, keywords, creativity, languageStyle } = params;
  
  // Build the system prompt with all parameters
  let systemPrompt = `You are an expert social media content writer specializing in creating engaging Facebook captions. 
Create a ${length || 'medium'}-length caption in a ${tone || 'friendly'} tone with a ${languageStyle || 'casual'} language style.`;
  
  if (keywords && keywords.length > 0) {
    systemPrompt += ` Include these keywords naturally: ${keywords.join(', ')}.`;
  }
  
  // Build the user prompt with the content description
  const userPrompt = `Write a caption for this content: ${prompt}`;
  
  try {
    // Call OpenRouter API with Gemma model
    const response = await openai.chat.completions.create({
      model: "google/gemma-3-12b-it:free", 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: creativity !== undefined ? creativity : 0.7,
      max_tokens: length === 'short' ? 100 : length === 'medium' ? 200 : 350
    }, {
      headers: {
        "HTTP-Referer": "https://replit.dev",
        "X-Title": "Social Media Manager"
      }
    });
    
    const content = response.choices[0].message.content;
    return content ? content.trim() : "No caption generated. Please try again.";
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    throw new Error(`Failed to generate caption: ${error?.message || 'Unknown error'}`);
  }
}