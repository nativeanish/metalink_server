import express, { Request, Response } from "express";
import cors from "cors";
import register_viewRouter from "./routers/register_view";
import morgan from "morgan";
import dotenv from "dotenv";
import registerSubdomainRouter from "./routers/register_subdomain";
import check_subdomainRouter from "./routers/check_subdomain";
import register_clickRouter from "./routers/register_click";
import serverless from "serverless-http";
dotenv.config();

validateEnv(["NODE_ENV", "KEY", "REDIS_URL", "REDIS_TOKEN"]);

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
}
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("Ping Pong");
});
app.use("/check", check_subdomainRouter);
app.use("/register", registerSubdomainRouter);
app.use("/register_view", register_viewRouter);
app.use("/register_click", register_clickRouter);

app.use((err: Error, _req: Request, res: Response, _next: Function) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running at ${process.env.PORT || 4000} port`);
});
export const handler = serverless(app);
function validateEnv(requiredEnvVars: string[]) {
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.error(
      `Error: Missing required environment variables: ${missingVars.join(", ")}`
    );
    process.exit(1); // Exit the application with an error code
  }
}
