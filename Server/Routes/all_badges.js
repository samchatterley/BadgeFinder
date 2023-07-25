require("dotenv").config();
const express = require("express");
const router = express.Router();
const { logger } = require("../logger");
const rateLimit = require("express-rate-limit");

/**
 * Set up a rate limiter to limit requests to the API.
 * This limiter allows a maximum of 100 requests per 15 minutes.
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

router.use(limiter);

/**
 * This function exports a router that handles GET requests to the `/badges` endpoint.
 * It uses a MongoDB client to fetch all badges from the 'Badges' collection in the 'BadgeFinder' database.
 * If successful, it sends the badges as the response.
 * If there's an error, it sends a 500 status and an error message.
 *
 * @param {Object} client - The MongoDB client to use for database operations.
 * @returns {Object} The router to handle requests to the `/badges` endpoint.
 */
module.exports = (client) => {
  router.get("/", async (req, res) => {
    try {
      logger.info("Handling request for /badges route.");
      const db = client.db("BadgeFinder");
      const collection = db.collection("Badges");
      logger.info("About to execute database query.");
      const result = await collection.find({}).toArray();
      logger.info("Database query executed.");
      logger.info(`${result.length} badges found.`);
      res.send(result);
    } catch (err) {
      logger.info(`Error in /badges route: ${err}`);
      res.status(500).send("Error retrieving badges");
    }
  });

  return router;
};
