const express = require("express");
const db = require("../../db");
const { getModel } = require("../../utils");
const { getUserStats } = require("../../bot/api.js");
const { pushMetadata } = require("../../bot/discord_methods.js");
const logger = require("../../logger");
const {updateRoles} = require("../../bot");

require("dotenv").config();

/**
 * Router instance for handling API routes related to games.
 *
 * This router is defined using Express.js and is responsible for defining
 * the endpoints and route handling logic specific to game-related operations.
 * It can be used to group routes logically and apply middleware that should
 * only pertain to game-related routes.
 *
 * @type {Router}
 */
const gamesApiRouter = express.Router();

/**
 * Middleware function to authorize incoming requests based on a token.
 *
 * This function compares the token from the request body with the expected token
 * stored in the environment variable LOCAL_TOKEN. If the tokens match, the request
 * is passed to the next middleware function. If they do not match, a 403 Forbidden
 * status is sent as a response and a warning is logged with the request body.
 *
 * @param {Object} req - The Express request object containing request data.
 * @param {Object} res - The Express response object for sending responses.
 * @param {Function} next - The next middleware function in the Express stack.
 */
const authorize = (req, res, next) => {
	if (req.body.token === process.env.LOCAL_TOKEN) {
		next();
	} else {
		logger.warn(
			`Got request with invalid token; body: ${JSON.stringify(req.body)}`,
		);
		res.sendStatus(403);
	}
};

gamesApiRouter.post("/game_ended", authorize, async (req, res) => {
	let user = await db.users.data.getBySteamId(req.body.playerIds[0]);

	if (user) {
		logger.info(
			`Player ${req.body.playerIds[0]} | ${user.discord_user_id} exists in DB, trying to update`,
		);
		const tokens = await db.users.tokens.get(user.discord_user_id);
		if (!tokens) return;
		let user_data = await getUserStats(req.body.playerIds);
		if (!user_data) return;
		await updateRoles(user_data, user.discord_user_id)
		let metadata = {
			verified: true,
			rating: user_data.rating,
			match_count: user_data.matchCount,
			avg_place: Number(user_data.avgPlace).toFixed(1),
			first_places: user_data.firstPlaces,
		};
		await db.upsert(
			"data",
			{
				steam_user_id: user_data.playerId,
				discord_user_id: user.discord_user_id,
				rating: user_data.rating,
				avg_place: user_data.avgPlace,
				match_count: user_data.matchCount,
				first_places: user_data.firstPlaces,
			},
			{
				discord_user_id: user.discord_user_id,
			},
		);
		logger.info(
			`updating stats of user ${user.discord_user_id}`,
		);
		await pushMetadata(user.discord_user_id, tokens, metadata);
		res.sendStatus(200);
		return;
	}
	res.sendStatus(404)
});

module.exports = gamesApiRouter;
