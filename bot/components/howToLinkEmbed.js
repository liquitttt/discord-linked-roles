const { EmbedBuilder } = require("discord.js");

module.exports = () => {
	return new EmbedBuilder()
		.setColor(0xe2d92a)
		.setTitle("VERIFIED ACCOUNT")
		.setImage(
			"https://media.discordapp.net/attachments/1089147916255510640/1222265630703489156/Comp1131231-ezgif.com-video-to-gif-converter.gif?ex=661ed112&is=660c5c12&hm=3cc6254093e408715e58695b4179c7eb1776d610f45d166bcfd339e97095d363&",
		)
		.setDescription(
			"```If you want to link your role - \nplease connect your Steam to Discord and follow instruction below.```",
		);
};
