let bot = require("./bot");
let server = require("./server");
const sequelize = require("./sequelize");
const logger = require("./logger");

require("dotenv").config();

/**
 * Asserts that the database connection is functioning correctly.
 *
 * This method attempts to authenticate the connection to the database.
 * If the connection is successful, a log message will be recorded.
 * If the connection fails, an error message will be logged and the process will exit with a status code of 1.
 *
 * @return {Promise<void>} A promise that resolves when the connection check is complete.
 */
async function assertDatabaseConnectionOk() {
	logger.info(`Checking database connection...`);
	try {
		await sequelize.authenticate();

		logger.info("Database connection OK!");
	} catch (error) {
		logger.error("Unable to connect to the database: ", error.message);
		process.exit(1);
	}
}

/**
 * Initializes the application by first asserting that a connection to the database is
 * successfully established. Then, it starts the bot using the Discord token provided
 * in the environment variables.
 *
 * @return {Promise<void>} Returns a promise that resolves when initialization is complete,
 * which includes successful database connection verification and bot startup.
 */
async function init() {
	await assertDatabaseConnectionOk();

	await bot.start(process.env.DISCORD_TOKEN);
}

server.listen(process.env.PORT, () => {
	logger.info(`server listening port ${process.env.PORT}`);
});

init();
