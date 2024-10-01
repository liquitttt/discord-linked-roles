const express = require("express");
const discord = require("../../bot/discord_methods");
const logger = require("../../logger");
const db = require("../../db");
const {
	toSteamID3,
	generateHTML,
} = require("../../utils");
const { getUserStats } = require("../../bot/api");
const {updateRoles} = require("../../bot");

/**
 * A router module for handling routes related to the Dota 1x6 game.
 *
 * This Express Router handles incoming HTTP requests and defines routes specific
 * to functionalities and features of the Dota 1x6 game.
 *
 * @type {object} express.Router
 */
const dota1x6Router = express.Router();

dota1x6Router.get("/linked-role", async (req, res) => {
	const { url, state } = discord.getOAuthUrl();

	res.cookie("clientState", state, { maxAge: 1000 * 60 * 5, signed: true });

	res.redirect(url);
});

dota1x6Router.get("/discord-oauth-callback", async (req, res) => {
	try {
		const code = req.query["code"];
		const discordState = req.query["state"];

		const { clientState } = req.signedCookies;
		if (clientState !== discordState) {
			console.error("State verification failed.");
			return res.sendStatus(403);
		}

		const tokens = await discord.getOAuthTokens(code);

		const meData = await discord.getUserData(tokens.access_token);
		const userId = meData.user.id;
		logger.info(`User ${userId} authorized.`);
		await db.upsert(
			"tokens",
			{
				discord_user_id: userId,
				access_token: tokens.access_token,
				refresh_token: tokens.refresh_token,
				expires_in: Date.now() + tokens.expires_in * 1000,
			},
			{ discord_user_id: userId },
		);
		res.cookie("userId", userId, {
			maxAge: 1000 * 60 * 60 * 24 * 30,
			signed: true,
		});

		let connections = await discord.getUserConnections(tokens.access_token);

		let steam = connections.find(({ type }) => type === "steam");
		if (!steam) {
			res.status(400);
			res.send("Please connect your Steam to Discord!");
		} else {
			let data = await getUserStats(toSteamID3(steam.id));
			if (!data) {
				res.status(404);
				res.send(
					"Can't find your account in database. Please, check account you linked to discord!",
				);
				return;
			}
			await updateRoles(data, userId);
			let metadata = {
				verified: true,
				rating: data.rating,
				match_count: data.matchCount,
				avg_place: Number(data.avgPlace).toFixed(1),
				first_places: data.firstPlaces,
			};
			await db.upsert(
				"data",
				{
					steam_user_id: data.playerId,
					discord_user_id: userId,
					rating: data.rating,
					avg_place: data.avgPlace,
					match_count: data.matchCount,
					first_places: data.firstPlaces,
				},
				{
					discord_user_id: userId,
				},
			);
			logger.info(`updating stats of user ${userId}`);
			await discord.pushMetadata(userId, tokens, metadata);

			let preview_data = [
				[metadata.rating, "- MMR 🏅"],
				[metadata.match_count, "- games played 🏅"],
				[metadata.first_places, "- first places 🏆"],
				[metadata.avg_place, "- average place 🎯"],
			];

			let html = generateHTML(preview_data, "Great, here is you stat: ");

			res.send(html);
		}
	} catch (e) {
		logger.error(`discord oauth error: ${e}`);
		res.sendStatus(500);
	}
});

module.exports = dota1x6Router;
