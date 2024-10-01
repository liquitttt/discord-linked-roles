const sequelize = require("../../sequelize");
const logger = require("../../logger");

module.exports = {
	/**
	 * Retrieves all additional roles associated with a specific server.
	 *
	 * @param {string} server_id - The ID of the Discord server to retrieve roles from.
	 * @return {Promise<Array>} A promise that resolves to an array of additional roles.
	 */
	get: async function (server_id) {
		logger.info(
			`Getting all additional_roles from server ${server_id}`,
		);
		return await sequelize.models.additional_roles.findAll({
			where: { discord_server_id: server_id },
		});
	},
	/**
	 * Retrieves all additional roles from the database.
	 *
	 * @return {Promise<Array<Object>>} A promise that resolves to an array of additional role objects.
	 */
	getAll: async function () {
		logger.info(
			`Getting all additional_roles`,
		);
		return await sequelize.models.additional_roles.findAll();
	},
};
