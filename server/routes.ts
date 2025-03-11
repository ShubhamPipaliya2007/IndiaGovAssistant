import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fetch from "node-fetch";

// LM Studio local API endpoint
const LM_STUDIO_API_URL = "http://127.0.0.1:1234/v1/chat/completions";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat API endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message || typeof message !== "string") {
        return res.status(400).json({ message: "Invalid request: message is required" });
      }

      // Define the system prompt to guide the AI about E-governance in India
      const systemPrompt = `You are an AI assistant for the Government of India's E-governance portal. 
      Provide accurate, helpful information about Indian government services, initiatives, and programs.
      Focus on e-governance initiatives like Aadhaar, DigiLocker, UMANG, MyGov, Digital India, etc.
      Your responses should be concise, accurate, and helpful. 
      Format your responses with appropriate formatting for readability.
      Include relevant URLs to official government websites when applicable.
      Be respectful and use a formal tone appropriate for government communication.
      If you don't know the answer, admit it and suggest contacting the relevant department.`;
      
      // Make request to LM Studio API (compatible with OpenAI API format)
      const response = await fetch(LM_STUDIO_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "local-model", // This is ignored by LM Studio but required for API format
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`LM Studio API responded with status: ${response.status}`);
      }
      
      const completion = await response.json() as any;
      const responseText = completion.choices?.[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
      
      return res.json({ 
        message: responseText,
      });
      
    } catch (error) {
      console.error("Error processing chat request:", error);
      return res.status(500).json({ 
        message: "An error occurred while processing your request. Please try again later." 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
