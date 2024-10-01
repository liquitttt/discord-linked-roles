const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord.js");

const howToLinkEmbed = require("../components/howToLinkEmbed");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("sendmessage")
		.setDescription("Send message in specific channel!")
		.addStringOption((option) =>
			option
				.setName("channelid")
				.setDescription("Choose channel to update!")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("messagetype")
				.setDescription("Choose message type")
				.setRequired(true)
				.addChoices(
					{ name: "How to link!", value: "how_to_link" },
				),
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	/**
	 * Executes the interaction command, sending a specified message type to a given channel.
	 *
	 * @param {object} interaction - The interaction object that contains information about the command.
	 * @param {object} bot - The bot instance used for interacting with the Discord API.
	 * @return {Promise<void>} A promise that resolves when the interaction has been replied to.
	 */
	execute: async function (interaction, bot) {
		let channelId = interaction.options.getString("channelid");
		let messageType = interaction.options.getString("messagetype");
		bot.channels.fetch(channelId).then((channel) => {
			switch (messageType) {
				case "how_to_link":
					let embed = howToLinkEmbed();
					channel.send({
						embeds: [embed],
						components: [],
					});
					break;
			}
		});
		await interaction.reply({ content: `Message sent`, ephemeral: true });
	},
};
