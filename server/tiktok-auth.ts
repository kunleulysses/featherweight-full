import { Express, Request, Response } from "express";
import { storage } from "./storage";

const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY || "awd2cd5ce7rrtab9";
const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET || "kogFRgY8NWSWhK6qnX0eVRLERUEKnZcY";
const REDIRECT_URI = process.env.NODE_ENV === "production" 
  ? "https://featherweight.world/auth/tiktok/callback"
  : "http://localhost:5000/auth/tiktok/callback";

export function setupTikTokAuth(app: Express) {
  // Initiate TikTok OAuth flow
  app.get("/auth/tiktok", (req: Request, res: Response) => {
    const state = Math.random().toString(36).substring(2, 15);
    
    // Store state in session for security
    (req.session as any).tikTokState = state;
    
    const authUrl = new URL("https://www.tiktok.com/v2/auth/authorize/");
    authUrl.searchParams.append("client_key", TIKTOK_CLIENT_KEY);
    authUrl.searchParams.append("scope", "user.info.basic");
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.append("state", state);
    
    res.redirect(authUrl.toString());
  });

  // Handle TikTok OAuth callback
  app.get("/auth/tiktok/callback", async (req: Request, res: Response) => {
    try {
      const { code, state } = req.query;
      
      // Verify state parameter
      if (state !== (req.session as any).tikTokState) {
        return res.status(400).json({ error: "Invalid state parameter" });
      }
      
      if (!code) {
        return res.status(400).json({ error: "Authorization code not provided" });
      }

      // Exchange code for access token
      const tokenResponse = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_key: TIKTOK_CLIENT_KEY,
          client_secret: TIKTOK_CLIENT_SECRET,
          code: code as string,
          grant_type: "authorization_code",
          redirect_uri: REDIRECT_URI,
        }),
      });

      const tokenData = await tokenResponse.json();
      
      if (!tokenResponse.ok) {
        console.error("TikTok token exchange failed:", tokenData);
        return res.status(400).json({ error: "Failed to exchange code for token" });
      }

      // Get user info from TikTok
      const userResponse = await fetch("https://open.tiktokapis.com/v2/user/info/", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      const userData = await userResponse.json();
      
      if (!userResponse.ok) {
        console.error("TikTok user info failed:", userData);
        return res.status(400).json({ error: "Failed to get user information" });
      }

      // Check if user already exists
      let user = await storage.getUserByEmail(`${userData.data.user.username}@tiktok.featherweight.world`);
      
      if (!user) {
        // Create new user account
        user = await storage.createUser({
          username: userData.data.user.username || `tiktok_${Date.now()}`,
          email: `${userData.data.user.username}@tiktok.featherweight.world`,
          password: Math.random().toString(36).substring(2, 15), // Random password for TikTok users
          firstName: userData.data.user.display_name?.split(' ')[0] || '',
          lastName: userData.data.user.display_name?.split(' ').slice(1).join(' ') || '',
        });
      }

      // Log the user in
      req.login(user, (err) => {
        if (err) {
          console.error("Login error:", err);
          return res.status(500).json({ error: "Failed to log in user" });
        }
        
        // Redirect to main app
        res.redirect("/journal");
      });

    } catch (error) {
      console.error("TikTok auth callback error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}