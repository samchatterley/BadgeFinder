require('dotenv').config()
const express = require('express')
const router = express.Router()
const { logger } = require('../logger')
const rateLimit = require('express-rate-limit')

/**
 * Set up a rate limiter to limit requests to the API.
 * This limiter allows a maximum of 100 requests per 15 minutes.
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})

router.use(limiter)

/**
 * GET /
 * This endpoint returns requirements based on the 'badge_id' query parameter.
 * It connects to the MongoDB instance, queries the 'Requirements' collection for requirements with the given badge ID,
 * and returns the matching requirements.
 * If there's an internal server error, it sends a 500 status and an error message.
 */
router.get('/', async (req, res) => {
  const badgeId = req.query.badge_id
  try {
    logger.info('Attempting to handle GET request for requirements...')
    const db = req.client.db('BadgeFinder') // Here, req.client is the client you passed from the index.js file
    const collection = db.collection('Requirements')
    logger.info(`Fetching requirements for badge ID: ${badgeId}`)
    const result = await collection
      .find({ badge_id: parseInt(badgeId, 10) })
      .toArray()
    logger.info(
      `${result.length} requirements found for badge ID: ${badgeId}`,
      result
    )
    res.send(result)
  } catch (err) {
    logger.error(
      `Error occurred while fetching requirements for badge ID: ${badgeId}`,
      err
    )
    res.status(500).send('Error retrieving requirements')
  }
})

module.exports = router
