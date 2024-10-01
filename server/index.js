const express = require("express");
/**
 * An instance of an Express application.
 *
 * The `app` object is instantiated by calling the `express()` function.
 * It is used to define the structure of the web application and can handle
 * HTTP requests, middleware functions, and routing definitions.
 *
 * Key functionalities include:
 * - Defining endpoints for handling HTTP requests with `app.get()`, `app.post()`, etc.
 * - Managing middleware functions with `app.use()`.
 * - Configuring settings and properties.
 * - Serving static files.
 *
 * Common use cases involve setting up a server, adding middleware for parsing
 * request bodies, authentication, logging, as well as defining route handlers
 * for various HTTP methods and paths.
 *
 * Example:
 * const app = express();
 */
const app = express();
const cookieParser = require("cookie-parser");
const dota1x6Router = require("./dota1x6");
const gamesApiRouter = require("./games_api");

require("dotenv").config();

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());

app.use("/dota1x6/discord/auth", dota1x6Router);

app.use("/dota1x6/discord/games_api", gamesApiRouter);

module.exports = app;
