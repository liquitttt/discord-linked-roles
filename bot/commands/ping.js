const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with a pong!"),
	/**
	 * Executes a reply to an interaction with a "pong" message.
	 *
	 * @param {Object} interaction - The interaction object.
	 * @param {Object} bot - The bot instance handling the interaction.
	 * @return {Promise<void>} A promise that resolves when the reply is sent.
	 */
	execute: async function (interaction, bot) {
		await interaction.reply({ content: `pong`, ephemeral: true });
	},
};
