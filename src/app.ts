import cors from "cors";
import express, { Application, Request, Response } from "express";
import { AuthRoutes } from "./modules/auth/auth.routes";

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// application routes
// app.use('/api/v1', router);
app.use("/api/v1/auth", AuthRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Apollo Gears World!");
});

export default app;
