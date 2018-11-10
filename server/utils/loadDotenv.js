module.exports = (path) => {
	/** #todo - disable debug in production */
	const dotenvResult = require("dotenv").config({ debug: true, path: path });

	if (dotenvResult.error) throw dotenvResult.error;
	else console.log("~Succesfully parsed .env to process.env using dotenv!");
};
