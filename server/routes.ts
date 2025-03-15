import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fetch from "node-fetch";

// LM Studio local API endpoint
const LM_STUDIO_API_URL = "http://127.0.0.1:1234/v1/chat/completions";
const LM_STUDIO_MODELS_URL = "http://127.0.0.1:1234/v1/models";

// Type guard to check if an object is a Response object
function isResponse(obj: any): obj is Response {
  return obj && typeof obj.json === 'function';
}

// Debug function for API calls
function logApiCall(method: string, url: string, body: Record<string, any> | null) {
  console.log(`[DEBUG] API Call: ${method} ${url}`);
  if (body) console.log(`[DEBUG] Request Body: ${JSON.stringify(body)}`);
}

// Whether to use mock responses when LM Studio is not available
const USE_MOCK_RESPONSES = true;

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    return res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // LM Studio diagnostics endpoint
  app.get("/api/lmstudio-diagnostics", async (_req, res) => {
    try {
      // Test basic connection
      const testResponse = await fetch("http://127.0.0.1:1234/", {
        method: "GET",
        signal: AbortSignal.timeout(2000)
      }).catch(err => ({ ok: false, error: String(err) }));

      // Test models endpoint
      const modelsResponse = await fetch(LM_STUDIO_MODELS_URL, {
        method: "GET",
        headers: { "Accept": "application/json" },
        signal: AbortSignal.timeout(2000)
      }).catch(err => ({ ok: false, error: String(err) }));

      let modelsData = null;
      if (isResponse(modelsResponse) && modelsResponse.ok) {
        try {
          modelsData = await modelsResponse.json();
        } catch (e) {
          modelsData = { parseError: String(e) };
        }
      }

      return res.json({
        baseEndpoint: {
          reachable: isResponse(testResponse) ? testResponse.ok === true : Boolean((testResponse as any).ok),
          error: isResponse(testResponse) && testResponse.ok ? null : String((testResponse as any).error || "Unknown error")
        },
        modelsEndpoint: {
          reachable: isResponse(modelsResponse) ? modelsResponse.ok === true : Boolean((modelsResponse as any).ok),
          status: isResponse(modelsResponse) ? modelsResponse.status : undefined,
          data: modelsData,
          error: isResponse(modelsResponse) && modelsResponse.ok ? null : String((modelsResponse as any).error || "Unknown error")
        },
        tips: [
          "Make sure LM Studio is running and the API server is enabled",
          "Check the LM Studio API server is running on port 1234",
          "Ensure your firewall allows connections to port 1234"
        ]
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Error running diagnostics",
        error: String(error)
      });
    }
  });

  // Endpoint to check if LM Studio is available
  app.get("/api/lmstudio-status", async (_req, res) => {
    try {
      // Log the API call for debugging
      logApiCall("GET", LM_STUDIO_MODELS_URL, null);

      const response = await fetch(LM_STUDIO_MODELS_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        // Set a short timeout to quickly check if LM Studio is running
        signal: AbortSignal.timeout(2000)
      });

      // Log response status for debugging
      console.log(`[DEBUG] LM Studio models API response status: ${response.status}`);

      if (response.ok) {
        const data = await response.json() as { data?: any[] };
        console.log(`[DEBUG] Available models: ${JSON.stringify(data)}`);

        return res.json({ 
          status: "available",
          message: "LM Studio API is available",
          models: data.data || [] 
        });
      } else {
        const errorText = await response.text();
        console.error(`[ERROR] LM Studio API error: ${errorText}`);

        return res.json({ 
          status: "error",
          message: `LM Studio API responded with status: ${response.status}`,
          error: errorText
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
  // Image analysis endpoint
app.post("/api/analyze-image", async (req, res) => {
  try {
    const { image_url } = req.body;
    
    if (!image_url) {
      return res.status(400).json({ message: "Image URL is required" });
    }

    // Define system prompt for image analysis
    const systemPrompt = `You are an AI assistant for the Government of India's E-governance portal.
    Analyze this image and provide information relevant to Indian government services, documents, or initiatives.
    If you see any official documents, describe their validity and relevant department.
    If you see infrastructure or government buildings, explain their purpose.
    Keep responses formal and informative.`;

    try {
      const requestBody = {
        model: "mistral-7b-instruct-v0.3",
        messages: [
          { 
            role: "user", 
            content: `${systemPrompt}\n\nPlease analyze this image: ${image_url}\n\nDescribe what you see and provide relevant government service information.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      };

      const response = await fetch(LM_STUDIO_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`LM Studio API responded with status: ${response.status}`);
      }

      const completion = await response.json();
      const responseText = completion.choices?.[0]?.message?.content || 
        "I apologize, but I couldn't analyze the image. Please try again.";

      return res.json({ 
        message: responseText,
        source: "lm-studio"
      });

    } catch (error) {
      console.error("Error connecting to LM Studio:", error);
      return res.status(503).json({
        message: "Image analysis service is currently unavailable",
        error: String(error)
      });
    }
  } catch (error) {
    console.error("Error processing image analysis request:", error);
    return res.status(500).json({ 
      message: "An error occurred while analyzing the image" 
    });
  }
});

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
        // From logs we can see the available models are: "mistral-7b-instruct-v0.3", "text-embedding-nomic-embed-text-v1.5", "llama-3.2-1b-instruct"
        // Incorporate system prompt into the user message since LM Studio doesn't support system role
        const requestBody = {
          model: "mistral-7b-instruct-v0.3", // Using a model that exists in your LM Studio
          messages: [
            { role: "user", content: `${systemPrompt}\n\nUser question: ${message}` }
          ],
          temperature: 0.7,
          max_tokens: 500,
        };

        // Log the API call for debugging
        logApiCall("POST", LM_STUDIO_API_URL, requestBody);

        // Make sure we're using the correct HTTP method (POST) and proper JSON formatting
        const response = await fetch(LM_STUDIO_API_URL, {
          method: "POST", // Must be POST, not GET
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(requestBody),
          // Set a longer timeout for model loading
          signal: AbortSignal.timeout(30000)
        });

        // Log response status for debugging
        console.log(`[DEBUG] LM Studio API response status: ${response.status}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`LM Studio API responded with status: ${response.status}`, errorText);
          
          // Check specifically for jinja template error related to roles
          if (errorText.includes("Only user and assistant roles are supported")) {
            console.error("LM Studio doesn't support system role, converting to user message format");
            throw new Error("LM Studio API role format error");
          } else {
            throw new Error(`LM Studio API responded with status: ${response.status}`);
          }
        }

        const completion = await response.json() as any;
        console.log("LM Studio API response:", JSON.stringify(completion).substring(0, 200) + "...");

        // Check for errors in the response
        if (completion.error) {
          console.error("LM Studio API error:", completion.error);
          throw new Error(`LM Studio API error: ${completion.error.message || JSON.stringify(completion.error)}`);
        }
        
        // Handle prediction-error specifically
        if (completion.status === "error" && completion.message?.includes("prediction-error")) {
          console.error("LM Studio prediction error:", completion.message);
          throw new Error("The model encountered an error generating a response. Please try again with a different prompt.");
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