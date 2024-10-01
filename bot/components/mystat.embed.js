const { EmbedBuilder } = require("discord.js");

module.exports = (
	image,
	nickname,
	mmr,
	games,
	first_places,
	avg_place,
	avg_gpm,
) => {
	return new EmbedBuilder()
		.setAuthor({
			name: nickname,
			iconURL: image,
		})
		.setTitle("Here is my stat:")
		.addFields(
			{
				name: "MMR:",
				value: `\`${mmr}\``,
				inline: true,
			},
			{
				name: "Games played:",
				value: `\`${games}\``,
				inline: true,
			},
			{
				name: "First places:",
				value: `\`${first_places}\``,
				inline: true,
			},
			{
				name: "Average place:",
				value: `\`${avg_place}\``,
				inline: true,
			},
			{
				name: "Average GPM:",
				value: `\`${avg_gpm}\``,
				inline: true,
			},
			{
				name: " ",
				value:
					`[Want share your stat?](https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID})`,
				inline: false,
			},
		)
		.setColor(0xe2d92a);
};
