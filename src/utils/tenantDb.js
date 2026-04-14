import mongoose from "mongoose";
import * as schemas from "./schemas";

/**
 * Dynamically retrieves or creates a Mongoose model bound to a specific company collection.
 * 
 * @param {string} baseModelName - The generic name of the model (e.g., 'Checklist', 'Prototype')
 * @param {string} companyId - The unique ID of the company (e.g., 'comp_123')
 * @returns {mongoose.Model} - The tenant-bound model
 */
export function getTenantModel(baseModelName, companyId) {
  if (!companyId) {
    throw new Error("companyId is required to retrieve a tenant model");
  }

  // Generate a unique model key and collection name
  // e.g., Model: 'comp_123_Checklist', Collection: 'comp_123_checklists'
  const modelKey = `${companyId}_${baseModelName}`;
  const collectionName = `${companyId}_${baseModelName.toLowerCase()}s`;

  // Return existing model if already compiled
  if (mongoose.models[modelKey]) {
    return mongoose.models[modelKey];
  }

  // Get the schema from the centralized schemas file
  const schemaName = `${baseModelName.charAt(0).toLowerCase()}${baseModelName.slice(1)}Schema`;
  const schema = schemas[schemaName];

  if (!schema) {
    throw new Error(`Schema for model '${baseModelName}' not found in schemas.js`);
  }

  // Create and return the new model bound to the specific collection
  return mongoose.model(modelKey, schema, collectionName);
}
