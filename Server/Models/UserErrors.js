/**
 * Custom UserError class that extends built-in Error class.
 * This acts as a base class for other user-specific errors.
 * @class
 * @extends {Error}
 */
class UserError extends Error {
  constructor (message) {
    super(message)
    this.name = this.constructor.name
  }
}

// Each class below extends UserError to create specific types of UserErrors.

/** Error when a user is not found. */
class UserNotFoundError extends UserError {}

/** Error when a badge is not found. */
class BadgeNotFoundError extends UserError {}

/** Error when a user already has a certain badge. */
class AlreadyHasBadgeError extends UserError {}

/** Error when a user does not have a certain badge. */
class DoesNotHaveBadgeError extends UserError {}

/** Error when a requirement is not found. */
class RequirementNotFoundError extends UserError {}

/** Error when the first name provided is invalid. */
class InvalidFirstNameError extends UserError {
  constructor () {
    super('firstName must be a non-empty string')
    this.name = this.constructor.name
  }
}

/** Error when the last name provided is invalid. */
class InvalidLastNameError extends UserError {
  constructor () {
    super('lastName must be a non-empty string')
    this.name = this.constructor.name
  }
}

/** Error when the email provided is invalid. */
class InvalidEmailError extends UserError {
  constructor () {
    super('email must be a valid email address')
    this.name = this.constructor.name
  }
}

/** Error when the membership number provided is invalid. */
class InvalidMembershipNumberError extends UserError {
  constructor () {
    super('membershipNumber must be a non-empty string')
    this.name = this.constructor.name
  }
}

/** Error when the username provided is invalid. */
class InvalidUsernameError extends UserError {
  constructor () {
    super('username must be a non-empty string')
    this.name = this.constructor.name
  }
}

/** Error when the badges provided are invalid. */
class InvalidBadgesError extends UserError {
  constructor () {
    super('badges must be an array')
    this.name = this.constructor.name
  }
}

/** Error when the earned badges provided are invalid. */
class InvalidEarnedBadgesError extends UserError {
  constructor () {
    super('earned_badges must be an array')
    this.name = this.constructor.name
  }
}

/** Error when the required badges provided are invalid. */
class InvalidRequiredBadgesError extends UserError {
  constructor () {
    super('required_badges must be an array')
    this.name = this.constructor.name
  }
}

/** Error when the password provided is invalid. */
class InvalidPasswordError extends UserError {
  constructor () {
    super('password must be a string of at least 8 characters')
    this.name = this.constructor.name
  }
}

/** Error when the username provided already exists. */
class DuplicateUsernameError extends Error {
  constructor (message = 'username already exists') {
    super(message)
    this.name = 'DuplicateUsernameError'
  }
}

/** Error when the completion status is invalid. */
class InvalidCompletionStatusError extends UserError {
  constructor () {
    super('Completed is required')
    this.name = this.constructor.name
  }
}

// Exporting all the error classes so they can be used in other parts of the application
module.exports = {
  UserError,
  UserNotFoundError,
  BadgeNotFoundError,
  AlreadyHasBadgeError,
  DoesNotHaveBadgeError,
  RequirementNotFoundError,
  InvalidBadgesError,
  InvalidFirstNameError,
  InvalidLastNameError,
  InvalidEmailError,
  InvalidMembershipNumberError,
  InvalidUsernameError,
  InvalidEarnedBadgesError,
  InvalidRequiredBadgesError,
  InvalidPasswordError,
  InvalidCompletionStatusError,
  DuplicateUsernameError
}
