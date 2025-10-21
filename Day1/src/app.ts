import express, { Express } from "express";
import router from "./routes"; // Import your index.ts router

const app: Express = express();

// Middleware
app.use(express.json());

// Attach your router under a path prefix (optional)
app.use("/", router); // Now all routes in router are accessible from "/"

// Root route (optional)
app.get("/", (req, res) => {
  res.send("Hello, Node.js with TypeScript!");
});

export default app;
