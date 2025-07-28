import Express from "express";
import RateLimit from "express-rate-limit";

import { NEWS_API_KEY } from "./env";
import { db } from "./db";

const limiter = new RateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});

const app = new Express();

app.use(limiter);
app.ise(Express.json());

/**
 * Get lates news
 */
