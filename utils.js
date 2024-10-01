const SteamIDConverter = require("steamidconverter");

const sequelize = require("./sequelize");

/**
 * Converts a SteamID to the SteamID3 format and extracts the ID component.
 *
 * @param {string} steamid - The original SteamID that needs to be converted.
 * @return {string} The extracted ID component from the SteamID3 format.
 */
function toSteamID3(steamid) {
	let steamid3 = SteamIDConverter.toSteamID3(steamid);

	let regular = /(\[U:\d:(?<id>\d+)\])/gm;
	let res = regular.exec(steamid3);
	return res.groups.id;
}

/**
 * Returns the specified Sequelize model based on the provided model name.
 *
 * @param {string} model - The name of the model to retrieve. Should be one of the following: "tokens", "data", "waitlist", "roles".
 * @return {Object|null} - The Sequelize model corresponding to the provided name, or null if an unrecognized name is provided.
 */
function getModel(model) {
	switch (model) {
		case "tokens":
			return sequelize.models.users_tokens;
		case "data":
			return sequelize.models.users_data;
		case "waitlist":
			return sequelize.models.requests;
		case "roles":
			return sequelize.models.additional_roles;
		default:
			return null;
	}
}

/**
 * Generates an HTML string based on the provided data and an optional message.
 *
 * @param {Array} data - An array of arrays, where each inner array contains two strings representing the data to be included in the HTML.
 * @param {string} [message=""] - An optional message to be included in the HTML.
 * @return {string} The generated HTML string.
 */
function generateHTML(data, message = "") {
	let htmlData = "";
	data.forEach((d) => {
		htmlData += `<div style=\"margin-right: 6px; color: #ececec; margin-top: 4px;\"><strong>${d[0]}</strong> ${d[1]}</div>`;
	});

	return (
		'<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Stats</title></head><body style="background-color: #111214"><svg viewBox="0 0 1 1" style="position: absolute; top: -1px; left: -1px; width: 1px; height: 1px"><mask id="svg-mask" viewBox="0 0 1 1" maskContentUnits="objectBoundingBox"><circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle></mask></svg>' +
		`<p style='color: white'>${message}</p>` +
		"<div style=\"border-radius: 4px; border: 1px solid #2e2f34; overflow: hidden; width: 305px; height: auto; margin: 0px; padding: 0px; font-weight: inherit; font-size: 100%; font-style: inherit; font-family: inherit\"><div style=\"width: auto; margin-top: 0px; border-radius: 0px; border: none; padding: 8px;\"><div style=\"display: flex; align-items: center; gap: 8px\"><div style=\"flex-glow: 1px; overflow: hidden; font-family: 'gg sans', 'Noto Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.3333333; font-weight: 700; text-transform: uppercase; letter-spacing: .02em\"><div style=\"color: #b5bac1\">Dota1x6 MMR</div></div></div><div style=\"margin-left: 0px; display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; overflow: hidden; font-family: 'gg sans', 'Noto Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.3333333; font-weight: 400\">" +
		htmlData +
		'<div style="background-color: #2e2f34; border-radius: 12px; padding: 1px 8px; margin-top: 4px">✅</div></div><div><div style="margin-top: 8px; display: inline-block;"></div></div></div></div></body></html>'
	);
}


module.exports = {
	toSteamID3,
	getModel,
	generateHTML,
};
