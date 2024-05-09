import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import userRoutes from "./routes/users";
import scrapingRoutes from "./routes/scrapingRoutes";
import scrapeMetadataRoutes from "./routes/scrapeMetadataRoutes";
import selectorRoutes from "./routes/selectorRoutes";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import session from "express-session";
import env from "./util/validateEnv";
import MongoStore from "connect-mongo";
import { requiresAuth } from "./middleware/auth";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGO_CONNECTION_STRING,
    }),
  })
);

app.use("/api/users", userRoutes);
app.use("/api/scrape", scrapingRoutes); // Use scraping routes
app.use("/api/scrapeMetadata", requiresAuth, scrapeMetadataRoutes);
app.use("/api/selectors", requiresAuth, selectorRoutes);

// middleware error handler
// not setup endpoint error
app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found")); // Resource not found 404
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An unknown error occurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
