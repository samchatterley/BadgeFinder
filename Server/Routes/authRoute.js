const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { logger } = require('../logger')
const {
  protect,
  setCurrentUser,
  requireAuth
} = require('../Middleware/authMiddleware')
const rateLimit = require('express-rate-limit')

/**
 * Set up a rate limiter to limit requests to the API.
 * This limiter allows a maximum of 100 requests per 15 minutes.
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})

/**
 * The router uses a user service object to handle requests.
 * It provides endpoints for user signup, secondary signup, signin, and getting user information.
 * It uses the rate limiter, auth middleware, and error handling middleware.
 *
 * @param {Object} User - The user service object to use for handling requests.
 * @returns {Object} The router to handle user requests.
 */
module.exports = (User) => {
  const userService = User
  router.use(limiter)
  router.use(protect, setCurrentUser, limiter)

  /**
   * POST /signup
   * This endpoint handles user signup requests.
   * It requires firstName, lastName, email, and membershipNumber in the request body.
   * It checks for validation errors, then tries to create a new user.
   */
  router.post(
    '/signup',
    limiter,
    [
      body('email').isEmail().withMessage('Email is required'),
      body('firstName').notEmpty().withMessage('First Name is required'),
      body('lastName').notEmpty().withMessage('Last Name is required'),
      body('membershipNumber')
        .notEmpty()
        .withMessage('Membership Number is required')
    ],
    asyncHandler(async (req, res) => {
      logger.info('Signup request received. Request body:', req.body)
      logger.info('Signup request received')

      if (
        !req.body.firstName ||
        !req.body.lastName ||
        !req.body.email ||
        !req.body.membershipNumber
      ) {
        logger.info('Signup request missing necessary fields')
        return res.status(400).json({
          message: 'Missing necessary fields'
        })
      }

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        logger.info('Signup request validation errors', errors.array())
        return res.status(400).json({
          errors: errors.array()
        })
      }

      const existingUser = await userService.findOne({
        email: req.body.email
      })
      if (existingUser) {
        logger.info('User with this email already exists')
        return res.status(409).json({
          message: 'User with this email already exists'
        })
      }

      const newUser = await userService.registerUser(req.body)
      if (!newUser) {
        logger.info('An error occurred while creating the user')
        return res.status(500).json({
          message: 'An error occurred while creating the user'
        })
      }
      logger.info('User created successfully')
      return res.status(200).json({
        message: 'User created successfully. Proceed to the second step',
        user: newUser
      })
    })
  )

  /**
   * POST /signup-secondary
   * This endpoint handles secondary signup requests.
   * It requires a valid user ID, a username, and a password in the request body.
   * It checks for validation errors, then tries to update the user with the given ID.
   */
  router.post(
    '/signup-secondary',
    limiter,
    [
      body('_id').notEmpty().withMessage('User ID is required'),
      body('username').notEmpty().withMessage('Username is required'),
      body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
    ],
    asyncHandler(async (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        logger.info(
          'Signup-secondary request validation errors',
          errors.array()
        )
        return res.status(400).json({
          errors: errors.array()
        })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(req.body.password, 10)

      const user = await userService.findById(req.body._id)
      if (!user) {
        logger.info('User with this id does not exist')
        return res.status(404).json({
          message: 'User with this id does not exist'
        })
      }

      if (user.username) {
        logger.info('User already completed the signup process')
        return res.status(409).json({
          message: 'User already completed the signup process'
        })
      }

      const earnedBadges = req.body.earnedBadges || []
      const requiredBadges = req.body.requiredBadges || []

      const badgesCollection = req.client
        .db('BadgeFinder')
        .collection('Badges')

      user.earned_badges = await badgesCollection
        .find({
          badge_id: {
            $in: earnedBadges
          }
        })
        .toArray()
      user.required_badges = await badgesCollection
        .find({
          badge_id: {
            $in: requiredBadges
          }
        })
        .toArray()

      const updatedUser = await userService.registerSecondaryUser({
        _id: user._id,
        username: req.body.username,
        password: hashedPassword, // Use hashed password here
        earned_badges: user.earned_badges,
        required_badges: user.required_badges
      })

      const token = jwt.sign(
        {
          userId: updatedUser._id,
          email: updatedUser.email
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h'
        }
      )

      logger.info('Signup-secondary completed successfully')
      res.status(200).json({
        token,
        user: updatedUser
      })
    })
  )

  /**
   * POST /signin
   * This endpoint handles user signin requests.
   * It requires a username and a password in the request body.
   * It checks for validation errors, then tries to authenticate the user with the given credentials.
   */
  router.post(
    '/signin',
    limiter,
    [
      body('username').notEmpty().withMessage('Username is required'),
      body('password').notEmpty().withMessage('Password is required')
    ],
    asyncHandler(async (req, res) => {
      logger.info('Signin request received. Request body:', req.body)
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        logger.info('Signin request validation errors', errors.array())
        return res.status(400).json({
          errors: errors.array()
        })
      }

      const user = await userService.findOne({
        username: req.body.username
      })
      if (!user) {
        logger.info('Invalid username or password')
        return res.status(404).json({
          error: 'Invalid username or password'
        })
      }

      const match = await bcrypt.compare(req.body.password, user.password)
      if (!match) {
        logger.info('Invalid username or password')
        return res.status(400).json({
          error: 'Invalid username or password'
        })
      }

      const updatedUserResult = await userService.findOneAndUpdate(
        {
          username: req.body.username
        },
        {
          lastLogin: new Date()
        },
        {
          returnOriginal: false
        }
      )

      if (!updatedUserResult) {
        logger.info("Failed to update user's last login time")
        return res.status(500).json({
          error: "Failed to update user's last login time"
        })
      }

      const updatedUser = updatedUserResult

      const token = jwt.sign(
        {
          userId: updatedUser.value._id.toString(),
          email: updatedUser.value.email,
          firstName: updatedUser.value.firstName,
          lastName: updatedUser.value.lastName
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h'
        }
      )

      logger.info('Signed JWT:', token)
      logger.info('Signin completed successfully')
      res.status(200).json({
        token,
        user: updatedUser.value
      })
    })
  )

  /**
   * GET /user/:userId
   * This endpoint gets information about a user with a given ID.
   * It requires authentication.
   * It tries to find a user with the given ID and sends the user information in the response.
   */
  router.get(
    '/user/:userId',
    limiter,
    protect,
    setCurrentUser,
    asyncHandler(async (req, res) => {
      logger.info('Get user request received. Request params:', req.params)
      const user = await userService.findById(req.params.userId)

      if (!user) {
        logger.info('User not found')
        return res.status(404).json({
          message: 'User not found'
        })
      }

      logger.info('User found successfully')
      res.status(200).json(user)
    })
  )

  return router
}
