// Importing the necessary libraries
const mongoose = require("mongoose");
const {logger} = require('../logger');

/**
 * Utilizing mongoose"s Schema function to define the structure of the data 
 * that we want to store in the MongoDB "badges" collection.
 */
const { Schema } = mongoose;

/**
 * Defining the badge schema.
 * @type {mongoose.Schema}
 * 
 * @property {String} badge_name - The name of the badge, this field is required.
 * @property {Number} badge_id - The id of the badge, this field is required.
 */
const badgeSchema = new Schema({
  badge_name: { type: String, required: true },
  badge_id: { type: Number, required: true }
});

// Logging the creation of the badge schema
logger.info("Created badge schema");

/**
 * The Badge model will allow us to perform CRUD operations on the "badges" collection.
 * @type {mongoose.Model}
 */
const Badge = mongoose.model("Badge", badgeSchema);

// Exporting the Badge model so it can be used in other parts of the application
module.exports = Badge;