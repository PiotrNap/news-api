import Express from "express";
import ratelimit from "express-rate-limit";
import fetch from "node-fetch";

import { NEWS_API_KEY } from "./env.js";
import { db } from "./db.js";

const limiter = ratelimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});

const API_URL = "https://gnews.io/api/v4/";
const PORT = 9000;
const HOST = "localhost";
const app = new Express();

/**
 * Helper functions
 */
function getAPIUrl(endpoint = "") {
  return API_URL + endpoint + `?apiKey=${NEWS_API_KEY}`;
}

app.use(limiter);
app.use(Express.json());

/**
 * Get the latest news
 */
app.get("/", async (req, res, next) => {
  try {
    const res = await fetch(getAPIUrl());
    if (!res.ok) {
      res.status(500).message("We were unable to obtain latest news");
      console.error(res.body);
    }
    const data = await res.json();

    res.send(data);
  } catch (e) {
    res.status(500).message("We were unable to obtain latest news");
  }
});

/**
 * fetching N news articles
 */

/**
 * finding a news article with a specific title or author
 */

/**
 * searching by keywords
 */

app.listen(PORT, HOST, () => console.log("News are ready to be delivered"));
