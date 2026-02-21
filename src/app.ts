import cors from "cors";
import express, { Application, Request, Response } from "express";
import { errorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import router from "./routes";

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

//application routes
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Apollo Gears World!");
});
app.use(errorHandler);
app.use(notFound);

export default app;
