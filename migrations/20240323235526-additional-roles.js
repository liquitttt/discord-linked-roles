"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("additional_roles", {
			id: {
				primaryKey: true,
				autoIncrement: true,
				type: Sequelize.INTEGER,
				unique: true,
				allowNull: false,
			},
			discord_server_id: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			condition_min_mmr: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			condition_max_mmr: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			discord_role_id: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			linked_role_id: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			createdAt: Sequelize.DATE,
			updatedAt: Sequelize.DATE,
		});
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
	},
};
