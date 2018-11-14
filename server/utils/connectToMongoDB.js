const mongoose = require("mongoose");

module.exports = () => {
	mongoose
		.connect(
			process.env.MONGODB_URI,
			{
				useNewUrlParser: true, // autoIndex: process.env.NODE_ENV === "production" ? false : true,
				useCreateIndex: process.env.NODE_ENV === "production" ? false : true,
			}
		)
		.then(() => console.log("~Connected to MongoDB"))
		.catch((err) => {
			console.log("~Error while connecting to MongoDB", err);
		});
};
