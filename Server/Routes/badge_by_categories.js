require("dotenv").config();
const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");
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

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useUnifiedTopology: true });

router.use(limiter);

/**
 * GET /
 * This endpoint returns badges based on the 'categories' query parameter.
 * It connects to the MongoDB instance, queries the 'Badges' collection for badges with the given category,
 * and returns the matching badges.
 * If no badges are found, it sends a 404 status and an error message.
 * If there's an internal server error, it sends a 500 status and an error message.
 */
router.get("/", async (req, res) => {
  try {
    logger.info("Request received for badge search by category");
    await client.connect();
    const db = client.db("BadgeFinder");
    const collection = db.collection("Badges");
    const category = req.query.categories;
    logger.info("Searching for badges in category:", category);
    const badges = await collection.find({ categories: { $regex: `.*\\b${category}\\b.*`, $options: 'i' } }).toArray();
    if (badges && badges.length > 0) {
      logger.info(`${badges.length} badges found.`, badges);
      res.status(200).json(badges);
    } else {
      logger.info("No badges found in this category");
      res.status(404).send("No badges found in this category");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
