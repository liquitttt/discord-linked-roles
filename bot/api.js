const axios = require("axios");
const logger = require("../logger");

require("dotenv").config();

module.exports = {
	/**
	 * Fetches user statistics from the remote endpoint using the provided Steam ID(s).
	 *
	 * @param {string|string[]} steam_id - The Steam ID or an array of Steam IDs to fetch the statistics for.
	 * @return {Object|undefined} The statistics data of the user(s) if the request was successful, otherwise undefined.
	 */
	getUserStats: async function (steam_id) {
		try {
			let res = await axios.post(
				process.env.ENDPOINT_URL,
				JSON.stringify(typeof steam_id == "string" ? [steam_id] : steam_id),
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			let data = res.data[0];
			logger.info(
				`sending request ${JSON.stringify(steam_id)}`,
			);
			return data;
		} catch (e) {
			logger.error(
				`error while sending request: ${e}`,
			);
		}
	},
};
