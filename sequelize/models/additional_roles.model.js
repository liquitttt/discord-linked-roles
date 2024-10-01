const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
	sequelize.define("additional_roles", {
		id: {
			primaryKey: true,
			autoIncrement: true,
			type: DataTypes.INTEGER,
			unique: true,
			allowNull: false,
		},
		discord_server_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		condition_min_mmr: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		condition_max_mmr: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		discord_role_id: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		linked_role_id: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
	});
};
