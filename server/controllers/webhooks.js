import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhook = async (req, res) => {
  try {
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // req.body is now a raw Buffer (thanks to express.raw() in server.js)
    // svix needs the EXACT raw bytes Clerk sent — not a re-stringified object.
    await webhook.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // Parse the verified raw buffer into JSON ourselves, now that it's trusted
    const { data, type } = JSON.parse(req.body.toString());

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
        return res.status(400).json({
          success: false,
          message: "Unknown event type",
        });
    }
  } catch (error) {
    console.error("Clerk webhook error:", error.message);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
