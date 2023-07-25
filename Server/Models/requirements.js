// Importing the necessary libraries
const mongoose = require("mongoose");
const {logger} = require('../logger');

/**
 * Utilizing mongoose"s Schema function to define the structure of the data 
 * that we want to store in the MongoDB "requirements" collection.
 */
const { Schema } = mongoose;

/**
 * Defining the requirement schema.
 * @type {mongoose.Schema}
 * 
 * @property {Number} badge_id - The id of the badge, this field is required.
 * @property {Number} requirement_id - The id of the requirement, this field is required.
 * @property {String} requirement_string - The string of the requirement, this field is required.
 */
const requirementSchema = new Schema({
  badge_id: { type: Number, required: true },
  requirement_id: { type: Number, required: true },
  requirement_string: { type: String, required: true }
});

// Logging the creation of the requirement schema
logger.info("Created requirement schema");

/**
 * The Requirement model will allow us to perform CRUD operations on the "requirements" collection.
 * @type {mongoose.Model}
 */
const Requirement = mongoose.model("Requirement", requirementSchema);

// Exporting the Requirement model so it can be used in other parts of the application
module.exports = Requirement;