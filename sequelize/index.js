const { Sequelize } = require("sequelize");
const fs = require("fs");
const logger = require("../logger");
require("dotenv").config();

/**
 * An instance of Sequelize used to establish and manage the connection
 * to the MySQL database. It uses configuration details such as database
 * name, user, and password from environment variables. It is configured
 * to connect to the database running on the local host and logs messages
 * using a custom logger.
 *
 * Configurations:
 * - Database Name: Retrieved from process.env.DB_NAME
 * - Database User: Retrieved from process.env.DB_USER
 * - Database Password: Retrieved from process.env.DATABASE_PASSWORD
 * - Host: localhost
 * - Dialect: mysql
 * - Logging: Custom logging function that logs messages using the logger's info level.
 */
const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DATABASE_PASSWORD,
	{
		host: "localhost",
		dialect: "mysql",
		logging: (msg) => logger.info(msg),
	},
);

fs.readdir(__dirname + "/models", (err, files) => {
	files.forEach((file) => {
		require(`./models/${file}`)(sequelize);
	});
});

module.exports = sequelize;
