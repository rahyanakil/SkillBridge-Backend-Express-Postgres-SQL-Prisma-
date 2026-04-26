import cors from "cors";
import express, { Application, Request, Response } from "express";
import path from "path";
import { errorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import router from "./routes";

const app: Application = express();

app.use(express.json());

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [
        "https://skillbridge-frontend-ruby.vercel.app",
        process.env.APP_URL,
      ].filter(Boolean)
    : true;

app.use(cors({ origin: allowedOrigins, credentials: true }));

// Serve uploaded avatars as static files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/v1", router);

app.get("/", (_req: Request, res: Response) => {
  res.send("SkillBridge API is running!");
});

app.use(notFound);
app.use(errorHandler);

export default app;
