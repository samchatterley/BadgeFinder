require("dotenv").config();
const config = require("./config");
const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const session = require("express-session");
const morgan = require("morgan");
const winston = require("winston");
const csurf = require("csurf");
const cookieParser = require('cookie-parser');

/**
 * Set up the logger for the application.
 */
const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: {
        service: "user-service",
    },
    transports: [
        new winston.transports.File({
            filename: "error.log",
            level: "error",
        }),
        new winston.transports.File({
            filename: "combined.log",
        }),
    ],
});

/**
 * Add console log transport for non-production environments.
 */
if (config.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

console.log("Loading route handlers...");

/**
 * Import all route handlers.
 */
const authRoutes = require("./Routes/authRoute");
const userRoutes = require("./Routes/userRoute");
const badgesRouter = require("./Routes/all_badges");
const requirementsRouter = require("./Routes/requirements_by_id");
const badgeByRequirementRouter = require("./Routes/badge_by_requirement");
const badgeByNameRouter = require("./Routes/badge_by_name");
const badgeByCategoryRouter = require("./Routes/badge_by_categories");

console.log("Route handlers loaded.");

console.log("Loading user service model...");

/**
 * Import the user service model.
 */
const { UserService } = require("./Models/UserService");

console.log("User service model loaded.");

/**
 * Set up the express application.
 */
const app = express();
const port = config.PORT ?? 5000;

/**
 * Ensure the session secret environment variable is set.
 */
if (!config.SESSION_SECRET) {
    throw new Error("SESSION_SECRET environment variable is not set");
}

/**
 * Set up middleware.
 */
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
app.use(express.json());
app.use(
    session({
        secret: config.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: config.NODE_ENV === "production",
            sameSite: config.NODE_ENV === "development" ? "none" : "lax", // the cookie will be sent in all contexts when NODE_ENV=development and in first-party context when NODE_ENV!=development
        },
    })
);
app.use(cookieParser())
app.use(csurf({ cookie: true }));
app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});

app.use(
    morgan("combined", {
        stream: { write: (message) => logger.info(message.trim()) },
    })
);

/**
 * MongoDB client configuration and instantiation of the user service.
 */
const uri = config.MONGODB_URI;
const client = new MongoClient(uri, { useUnifiedTopology: true });
let userService;

/**
 * This function connects to the MongoDB instance and sets up the express application.
 */
async function connectDB() {
try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    await client.db("admin").command({
        ping: 1,
    });
    logger.info("Ping successful. Connected to BadgeFinder database.");
    userService = new UserService(client);
    app.use(async (req, next) => {
        req.client = client;
        req.userService = userService;
        next();
    });

    console.log("Setting up routes...");
    app.use("/auth", authRoutes(userService));
    app.use("/user", userRoutes(userService));
    app.use("/badges", badgesRouter);
    app.use("/requirements", requirementsRouter);
    app.use("/badges/requirements", badgeByRequirementRouter);
    app.use("/badges/search", badgeByNameRouter);
    app.use("/badges/category", badgeByCategoryRouter);
    console.log("Routes set up.");

    /**
     * Error handling middleware.
     */
    app.use((err, req, res, next) => {
        console.log("Error occurred:", err);
        logger.error(err.stack);
        res
            .status(500)
            .send(
                config.NODE_ENV === "production"
                    ? "Something broke!"
                    : err.message
            );
        next();
    });

    console.log(`Starting server on port ${port}...`);
    app.listen(port, () => {
        logger.info(`Server is running on port: ${port}`);
        console.log(`Server is running on port: ${port}`);
    });

} catch (err) {
    console.log("Error during setup:", err);
    logger.error(err);
    }
}

/**
 * Connect to the MongoDB instance.
 */
(async () => {
try {
    console.log("Starting setup...");
    await connectDB();
    console.log("Setup finished.");
} catch (err) {
    console.log("Error during setup:", err);
    logger.error(err);
    }
})();

/**
 * Close the MongoDB connection on process termination.
 */
process.on("SIGINT", async () => {
try {
    console.log("Closing MongoDB connection...");
    await client.close();
    logger.info("MongoDB connection closed");
    console.log("MongoDB connection closed");
    process.exit(0);
} catch (err) {
    console.log("Error while closing MongoDB connection:", err);
    logger.error(err);
    process.exit(1);
    }
});