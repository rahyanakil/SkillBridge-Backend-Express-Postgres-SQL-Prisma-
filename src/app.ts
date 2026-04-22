import cors from "cors";
import express, { Application, Request, Response } from "express";
import path from "path";
import { errorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import router from "./routes";

const app: Application = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

// Serve uploaded avatars as static files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/v1", router);

app.get("/", (_req: Request, res: Response) => {
  res.send("SkillBridge API is running!");
});

app.use(notFound);
app.use(errorHandler);

export default app;
