const logger = require("../../logger");
const fs = require("fs");
const path = require("path");

const interactions = [];
const interactionFiles = fs
	.readdirSync(path.join(__dirname, "interactions"))
	.filter((file) => file.endsWith(".js"));

for (const file of interactionFiles) {
	const interaction = require(`./interactions/${file}`);
	interactions.push(interaction);
}

module.exports = {
	name: "interactionCreate",
	/**
	 * Executes a command interaction for the bot.
	 *
	 * @param {object} bot - The bot instance executing the command.
	 * @param {object} interaction - The interaction object received from the user.
	 * @return {Promise<void>} - The result of executing the interaction.
	 */
	execute: async function (bot, interaction) {
		try {
			logger.info(
				`Interaction received: ${interaction.commandName}`,
			);
			if (interaction.type === 2)
				await bot.commands.get(interaction.commandName)(interaction, bot);
		} catch (error) {
			logger.error(
				`error executing interaction ${interaction.commandName}: ${error}`,
			);
			await interaction.reply({
				content: "There was an error while executing this interaction!",
				ephemeral: true,
			});
		}
	},
};
