import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhook } from "./controllers/webhooks.js";

const app = express();
await connectDB();

app.use(cors());

app.get("/", (req, res) => res.send("API working"));

// IMPORTANT: Clerk webhook needs the RAW body (not JSON-parsed) for svix
// signature verification to work. Do NOT put express.json() before this route,
// and do NOT use express.json() globally before this line.
app.post("/clerk", express.raw({ type: "application/json" }), clerkWebhook);

// Any other routes that need JSON parsing can use express.json() AFTER this point
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App is running on port http://localhost:${PORT}`);
});
