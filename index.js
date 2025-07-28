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
  return API_URL + query + `&apikey=${NEWS_API_KEY}`;
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
        "missing required query param 'q'. Please call the /help endpoint to read the docs",
      );
    return next();
  }

  if (q && searchIn) {
    const recordKey = q + "_" + searchIn;
    let result = db.get(recordKey);
    console.log("cached result ", result);
    if (result) {
      res.send(result);
      return next();
    }

    try {
      const fetchedRes = await fetch(getAPIUrl(`?q=${q}&in=${searchIn}`));
      const data = await fetchedRes.json();

      if (!fetchedRes.ok) {
        console.error(data.errors);
        res.status(500).send(data.errors);
        return next();
      }

      db.set(recordKey, data.articles);
      res.status(200).send(data.articles);
      return next();
    } catch (e) {
      console.error(e);
      res.status(500).send("We were unable to obtain latest news");
      return next();
    }
  } else if (q && max) {
    const recordKey = q + "_" + max;
    let result = db.get(recordKey);
    console.log("cached result ", result);
    if (result) {
      res.send(result);
      return next();
    }

    try {
      const fetchedRes = await fetch(getAPIUrl(`?q=${q}&max=${max}`));
      const data = await fetchedRes.json();

      if (!fetchedRes.ok) {
        console.error(data.errors);
        res.status(500).send(data.errors);
        return next();
      } else {
        db.set(recordKey, data.articles);
        res.status(200).send(data.articles);
      }
    } catch (e) {
      console.error(e);
      res.status(500).send("We were unable to obtain latest news");
    } finally {
      return next();
    }
  } else {
    const recordKey = q;
    let result = db.get(recordKey);
    if (result) {
      res.send(result);
      return next();
    }

    try {
      const fetchedRes = await fetch(getAPIUrl(`?q=${q}`));
      const data = await fetchedRes.json();

      if (!fetchedRes.ok) {
        console.error(data.errors);
        res.status(500).send(data.errors);
        return next();
      } else {
        db.set(recordKey, data.articles);
        res.status(200).send(data.articles);
      }
    } catch (e) {
      console.error(e);
      res.status(500).send("We were unable to obtain latest news");
    } finally {
      return next();
    }
  }
});

app.listen(PORT, HOST, () => console.log("News are ready to be delivered"));
