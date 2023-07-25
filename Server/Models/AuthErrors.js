/**
 * Custom AuthError class that extends built-in Error class.
 * This acts as a base class for other authentication-specific errors.
 * @class
 * @extends {Error}
 */
class AuthError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

// Each class below extends AuthError to create specific types of AuthErrors.

/** Error when user's credentials are incorrect. */
class InvalidCredentialsError extends AuthError {
    constructor() {
        super("Invalid credentials");
        this.name = this.constructor.name;
    }
}

/** Error when user is not authorized. */
class AuthorizationError extends AuthError {
    constructor() {
        super("User is not authorized");
        this.name = this.constructor.name;
    }
}

/** Error when the token provided by the user is missing. */
class MissingTokenError extends AuthError {
    constructor() {
        super("Token is missing");
        this.name = this.constructor.name;
    }
}

/** Error when the token provided by the user is expired. */
class ExpiredTokenError extends AuthError {
    constructor() {
        super("Token is expired");
        this.name = this.constructor.name;
    }
}

/** Error when the token provided by the user is invalid. */
class InvalidTokenError extends AuthError {
    constructor() {
        super("Token is invalid");
        this.name = this.constructor.name;
    }
}

/** Error when there is an unexpected server error. */
class ServerError extends AuthError {
    constructor() {
        super("Unexpected server error");
        this.name = this.constructor.name;
    }
}

// Exporting all the error classes so they can be used in other parts of the application
module.exports = {
    AuthError,
    InvalidCredentialsError,
    AuthorizationError,
    MissingTokenError,
    ExpiredTokenError,
    InvalidTokenError,
    ServerError
};