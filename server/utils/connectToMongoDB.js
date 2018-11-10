const mongoose = require("mongoose");
const { mongodb_uri, node_env } = require("../../config/config.js");

module.exports = () => {
	mongoose
		.connect(
			mongodb_uri,
			{ useNewUrlParser: true, autoIndex: node_env === "production" ? false : true }
		)
		.then(() => console.log("~Connected to MongoDB"))
		.catch((err) => {
			console.log("~Error while connecting to MongoDB", err);
		});
};
