const sequelize = require("../../../sequelize");
const logger = require("../../../logger");

module.exports = {
	/**
	 * Retrieves the user token for a given Discord user ID.
	 *
	 * @param {string} discord_user_id - The Discord user ID for which to retrieve the token.
	 * @return {Promise<Object|null>} The user token object if found, otherwise null.
	 */
	get: async function (discord_user_id) {
		logger.info(
			`Getting user token for ${discord_user_id}`,
		);
		return await sequelize.models.users_tokens.findOne({
			where: {
				discord_user_id: discord_user_id,
			},
		});
	},
};
