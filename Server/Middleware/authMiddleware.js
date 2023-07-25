require('dotenv').config();
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const AuthError = require("../Models/AuthErrors");
const User = require("../Models/UserClass");
const { logger } = require("../logger");

/**
 * Middleware to protect routes. Verifies JWT from the Authorization header and
 * attaches the authenticated user to the request object.
 * 
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new AuthError.MissingTokenError("Not authorized to access this route", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        logger.info(decoded);
        req.user = await User.findById(decoded.id);
        if (!req.user) {
            throw new AuthError.InvalidTokenError(`User with id ${decoded.id} not found`, 404);
        }

        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return next(new AuthError.ExpiredTokenError("Token is expired", 401));
        } else if (err instanceof jwt.JsonWebTokenError) {
            return next(new AuthError.InvalidTokenError("Token is invalid", 401));
        } else {
            return next(new AuthError.ServerError("Unexpected server error", 500));
        }
    }
});

/**
 * Middleware to set the current user. Verifies JWT from cookies and
 * attaches the authenticated user to res.locals.
 * 
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
exports.setCurrentUser = asyncHandler(async (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                logger.info(err.message);
                res.locals.user = null;
                next();
            } else {
                logger.info(decodedToken);
                const user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
});

/**
 * Middleware to check authentication. Verifies JWT from cookies and
 * sends an unauthorized error if it's not valid.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
                logger.info(err.message);
                res.status(401).json({ error: 'Unauthorized' });
            } else {
                logger.info(decodedToken);
                next();
            }
        });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};