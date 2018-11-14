/**
 * Copyright (c) Kipras Melnikovas 2018
 * The main server file
 */

/** load .env environment variables to process.env */
"use strict";
require("./utils/loadDotenv")("../.env");

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");

/** Load models here: */
/// foo(bar)

const app = express();
const port = process.env.SERVER_PORT | 5000;

app.use(helmet()); // https://helmetjs.github.io/
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/** Connect to MongoDB: */
require("./utils/connectToMongoDB")();

/** Use routes: */
app.use("/api/poll", require("./routes/poll"));
app.use("/api/vote", require("./routes/vote"));

if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

app.listen(port, () => console.log(`~Server started on port ${port}`));
