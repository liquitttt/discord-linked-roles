const sequelize = require("../../../sequelize");
const logger = require("../../../logger");

module.exports = {
	/**
	 * Retrieves user data for a given user ID.
	 *
	 * @param {string} user_id - The ID of the user for whom the data is being retrieved.
	 * @return {Promise<Object>} A promise that resolves to the user's data.
	 */
	get: async function (user_id) {
		logger.info(`Getting user data for user ${user_id}`);
		return await sequelize.models.users_data.findOne({
			where: {
				discord_user_id: user_id,
			},
		});
	},
	/**
	 * Fetches a user record from the database based on the provided Steam ID.
	 *
	 * @param {string} steam_id - The Steam ID of the user to retrieve.
	 * @return {Promise<Object|null>} A promise that resolves to the user record if found, or null if not found.
	 */
	getBySteamId: async function (steam_id) {
		logger.info(`Checking if user exists ${steam_id}`);
		return await sequelize.models.users_data.findOne({
			where: {
				steam_user_id: steam_id,
			},
		});
	},
	/**
	 * Retrieves all user data from the database.
	 *
	 * @return {Promise<Array>} A promise that resolves to an array containing all user data.
	 */
	getAll: async function () {
		logger.info(`Getting all user data`);
		return await sequelize.models.users_data.findAll();
	},
};
