// Standalone Vercel serverless function for the Clerk webhook.
// This bypasses Express entirely for this route so we have full control
// over reading the RAW request body — required for svix signature verification.

import { Webhook } from "svix";
import connectDB from "../configs/mongodb.js";
import User from "../models/User.js";

// CRITICAL: tells Vercel NOT to auto-parse the body for this function.
// Without this, Vercel hands you an already-JSON-parsed object and svix
// verification will always fail, no matter what middleware you add in Express.
export const config = {
  api: {
    bodyParser: false,
  },
};

// Manually read the raw request stream into a Buffer
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

let dbReady = false;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    // Ensure DB connection (serverless functions can cold-start)
    if (!dbReady) {
      await connectDB();
      dbReady = true;
    }

    const rawBody = await getRawBody(req);

    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verify against the TRUE raw bytes Clerk sent
    webhook.verify(rawBody, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = JSON.parse(rawBody.toString());

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url,
        };
        await User.create(userData);
        return res.status(200).json({ success: true });
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        return res.status(200).json({ success: true });
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        return res.status(200).json({ success: true });
      }

      default:
        return res
          .status(400)
          .json({ success: false, message: "Unknown event type" });
    }
  } catch (error) {
    console.error("Clerk webhook error:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
}
