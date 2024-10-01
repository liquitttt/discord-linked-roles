const { Collection } = require("discord.js");
const logger = require("../../logger");
const fs = require("fs");
const path = require("path");

module.exports = {
	name: "ready",
	/**
	 * Initializes the bot with commands and metadata records.
	 *
	 * @param {object} bot - The bot instance to be initialized.
	 * @return {Promise<void>} A promise that resolves when the initialization is complete.
	 */
	execute: async function (bot) {
		logger.info("bot started");

		bot.commands = new Collection();
		const commands = [];
		const commandFiles = fs
			.readdirSync(path.join(process.cwd(), "bot", "commands"))
			.filter((file) => file.endsWith(".js"));

		for (const file of commandFiles) {
			const command = require(`../commands/${file}`);
			commands.push(command);
			if (command.integration_types) command.data.integration_types = command.integration_types;
			if (command.contexts) command.data.contexts = command.contexts;
		}
		commands.forEach((command) => {
			bot.commands.set(command.data.name, command.execute);
			bot.application?.commands.create(command.data);
		});

		bot.application.editRoleConnectionMetadataRecords([
			{
				key: "verified",
				name: "✅",
				type: 7,
				description: "Verified account",
			},
			{
				key: "rating",
				name: "- mmr 🏅",
				type: 3,
				description: "MMR count",
			},
			{
				key: "match_count",
				name: "- игр ⏳",
				type: 3,
				description: "Games played",
			},
			{
				key: "avg_place",
				name: "- среднее место 🎯",
				type: 3,
				description: "Average place",
			},
			{
				key: "first_places",
				name: "- первых мест 🏆",
				type: 3,
				description: "First places",
			},
		]);
		logger.info("registered metadata record");
	},
};
