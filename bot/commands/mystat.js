const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("../../db");
const mystatEmbed = require("../components/mystat.embed");
const { getUserStats } = require("../api");
const { pushMetadata } = require("../discord_methods");
const { cooldowns } = require("../index");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("mystat")
		.setDescription("Share your stat."),
	/**
	 * Executes the given interaction by checking cooldowns, user authorization, and tokens,
	 * then fetching user stats and updating roles and metadata accordingly.
	 *
	 * @param {Object} interaction - The interaction object that contains information about the user and the command.
	 * @param {Object} bot - The bot instance to interact with.
	 * @returns {Promise<void>} Resolves if the operation completes successfully, otherwise includes messages specifying the issues.
	 */
	execute: async function (interaction, bot) {
		if (Date.now() - cooldowns[interaction.user.id] < 60000) {
			await interaction.editReply({
				content: `Please wait ${(Math.floor(Date.now() - cooldowns[interaction.user.id]) / 1000).toFixed(1)} seconds, before using this command again.`,
				ephemeral: true,
			});
			return;
		}
		cooldowns[interaction.user.id] = Date.now();
		const dbUser = await db.users.data.get(interaction.user.id);
		if (!dbUser) {
			await interaction.reply({
				content: `Please authorize [here](<${(process.env.NODE_ENV === "production" ? process.env.DOMAIN_URL : `http:localhost:${process.env.PORT}`)}/dota1x6/discord/auth/linked-role>)`,
				ephemeral: true,
			});
			return;
		}
		const tokens = await db.users.tokens.get(interaction.user.id);
		if (!tokens) {
			await interaction.reply({ content: `No tokens 😕`, ephemeral: true });
			return;
		}
		let user_data = await getUserStats(dbUser.steam_user_id);
		if (!user_data) {
			await interaction.reply({ content: `Cant find your data 😕`, ephemeral: true });
			return;
		}
		await updateRoles(user_data, interaction.user.id)
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
				discord_user_id: interaction.user.id,
				rating: user_data.rating,
				avg_place: user_data.avgPlace,
				match_count: user_data.matchCount,
				first_places: user_data.firstPlaces,
			},
			{
				discord_user_id: interaction.user.id,
			},
		);
		await pushMetadata(interaction.user.id, tokens, metadata);

		let embed = mystatEmbed(
			interaction.user.displayAvatarURL({ forceStatic: true, size: 32 }),
			interaction.user.username,
			user_data.rating,
			user_data.matchCount,
			user_data.firstPlaces,
			Number(user_data.avgPlace).toFixed(1),
			Number(user_data.avgGpm).toFixed(1),
		);

		await interaction.reply({ embeds: [embed], ephemeral: false });
	},
	integration_types: [1],
	contexts: [0, 2],
};
