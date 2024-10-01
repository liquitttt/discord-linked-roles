const db = require("../db");
const { Client, GatewayIntentBits } = require("discord.js");
const bot = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});
const { pushMetadata } = require("./discord_methods.js");
const logger = require("../logger");
const fs = require("fs");
const path = require("path");

const cooldowns = {};

/**
 * Starts the bot by loading event handlers and logging in using the provided token.
 *
 * @param {string} TOKEN - The token to authenticate the bot with the server.
 * @return {Promise<void>} A promise that resolves when the bot has successfully logged in.
 */
async function start(TOKEN) {
	const events = [];
	const eventFiles = fs
		.readdirSync(path.join(__dirname, "events"))
		.filter((file) => file.endsWith(".js"));

	for (const file of eventFiles) {
		const event = require(`./events/${file}`);
		events.push(event);
	}
	events.forEach((event) => {
		bot.on(event.name, (...args) => event.execute(bot, ...args));
	});
	logger.info("events deployed");
	await bot.login(TOKEN);
}

/**
 * Assigns or removes a role from a member based on specific conditions.
 *
 * @param {string} guild_id - The ID of the guild (server).
 * @param {string} user_id - The ID of the member.
 * @param {string} role_id - The ID of the role to be assigned or removed.
 * @param {string} linked_id - The ID of a linked role that conditions the assignment.
 * @param {boolean} [force=false] - Whether to forcefully assign the role ignoring the linked role condition.
 * @return {Promise<void>} A promise that resolves when the role assignment process is complete.
 */
async function giveRole(
	guild_id,
	user_id,
	role_id,
	linked_id,
	force = false,
) {
	bot.guilds.cache
		.get(guild_id)
		.members.fetch(user_id)
		.then((member) => {
			let role = member.roles.cache.get(role_id);
			let linked = member.roles.cache.get(linked_id);
			if (!role) {
				if (force) member.roles.add(role_id, "Force add");
				else if (linked) member.roles.add(role_id, "Linked add");
			} else if (!linked) member.roles.remove(role_id, "Not linked");
		})
		.catch((e) => {
			logger.error(`error checking role: ${e}`);
		});
}

/**
 * Updates roles for a user based on their rating and predefined role conditions.
 *
 * @param {Object} user_data - The data object containing user's rating and relevant information.
 * @param {string} user_id - The ID of the user whose roles are to be updated.
 * @param {Array} [roles] - An optional array of roles to be assigned based on user rating.
 *                           If not provided, all roles will be fetched from the database.
 * @return {Promise<void>} A promise that resolves when roles have been updated successfully.
 */
async function updateRoles(user_data, user_id, roles) {
	if(roles === undefined) roles = await db.roles.getAll();
	for (const role of roles) {
		if (
			user_data.rating >= role.condition_min_mmr &&
			user_data.rating <= role.condition_max_mmr
		) {
			await giveRole(
				role.discord_server_id,
				user_id,
				role.discord_role_id,
				role.linked_role_id,
			);
		}
	}
}

module.exports = {
	start,
	updateRoles,
	cooldowns,
};
