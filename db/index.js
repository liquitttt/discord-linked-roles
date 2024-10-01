const users = require("./users");
const roles = require("./roles");
const logger = require("../logger");
const { getModel } = require("../utils");

module.exports = {
	users: users,
	roles: roles,

	/**
	 * Upserts a record in the database for the given model based on a condition.
	 * If a record matching the condition exists, it updates it with the provided values.
	 * Otherwise, it creates a new record with the values.
	 *
	 * @param {string} model - The name of the model to perform the upsert operation on.
	 * @param {Object} values - The values to update or create the record with.
	 * @param {Object} condition - The condition to find an existing record.
	 *
	 * @return {Promise<Object>} - A promise that resolves to the created or updated record.
	 */
	upsert: async function (model, values, condition) {
		let Model = getModel(model)
		logger.info(
			`Upserting ${Model.name} with values ${JSON.stringify(values)} and condition ${JSON.stringify(condition)}`,
		);
		return await Model.findOne({ where: condition }).then(async function (obj) {
			if (obj) return await obj.update(values);
			return await Model.create(values);
		});
	},
};
