const { SlashCommandBuilder } = require("@discordjs/builders");
const db = require("../../db");
const { PermissionFlagsBits } = require("discord.js");
const {updateRoles} = require("../index");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("addroles")
		.setDescription("Start adding roles!")
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	/**
	 * Executes role assignment for users in a guild.
	 *
	 * @param {Object} interaction - The interaction object from the guild.
	 * @param {Object} bot - The bot instance.
	 * @return {Promise<void>} - Resolves when role assignment has started and a reply is sent to the interaction.
	 */
	execute: async function (interaction, bot) {
		let users = await db.users.data.getAll();
		let roles = await db.roles.get(interaction.guild.id);
		let n = 0;
		let interval = setInterval(async () => {
			await updateRoles(users[n], users[n].discord_user_id, roles)
			n += 1;
			if (n >= users.length) clearInterval(interval);
		}, 50);
		await interaction.reply({
			content: `started adding roles`,
			ephemeral: true,
		});
	},
};
