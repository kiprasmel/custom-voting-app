/**
 * Copyright (c) Kipras Melnikovas 2018
 * The main server file
 */

/** load .env environment variables to process.env */

if (process.env.HEROKU != "true") {
	require("./utils/loadDotenv")("../.env"); // FOR HEROKU ONLY
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");

/** Load models here: */

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet()); // https://helmetjs.github.io/
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/** Connect to MongoDB: */
require("./utils/connectToMongoDB")();

/** Use routes: */
app.use("/api/poll", require("./routes/poll"));
app.use("/api/vote", require("./routes/vote"));

// if in production:
if (process.env.NODE_ENV === "production") {
	// serve static assets
	app.use(express.static("../client/build/")); // the '/' is needed! https://stackoverflow.com/a/48666785

	// capture everything that's outside our API routes and send the built react application (index.html file):
	app.get("*", (req, res) => {
		// both are the same:
		// res.sendFile(path.join(__dirname, "../client", "build", "index.html"))
		res.sendFile(path.resolve(__dirname, "../", "client", "build", "index.html"));
	});
}

app.listen(port, () => console.log(`~Server started on port ${port} with NODE_ENV ${process.env.NODE_ENV}`));
