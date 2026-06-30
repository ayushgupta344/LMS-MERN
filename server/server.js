import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";

const app = express();
await connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API working"));

// NOTE: The Clerk webhook now lives at /api/clerk.js as its own
// standalone Vercel serverless function (see vercel.json routing).
// It is intentionally NOT defined here, because Express + @vercel/node
// cannot reliably give us the raw request body needed for svix signature
// verification — Vercel's platform-level body parser strips it before
// Express middleware ever runs.

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App is running on port http://localhost:${PORT}`);
});
