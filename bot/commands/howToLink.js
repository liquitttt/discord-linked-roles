const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord.js");
const logger = require("../../logger");
const howToLinkEmbed = require("../components/howToLinkEmbed");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("howtolink")
		.setDescription("Отправляет специальное сообщение")
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	/**
	 * Executes the given interaction by sending an embed to the specified channel and replying to the interaction.
	 * Handles errors related to permissions and other unexpected issues.
	 *
	 * @param {Object} interaction - The interaction object from Discord.
	 * @param {Object} bot - The bot client instance.
	 * @return {Promise<void>} - A promise that resolves when the execution is complete.
	 */
	execute: async function (interaction, bot) {
		try {
			const embed = howToLinkEmbed();
			await bot.channels.cache.get(interaction.channelId).send({
				embeds: [embed],
			});
			await interaction.reply({ content: `Успех`, ephemeral: true });
		} catch (e) {
			if (e.rawError.message && e.rawError.message === "Missing Access") {
				await interaction.reply({
					content: "У бота нету прав тута писать",
					ephemeral: true,
				});
				logger.log("bot", logger.l(), "ERROR", "Missing permission to send");
			} else {
				await interaction.reply({
					content: "Ошибка(не из-за разрешений) )))))))",
					ephemeral: true,
				});
				logger.log("bot", logger.l(), "ERROR", `Error sending HOWTOLINK embed: ${e}`);
			}
		}
	},
};
