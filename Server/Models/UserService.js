const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const {logger} = require("../logger");
const ValidationSchemas = require("./ValidationSchema");
const UserErrors = require("./UserErrors");

class UserService {
    /**
     * The constructor for the UserService class.
     * 
     * @param {object} client - The database client.
     * @param {object} UserClassReference - A reference to the User class.
     */
    constructor(client, UserClassReference) {
        this.client = client;
        this.UserClass = UserClassReference;
        this.usersDb = client.db("BadgeFinderUsers");
        this.badgesDb = client.db("BadgeFinder");
        this.usersCollection = this.usersDb.collection("Users");
        this.badgesCollection = this.badgesDb.collection("Badges");
        this.requirementsCollection = this.badgesDb.collection("Requirements");
    }

    /**
     * Create a new User object with the provided data.
     * 
     * @param {object} user - The user data.
     * @returns {object} A new User object.
     */
    createUserObject(user) {
        return new this.UserClass({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            membershipNumber: user.membershipNumber,
            badges: user.badges,
            earned_badges: user.earned_badges,
            required_badges: user.required_badges,
            username: user.username,
        });
    }

    /**
     * Takes a query and a validation schema, validates the query, and fetches a user based on the provided query.
     * If the user is found, it returns a User object; if not, it throws a `UserNotFoundError`.
     *
     * @param {Object} query - The query to use for searching the user.
     * @param {Object} schema - The schema to validate the query.
     * @returns {Promise<Object>} A promise that resolves to a User object.
     */
    async findUserByQuery(query, schema) {
        const { error } = schema.validate(query);
        if (error) {
            throw error;
        }
        const user = await this.usersCollection.findOne(query);
        if (!user) {
            throw new UserErrors.UserNotFoundError("User not found");
        }
        return this.createUserObject(user);
    }

    /**
     * Logs the query and calls `findUserByQuery` with the `findOneSchema`.
     *
     * @param {Object} query - The query to use for searching the user.
     * @returns {Promise<Object>} A promise that resolves to a User object.
     */
    async findOne(query) {
        const user = await this.collection.findOne(query);
        logger.info(`Searching for user with query ${JSON.stringify(query)}`);
        return this.findUserByQuery(query, ValidationSchemas.findOneSchema);
    }

    /**
     * Logs the ID and calls `findUserByQuery` with the `findByIdSchema`.
     *
     * @param {string} _id - The ID of the user to find.
     * @returns {Promise<Object>} A promise that resolves to a User object.
     */
    async findById(_id) {
        const user = await this.collection.findOne({_id: new mongodb.ObjectID(_id)});
        logger.info(`Searching for user with id ${_id}`);
        return this.findUserByQuery({ _id: new ObjectId(_id) }, ValidationSchemas.findByIdSchema);
    }

    /**
     * Logs the email and calls `findUserByQuery` with the `findByEmailSchema`.
     *
     * @param {string} email - The email of the user to find.
     * @returns {Promise<Object>} A promise that resolves to a User object.
     */
    async findByEmail(email) {
        logger.info(`Searching for user with email ${email}`);
        return this.findUserByQuery({ email }, ValidationSchemas.findByEmailSchema);
    }

    /**
     * Validates the provided data against the `createSchema`, inserts a new document into the `usersCollection`,
     * and returns the inserted ID.
     *
     * @param {Object} data - The data to create a new user.
     * @returns {Promise<string>} A promise that resolves to the inserted ID.
     */
    async create(data) {
        const { error } = ValidationSchemas.createSchema.validate(data);
        if (error) {
            throw error;
        }
        const result = await this.usersCollection.insertOne(data);
        return result.insertedId;
    }

    /**
     * Validates the provided query and update data against the `updateSchema`,
     * updates a user document matching the query with the provided update data,
     * and throws appropriate errors if no document was found or if no changes were made.
     *
     * @param {Object} query - The query to find the user to update.
     * @param {Object} updateData - The data to update in the user document.
     * @returns {Promise<void>} A promise that resolves when the update operation is complete.
     */
    async update(query, updateData) {
        const { error } = ValidationSchemas.updateSchema.validate({ ...query, ...updateData });
        if (error) {
            throw error;
        }
        const result = await this.usersCollection.updateOne(query, { $set: updateData });
        if (result.matchedCount === 0) {
            throw new UserErrors.UserNotFoundError("User not found");
        }
        if (result.modifiedCount === 0) {
            throw new Error("No changes made to the user");
        }
    }
      
    /**
     * Validates the provided query and update data against the `findOneAndUpdateSchema`,
     * updates a user document matching the query with the provided update data, and returns the updated User object.
     *
     * @param {Object} query - The query to find the user to update.
     * @param {Object} updateData - The data to update in the user document.
     * @returns {Promise<Object>} A promise that resolves to the updated User object.
     */
    async findOneAndUpdate(query, updateData) {
        const { error } = ValidationSchemas.findOneAndUpdateSchema.validate({ ...query, ...updateData });
        if (error) {
            throw error;
        }
        const options = { returnOriginal: false, new: true };
        const result = await this.usersCollection.findOneAndUpdate(query, { $set: updateData }, options);
        return this.createUserObject(result.value);
    }

    /**
     * Validates the provided ID against the `deleteByIdSchema`, deletes the user document matching the provided ID,
     * and throws a `UserNotFoundError` if no document was found.
     *
     * @param {string} _id - The ID of the user to delete.
     * @returns {Promise<void>} A promise that resolves when the delete operation is complete.
     */
    async deleteById(_id) {
        const { error } = ValidationSchemas.deleteByIdSchema.validate({ _id });
        if (error) {
            throw error;
        }
        const result = await this.usersCollection.deleteOne({ _id: new ObjectId(_id) });
        if (result.deletedCount === 0) {
            throw new UserErrors.UserNotFoundError("User not found");
        }
    }

    /**
     * Validates the provided query and operations against the `findOneAndUpdateWithOperationsSchema`,
     * updates a user document matching the query with the provided operations, and returns the updated User object.
     *
     * @param {Object} query - The query to find the user to update.
     * @param {Object} operations - The operations to apply to the user document.
     * @param {Object} options - The options to apply to the findOneAndUpdate method.
     * @returns {Promise<Object>} A promise that resolves to the updated User object.
     */
    async findOneAndUpdateWithOperations(query, operations, options) {
        const { error } = ValidationSchemas.findOneAndUpdateWithOperationsSchema.validate({ _id: query._id, operations });
        if (error) {
            throw error;
        }
        const result = await this.usersCollection.findOneAndUpdate(query, operations, options);
        return this.createUserObject(result.value);
    }

    /**
     * Validates the provided data against the `registerUserSchema`, creates a new user with the provided data,
     * and returns the newly created User object.
     *
     * @param {Object} data - The data to create a new user.
     * @returns {Promise<Object>} A promise that resolves to the newly created User object.
     */
    async registerUser({ firstName, lastName, email, membershipNumber }) {
        const { error } = ValidationSchemas.registerUserSchema.validate({ firstName, lastName, email, membershipNumber });
        if (error) {
            throw error;
        }
        const newUser = await this.create({ firstName, lastName, email, membershipNumber, badges: [] });
        return this.findById(newUser);
    }

    /**
     * Validates the provided data against the `registerSecondaryUserSchema`,
     * updates the user document matching the provided ID with the provided data (including a hashed password),
     * and returns the updated User object.
     *
     * @param {Object} data - The data to update the user.
     * @returns {Promise<Object>} A promise that resolves to the updated User object.
     */
    async registerSecondaryUser({ _id, username, password, earned_badges, required_badges }) {
        const { error } = ValidationSchemas.registerSecondaryUserSchema.validate({ _id, username, password, earned_badges, required_badges });
        if (error) {
            throw error;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const options = { returnOriginal: false };
        const result = await this.usersCollection.findOneAndUpdate({ _id: new ObjectId(_id) }, {
            $set: {
                username,
                password: hashedPassword,
                earned_badges,
                required_badges
            }
        }, options);
        if (!result.value) {
            throw new UserErrors.UserNotFoundError("User not found");
        }
        return this.createUserObject(result.value);
    }

    /**
     * Validates the provided data against the `authenticateUserSchema`,
     * checks the provided password against the stored hashed password,
     * and returns the User object if the passwords match or throws an `InvalidPasswordError` if they don"t.
     *
     * @param {Object} data - The data to authenticate the user.
     * @returns {Promise<Object>} A promise that resolves to the User object if the passwords match.
     */
    async authenticateUser({ username, password }) {
        const { error } = ValidationSchemas.authenticateUserSchema.validate({ username, password });
        if (error) {
            throw error;
        }
        const user = await this.usersCollection.findOne({ username });
        if (!user) {
            throw new UserErrors.UserNotFoundError("User not found");
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new UserErrors.InvalidPasswordError("Invalid password");
        }
        return this.createUserObject(user);
    }

    /**
     * Validates the provided data against the `addBadgeSchema`,
     * adds the badge matching the provided badge ID to the user document matching the provided user ID,
     * and returns the updated User object.
     *
     * @param {string} userId - The ID of the user to add the badge to.
     * @param {string} badgeId - The ID of the badge to add to the user.
     * @returns {Promise<Object>} A promise that resolves to the updated User object.
     */
    async addBadge(userId, badgeId) {
        const { error } = ValidationSchemas.addBadgeSchema.validate({ userId, badgeId });
        if (error) {
            throw error;
        }
        const badge = await this.badgesCollection.findOne({ _id: new ObjectId(badgeId) });
        if (!badge) {
            throw new UserErrors.BadgeNotFoundError("Badge not found");
        }
        const user = await this.findOneAndUpdate({ _id: new ObjectId(userId) }, { $addToSet: { badges: badge } });
        if (!user) {
            throw new UserErrors.UserNotFoundError("User not found");
        }
        return this.createUserObject(user);
    }

    /**
     * Validates the provided data against the `removeBadgeSchema`,
     * removes the badge matching the provided badge ID from the user document matching the provided user ID,
     * and returns the updated User object.
     *
     * @param {string} userId - The ID of the user to remove the badge from.
     * @param {string} badgeId - The ID of the badge to remove from the user.
     * @returns {Promise<Object>} A promise that resolves to the updated User object.
     */
    async removeBadge(userId, badgeId) {
        const { error } = ValidationSchemas.removeBadgeSchema.validate({ userId, badgeId });
        if (error) {
            throw error;
        }
        const badge = await this.badgesCollection.findOne({ _id: new ObjectId(badgeId) });
        if (!badge) {
            throw new UserErrors.BadgeNotFoundError("Badge not found");
        }
        const user = await this.findOneAndUpdate({ _id: new ObjectId(userId) }, { $pull: { badges: { _id: badgeId } } });
        if (!user) {
            throw new UserErrors.UserNotFoundError("User not found");
        }
        return this.createUserObject(user);
    }

    /**
     * Validates the provided data against the `updateBadgeRequirementSchema`,
     * adds the requirement matching the provided requirement ID to the badge document matching the provided badge ID,
     * and returns the updated badge document.
     *
     * @param {string} badgeId - The ID of the badge to update.
     * @param {string} requirementId - The ID of the requirement to add to the badge.
     * @returns {Promise<Object>} A promise that resolves to the updated badge document.
     */
    async updateBadgeRequirement(badgeId, requirementId) {
        const { error } = ValidationSchemas.updateBadgeRequirementSchema.validate({ badgeId, requirementId });
        if (error) {
            throw error;
        }
        const requirement = await this.requirementsCollection.findOne({ _id: new ObjectId(requirementId) });
        if (!requirement) {
            throw new UserErrors.RequirementNotFoundError("Requirement not found");
        }
        const badge = await this.badgesCollection.findOneAndUpdate({ _id: new ObjectId(badgeId) }, { $addToSet: { requirements: requirement } });
        if (!badge.value) {
            throw new UserErrors.BadgeNotFoundError("Badge not found");
        }
        return badge;
    }
}

module.exports = { UserService };