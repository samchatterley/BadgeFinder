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
 * This endpoint returns badges based on the 'query' query parameter.
 * It connects to the MongoDB instance, queries the 'Requirements' collection for requirements matching the query,
 * then queries the 'Badges' collection for badges with the matching requirements.
 * It returns the matching badges.
 * If there's an internal server error, it sends a 500 status and an error message.
 */
router.get("/", async (req, res) => {
  try {
    logger.info("Request received for badge search by requirement");
    await client.connect();
    const db = client.db("BadgeFinder");
    const badges = db.collection("Badges");
    const requirements = db.collection("Requirements");

    const query = req.query.query;

    logger.info("Searching for badges with requirement: ", query);

    const matchingRequirements = await requirements.find({
      requirement_string: { $regex: `.*${query}.*`, $options: 'i' }
    }).toArray();

    const matchingBadgeIds = new Set(matchingRequirements.map((r) => r.badge_id));

    const matchingBadges = await badges.find({ ID: { $in: Array.from(matchingBadgeIds) } }).toArray();

    logger.info(`${badges.length} matching badges found:`, matchingBadges);

    res.status(200).json(matchingBadges);
  } catch (err) {
    logger.error(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
