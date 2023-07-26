const Joi = require('@hapi/joi')
const {
  BadgeNotFoundError,
  InvalidFirstNameError,
  InvalidLastNameError,
  InvalidEmailError,
  InvalidMembershipNumberError,
  InvalidUsernameError,
  InvalidEarnedBadgesError,
  InvalidRequiredBadgesError,
  InvalidPasswordError,
  UserNotFoundError,
  RequirementNotFoundError
} = require('./UserErrors')

/**
 * Validation schema for the `findOne` method.
 * It requires an `_id`, `firstName`, `lastName`, `email`, `membershipNumber`, and `badges` fields.
 * The `_id` field must be a 24 character long string containing hexadecimal characters.
 * The `firstName`, `lastName`, `email`, and `membershipNumber` fields must be strings.
 * The `badges` field must be an array of strings.
 */
exports.findOneSchema = Joi.object({
  _id: Joi.string()
    .length(24)
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .error(() => new UserNotFoundError()),
  firstName: Joi.string()
    .required()
    .error(() => new InvalidFirstNameError()),
  lastName: Joi.string()
    .required()
    .error(() => new InvalidLastNameError()),
  email: Joi.string()
    .email()
    .required()
    .error(() => new InvalidEmailError()),
  membershipNumber: Joi.string()
    .required()
    .error(() => new InvalidMembershipNumberError()),
  badges: Joi.array().items(Joi.string().error(() => new BadgeNotFoundError())),
  earned_badges: Joi.array()
    .required()
    .error(() => new InvalidEarnedBadgesError()),
  required_badges: Joi.array()
    .required()
    .error(() => new InvalidRequiredBadgesError()),
  username: Joi.string()
    .required()
    .error(() => new InvalidUsernameError())
}).unknown(true)

/**
 * Validation schema for the "findById" method.
 * It requires an `_id` which must be a 24 character long string containing hexadecimal characters.
 */
exports.findByIdSchema = Joi.object({
  _id: Joi.string()
    .length(24)
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .error(new UserNotFoundError())
})

/**
 * Validation schema for the "findByEmail" method.
 * It requires an `email` which must be a valid email address.
 */
exports.findByEmailSchema = Joi.object({
  email: Joi.string().email().required().error(new InvalidEmailError())
})

/**
 * Validation schema for the "create" method.
 * It requires a `firstName`, `lastName`, `email`, and `membershipNumber` fields.
 * The `firstName`, `lastName`, `email`, and `membershipNumber` fields must be strings.
 */
exports.createSchema = Joi.object({
  firstName: Joi.string()
    .required()
    .error(() => new InvalidFirstNameError()),
  lastName: Joi.string()
    .required()
    .error(() => new InvalidLastNameError()),
  email: Joi.string()
    .email()
    .required()
    .error(() => new InvalidEmailError()),
  membershipNumber: Joi.string()
    .required()
    .error(() => new InvalidMembershipNumberError())
})

/**
 * Validation schema for the "update" method of the `UserService` class.
 * It ensures that the user data to be updated is in the correct format.
 */
exports.updateSchema = Joi.object({
  _id: Joi.string()
    .length(24)
    .regex(/^[0-9a-fA-F]{24}$/)
    .error(() => new UserNotFoundError()),
  firstName: Joi.string().error(() => new InvalidFirstNameError()),
  lastName: Joi.string().error(() => new InvalidLastNameError()),
  email: Joi.string()
    .email()
    .error(() => new InvalidEmailError()),
  membershipNumber: Joi.string().error(
    () => new InvalidMembershipNumberError()
  ),
  badges: Joi.array().items(Joi.string().error(() => new BadgeNotFoundError())),
  earned_badges: Joi.array()
    .items(Joi.string())
    .error(() => new InvalidEarnedBadgesError()),
  required_badges: Joi.array()
    .items(Joi.string())
    .error(() => new InvalidRequiredBadgesError()),
  username: Joi.string().error(() => new InvalidUsernameError())
}).unknown(false)

/**
 * Validation schema for the "findOneAndUpdate" method of the `UserService` class.
 * It ensures that the user data for the update operation is in the correct format.
 */
exports.findOneAndUpdateSchema = Joi.object({
  _id: Joi.string()
    .length(24)
    .regex(/^[0-9a-fA-F]{24}$/)
    .error(() => new UserNotFoundError()),
  firstName: Joi.string().error(() => new InvalidFirstNameError()),
  lastName: Joi.string().error(() => new InvalidLastNameError()),
  email: Joi.string()
    .email()
    .error(() => new InvalidEmailError()),
  membershipNumber: Joi.string().error(
    () => new InvalidMembershipNumberError()
  ),
  badges: Joi.array().items(Joi.string().error(() => new BadgeNotFoundError())),
  earned_badges: Joi.array()
    .items(Joi.string())
    .error(() => new InvalidEarnedBadgesError()),
  required_badges: Joi.array()
    .items(Joi.string())
    .error(() => new InvalidRequiredBadgesError()),
  username: Joi.string().error(() => new InvalidUsernameError())
}).unknown(false)

/**
 * Validation schema for the "deleteById" method of the `UserService` class.
 * It ensures that the provided ID is in the correct format.
 */
exports.deleteByIdSchema = Joi.object({
  _id: Joi.string()
    .length(24)
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .error(() => new UserNotFoundError())
})

/**
 * Validation schema for the "findOneAndUpdateWithOperations" method of the `UserService` class.
 * It ensures that the user data and operations for the update operation are in the correct format.
 */
exports.findOneAndUpdateWithOperationsSchema = Joi.object({
  _id: Joi.string()
    .length(24)
    .regex(/^[0-9a-fA-F]{24}$/)
    .error(() => new UserNotFoundError()),
  operations: Joi.object({
    $set: Joi.object().pattern(
      Joi.string(),
      Joi.alternatives().try(
        Joi.string(),
        Joi.number(),
        Joi.boolean(),
        Joi.array(),
        Joi.object()
      )
    ),
    $push: Joi.object().pattern(
      Joi.string(),
      Joi.alternatives().try(
        Joi.string(),
        Joi.number(),
        Joi.boolean(),
        Joi.array(),
        Joi.object()
      )
    ),
    $inc: Joi.object().pattern(Joi.string(), Joi.number()),
    $addToSet: Joi.object().pattern(
      Joi.string(),
      Joi.alternatives().try(
        Joi.string(),
        Joi.number(),
        Joi.boolean(),
        Joi.array(),
        Joi.object()
      )
    ),
    $pull: Joi.object().pattern(
      Joi.string(),
      Joi.alternatives().try(
        Joi.string(),
        Joi.number(),
        Joi.boolean(),
        Joi.array(),
        Joi.object()
      )
    )
  }).unknown(true)
}).unknown(true)

/**
 * Validation schema for the "registerUser" method of the `UserService` class.
 * It ensures that the user data for the registration is in the correct format.
 */
exports.registerUserSchema = Joi.object({
  firstName: Joi.string().required().error(new InvalidFirstNameError()),
  lastName: Joi.string().required().error(new InvalidLastNameError()),
  email: Joi.string().email().required().error(new InvalidEmailError()),
  membershipNumber: Joi.string()
    .required()
    .error(new InvalidMembershipNumberError())
})

/**
 * Validation schema for the "registerSecondaryUser" method of the `UserService` class.
 * It ensures that the user data for the secondary registration is in the correct format.
 */
exports.registerSecondaryUserSchema = Joi.object({
  _id: Joi.string()
    .length(24)
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .error(new UserNotFoundError()),
  username: Joi.string().required().error(new InvalidUsernameError()),
  password: Joi.string().required().error(new InvalidPasswordError()),
  earned_badges: Joi.array()
    .items(Joi.string())
    .required()
    .error(new InvalidEarnedBadgesError()),
  required_badges: Joi.array()
    .items(Joi.string())
    .required()
    .error(new InvalidRequiredBadgesError())
})

/**
 * Validation schema for the "authenticateUser" method of the `UserService` class.
 * It ensures that the user data for the authentication operation is in the correct format.
 */
exports.authenticateUserSchema = Joi.object({
  username: Joi.string().required().error(new InvalidUsernameError()),
  password: Joi.string().required().error(new InvalidPasswordError())
})

/**
 * Validation schema for the "addBadge" method of the `UserService` class.
 * It ensures that the user ID and badge ID for the badge addition operation are in the correct format.
 */
exports.addBadgeSchema = Joi.object({
  userId: Joi.string()
    .length(24)
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .error(new UserNotFoundError()),
  badgeId: Joi.string()
    .length(24)
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .error(new BadgeNotFoundError())
})

/**
 * Validation schema for the "removeBadge" method of the `UserService` class.
 * It ensures that the user ID and badge ID for the badge removal operation are in the correct format.
 */
exports.removeBadgeSchema = Joi.object({
  userId: Joi.string()
    .length(24)
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .error(new UserNotFoundError()),
  badgeId: Joi.string()
    .length(24)
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .error(new BadgeNotFoundError())
})

/**
 * Validation schema for the "updateBadgeRequirement" method of the `UserService` class.
 * It ensures that the badge ID and requirement ID for the badge requirement update operation are in the correct format.
 */
exports.updateBadgeRequirementSchema = Joi.object({
  badgeId: Joi.string()
    .length(24)
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .error(new BadgeNotFoundError()),
  requirementId: Joi.string()
    .length(24)
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .error(new RequirementNotFoundError())
})
