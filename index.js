import Express from "express";
import ratelimit from "express-rate-limit";
import fetch from "node-fetch";

import { NEWS_API_KEY } from "./env.js";
import { db } from "./db.js";

const limiter = ratelimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});

const API_URL = "https://gnews.io/api/v4/search";
const PORT = 9000;
const HOST = "localhost";
const app = new Express();

/**
 * Helper functions
 */
function getAPIUrl(query = "") {
  return API_URL + query + `&apiKey=${NEWS_API_KEY}`;
}

app.use(Express.json());

app.get("/help", async (req, res, next) => {
  const message = `To interact with our server, you can use the below endpoints:

    1. GET ${HOST}:${PORT} - to preview this message
    4. GET ${HOST}:${PORT}?q=[search-query] - to get articles searched by a given query
    2. GET ${HOST}:${PORT}?q=[search-query]&max=[N] - to get the N max news (1-100), by a given search query (q)
    3. GET ${HOST}:${PORT}?q=[search-query]&in=[title] - to get articles searched by a given title

    Good luck!
    `;

  res.send(message);
});

app.get("/news", limiter, async (req, res, next) => {
  const query = req.query;

  const { q, max, in: searchIn } = query;

  if (!q) {
    res
      .status(400)
      .send(
        "missing required query param 'q'. Please call /help endpoint to learn more",
      );
    next();
  }

  if (max & searchIn) {
    const recordKey = max + "_" + searchIn;
    let result = this.db.get(recordKey);
    if (result) {
      res.send(result);
      next();
    }

    try {
      const res = await fetch(getAPIUrl());
      console.log(res);
      if (!res.ok) {
        res.status(500).send("We were unable to obtain latest news");
        console.error(res.body);
      }
      const data = await res.json();

      res.send(data);
    } catch (e) {
      res.status(500).send("We were unable to obtain latest news");
    }
  }

  return;
  try {
    const res = await fetch(getAPIUrl());
    console.log(res);
    if (!res.ok) {
      res.status(500).send("We were unable to obtain latest news");
      console.error(res.body);
    }
    const data = await res.json();

    res.send(data);
  } catch (e) {
    res.status(500).send("We were unable to obtain latest news");
  }
});

app.listen(PORT, HOST, () => console.log("News are ready to be delivered"));
