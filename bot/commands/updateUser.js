const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord.js");
const db = require("../../db");
const logger = require("../../logger");
const { pushMetadata } = require("../discord_methods");
const { getUserStats } = require("../api");
const { updateRoles} = require("../index");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("updateuser")
		.setDescription("Updating user stats!")
		.addStringOption((option) =>
			option.setName("userid").setDescription("User id to update!").setRequired(true),
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	/**
	 * Executes the interaction to update user statistics.
	 *
	 * @param {Object} interaction - The interaction object containing options and reply methods.
	 * @param {Object} bot - The bot instance used to perform various operations.
	 * @return {Promise<void>} A promise that resolves when the operation is complete.
	 */
	execute: async function (interaction, bot) {
		let userId = interaction.options.getString("userid");

		const dbUser = await db.users.data.get(userId);
		if (!dbUser) return;

		const tokens = await db.users.tokens.get(userId);
		if (!tokens) return;

		let user_data = await getUserStats(dbUser.steam_user_id);
		if (!user_data) return;

		await updateRoles(user_data, dbUser.discord_user_id)
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
				discord_user_id: userId,
				rating: user_data.rating,
				avg_place: user_data.avgPlace,
				match_count: user_data.matchCount,
				first_places: user_data.firstPlaces,
			},
			{
				discord_user_id: userId,
			},
		);

		logger.info(`updating stats of user ${userId}`);
		await pushMetadata(userId, tokens, metadata);

		await interaction.reply({ content: `User stats updated`, ephemeral: true });
	},
};
