require('dotenv').config()
const { MongoClient } = require('mongodb')
const { MongoMemoryServer } = require('mongodb-memory-server-global')
const { UserService } = require('../../Models/UserService')
const User = require('../../Models/UserClass')
const express = require('express')
const logger = require('winston')
const cors = require('cors')
const session = require('express-session')
const morgan = require('morgan')
const csurf = require('csurf')

describe('Testing User Service Methods', () => {
  let userService
  let mongoClient
  let mongoServer
  let mockUser
  let mockBadge
  let mockBadgeRequirement
  const app = express()

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    mongoClient = new MongoClient(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    await mongoClient.connect()

    userService = new UserService(mongoClient, User)

    app.use(cors())
    app.use(express.json())
    app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
          secure: process.env.NODE_ENV === 'production'
        }
      })
    )

    app.use(csurf())
    app.use(
      morgan('combined', {
        stream: { write: (message) => logger.info(message.trim()) }
      })
    )

    app.use(
      morgan('combined', {
        stream: {
          write: (message) => logger.info(message.trim())
        }
      })
    )

    app.use(async (req, res, next) => {
      req.client = mongoClient
      req.User = userService
      next()
    })

    const authRoutes = require('../../Routes/authRoute')(User)
    const userRoutes = require('../../Routes/userRoute')(User)
    app.use('/auth', authRoutes)
    app.use('/user', userRoutes)

    app.use((err, res) => {
      logger.error(err.stack)
      res.status(500).send('Something broke!')
    })

    mockUser = {
      _id: '1234',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      membershipNumber: '5678',
      badges: [],
      earned_badges: [],
      password: 'password123',
      required_badges: [],
      username: 'johndoe'
    }

    mockBadge = {
      _id: '64527a53b431de7e0e8b1a1e',
      badge_name: 'Activity Centre Service ',
      badge_id: 1,
      imageUrl:
        'https://res.cloudinary.com/dqfvzo7jo/image/upload/activity-sc-activitycenterservice_fw6nnd.jpg',
      categories: 'Activity Badges, At Camp, Community Impact'
    }

    mockBadgeRequirement = {
      _id: '643fcd86eee6843daca02b1c',
      requirement_id: 4,
      badge_id: 1,
      requirement_string: 'The use of computers in campsite management'
    }
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    jest.clearAllMocks()

    jest
      .spyOn(userService, 'findUserByQuery')
      .mockImplementation(() => Promise.resolve(mockUser))
    jest
      .spyOn(userService, 'findOne')
      .mockImplementation(() => Promise.resolve(mockUser))
    jest
      .spyOn(userService, 'findById')
      .mockImplementation(() => Promise.resolve(mockUser))
    jest
      .spyOn(userService, 'findByEmail')
      .mockImplementation(() => Promise.resolve(mockUser))
    jest
      .spyOn(userService, 'create')
      .mockImplementation(() => Promise.resolve(mockUser._id))
    jest
      .spyOn(userService, 'update')
      .mockImplementation(() => Promise.resolve({ firstName: 'Jane' }))
    jest
      .spyOn(userService, 'findOneAndUpdate')
      .mockImplementation(() => Promise.resolve(mockUser))
    jest
      .spyOn(userService, 'deleteById')
      .mockImplementation(() => Promise.resolve({ deletedCount: 1 }))
    jest
      .spyOn(userService, 'findOneAndUpdateWithOperations')
      .mockImplementation(() => Promise.resolve(mockUser))
    jest
      .spyOn(userService, 'registerUser')
      .mockImplementation(() => Promise.resolve(mockUser))
    jest
      .spyOn(userService, 'registerSecondaryUser')
      .mockImplementation(() => Promise.resolve(mockUser))
    jest
      .spyOn(userService, 'authenticateUser')
      .mockImplementation(() => Promise.resolve(mockUser))
    jest
      .spyOn(userService, 'addBadge')
      .mockImplementation(() => Promise.resolve(mockUser))
    jest
      .spyOn(userService, 'removeBadge')
      .mockImplementation(() => Promise.resolve(mockUser))
    jest
      .spyOn(userService, 'updateBadgeRequirement')
      .mockImplementation(() => Promise.resolve(mockUser))
  })

  afterAll(async () => {
    await mongoClient.close()
    await mongoServer.stop()
  })

  describe('UserService Method Tests', () => {
    it('Should create a new user object', () => {
      const userObject = userService.createUserObject(mockUser)
      const expectedUser = {
        _id: mockUser._id,
        _firstName: mockUser.firstName,
        _lastName: mockUser.lastName,
        _email: mockUser.email,
        _membershipNumber: mockUser.membershipNumber,
        _badges: mockUser.badges,
        _earned_badges: mockUser.earned_badges,
        _required_badges: mockUser.required_badges,
        _username: mockUser.username
      }

      expect(userObject).toBeInstanceOf(Object)
      expect(userObject).toMatchObject(expectedUser)
    })

    it('findUserByQuery - Should find a user by query', () => {
      const query = { firstName: 'Sam' }
      const user = userService.findUserByQuery(query)

      expect(user).resolves.toBeInstanceOf(Object)
      expect(user).resolves.toMatchObject(mockUser)
    })

    it('findOne - Should find a user by id', () => {
      const user = userService.findOne(mockUser._id)

      expect(user).resolves.toBeInstanceOf(Object)
      expect(user).resolves.toMatchObject(mockUser)
    })

    it('findById - Should find a user by id', () => {
      const user = userService.findById(mockUser._id)

      expect(user).resolves.toBeInstanceOf(Object)
      expect(user).resolves.toMatchObject(mockUser)
    })

    it('findByEmail - Should find a user by email', () => {
      const user = userService.findByEmail(mockUser.email)

      expect(user).resolves.toBeInstanceOf(Object)
      expect(user).resolves.toMatchObject(mockUser)
    })

    it('create - Should create a new user', () => {
      const user = userService.create(mockUser)

      expect(user).resolves.toBe(mockUser._id)
    })

    it('update - Should update a user', () => {
      const user = userService.update(mockUser._id, { firstName: 'Jane' })

      expect(user).resolves.toMatchObject({ firstName: 'Jane' })
    })

    it('findOneAndUpdate - Should find and update a user', () => {
      const user = userService.findOneAndUpdate(mockUser._id, {
        firstName: 'Jane'
      })

      expect(user).resolves.toBeInstanceOf(Object)
      expect(user).resolves.toMatchObject(mockUser)
    })

    it('deleteById - Should delete a user by id', () => {
      const user = userService.deleteById(mockUser._id)

      expect(user).resolves.toMatchObject({ deletedCount: 1 })
    })

    it('findOneAndUpdateWithOperations - Should find and update a user with operations', () => {
      const operations = { $set: { firstName: 'Jane' } }
      const user = userService.findOneAndUpdateWithOperations(
        mockUser._id,
        operations
      )

      expect(user).resolves.toBeInstanceOf(Object)
      expect(user).resolves.toMatchObject(mockUser)
    })

    it('registerUser - Should register a new user', () => {
      const user = userService.registerUser(mockUser)

      expect(user).resolves.toBeInstanceOf(Object)
      expect(user).resolves.toMatchObject(mockUser)
    })

    it('registerSecondaryUser - Should register a new secondary user', () => {
      const user = userService.registerSecondaryUser(mockUser)

      expect(user).resolves.toBeInstanceOf(Object)
      expect(user).resolves.toMatchObject(mockUser)
    })

    it('authenticateUser - Should authenticate a user', () => {
      const user = userService.authenticateUser(mockUser)

      expect(user).resolves.toBeInstanceOf(Object)
      expect(user).resolves.toMatchObject(mockUser)
    })

    it('addBadge - Should add a badge to a user', () => {
      const updatedUser = { ...mockUser, badges: [mockBadge._id] }
      userService.addBadge.mockReturnValueOnce(Promise.resolve(updatedUser))

      const user = userService.addBadge(mockUser._id, mockBadge)

      expect(user).resolves.toBeInstanceOf(Object)
      expect(user).resolves.toHaveProperty('badges', [mockBadge._id])
    })

    it('removeBadge - Should remove a badge from a user', () => {
      const updatedUser = { ...mockUser }
      userService.removeBadge.mockReturnValueOnce(Promise.resolve(updatedUser))

      const user = userService.removeBadge(mockUser._id, mockBadge)

      expect(user).resolves.toBeInstanceOf(Object)
      expect(user).resolves.toHaveProperty('badges', [])
    })

    it('updateBadgeRequirement - Should update a badge requirement for a user', () => {
      const updatedUser = {
        ...mockUser,
        required_badges: [mockBadgeRequirement._id]
      }
      userService.updateBadgeRequirement.mockReturnValueOnce(
        Promise.resolve(updatedUser)
      )

      const user = userService.updateBadgeRequirement(mockUser._id, mockBadge)

      expect(user).resolves.toBeInstanceOf(Object)
      expect(user).resolves.toHaveProperty('required_badges', [
        mockBadgeRequirement._id
      ])
    })
  })
})
