import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fetch from "node-fetch";

// LM Studio local API endpoint
const LM_STUDIO_API_URL = "http://127.0.0.1:1234/v1/chat/completions";
const LM_STUDIO_MODELS_URL = "http://127.0.0.1:1234/v1/models";

// Whether to use mock responses when LM Studio is not available
const USE_MOCK_RESPONSES = true;

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    return res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Endpoint to check if LM Studio is available
  app.get("/api/lmstudio-status", async (_req, res) => {
    try {
      const response = await fetch(LM_STUDIO_MODELS_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Set a short timeout to quickly check if LM Studio is running
        signal: AbortSignal.timeout(2000)
      });
      
      if (response.ok) {
        return res.json({ 
          status: "available",
          message: "LM Studio API is available" 
        });
      } else {
        return res.json({ 
          status: "error",
          message: `LM Studio API responded with status: ${response.status}` 
        });
      }
    } catch (error) {
      return res.json({
        status: "unavailable",
        message: "LM Studio API is not available. Make sure LM Studio is running on http://127.0.0.1:1234"
      });
    }
  });

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
      
      try {
        // Try to use LM Studio API endpoint (local)
        const response = await fetch(LM_STUDIO_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "mistral-7b-instruct-v0.3", // Using a model that exists in your LM Studio
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: message }
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
          // Set a longer timeout for model loading
          signal: AbortSignal.timeout(30000)
        });
        
        if (!response.ok) {
          throw new Error(`LM Studio API responded with status: ${response.status}`);
        }
        
        const completion = await response.json() as any;
        
        // Check for errors in the response
        if (completion.error) {
          console.error("LM Studio API error:", completion.error);
          throw new Error(`LM Studio API error: ${completion.error.message || JSON.stringify(completion.error)}`);
        }
        
        const responseText = completion.choices?.[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
        
        return res.json({ 
          message: responseText,
          source: "lm-studio"
        });
      } catch (error) {
        console.error("Error connecting to LM Studio:", error);
        
        if (USE_MOCK_RESPONSES) {
          // Provide mock responses for testing when LM Studio is not available
          const mockResponses: Record<string, string> = {
            "digilocker": "DigiLocker is a flagship initiative under Digital India program. It provides citizens a secure cloud-based platform for storage, sharing and verification of documents & certificates. You can access it at digilocker.gov.in or through the mobile app.",
            "passport": "To apply for a passport in India, you need to visit the Passport Seva Portal (passportindia.gov.in), register, fill the application form, schedule an appointment, and visit the Passport Seva Kendra with required documents. The process has been streamlined under e-governance initiatives.",
            "aadhaar": "Aadhaar is India's biometric identification system that provides a 12-digit unique identity number. You can enroll for Aadhaar at any enrollment center and use it for various government services. The UIDAI website (uidai.gov.in) offers services like Aadhaar download, update, and verification.",
            "gst": "GST (Goods and Services Tax) is India's comprehensive indirect tax on the supply of goods and services. For GST-related services, you can visit the GST Portal (gst.gov.in) where you can register, file returns, and access various GST services digitally.",
            "umang": "UMANG (Unified Mobile Application for New-age Governance) is a mobile app that provides access to multiple government services in a single platform. It offers over 1,200 services from various government departments at central, state and local levels.",
            "digital india": "Digital India is a flagship program launched by the Government of India with a vision to transform India into a digitally empowered society and knowledge economy. Key initiatives include BharatNet, Digital Village, DigiLocker, and UMANG app.",
            "default": "I'm your E-Governance Assistant for India. I can provide information about various government services, schemes, and digital initiatives. What specific information would you like to know about Indian e-governance services?"
          };
          
          // Determine which mock response to send based on keywords in the message
          let responseToSend = mockResponses.default;
          const messageLower = message.toLowerCase();
          
          for (const [keyword, response] of Object.entries(mockResponses)) {
            if (keyword !== "default" && messageLower.includes(keyword)) {
              responseToSend = response;
              break;
            }
          }
          
          return res.json({
            message: responseToSend,
            source: "mock",
            note: "This is a mock response as LM Studio is not available. Connect to LM Studio at http://127.0.0.1:1234 for AI-generated responses."
          });
        } else {
          // If mock responses are disabled, return an error
          return res.status(503).json({
            message: "LM Studio API is not available. Make sure LM Studio is running on http://127.0.0.1:1234",
            error: String(error)
          });
        }
      }
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
