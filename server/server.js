/**
 * Copyright (c) Kipras Melnikovas 2018
 * The main server file
 */

/** load .env environment variables to process.env */
require("./utils/loadDotenv")("../.env");

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");

/** Load models here: */
/// foo(bar)

const app = express();
const port = process.env.SERVER_PORT;

app.use(helmet()); // https://helmetjs.github.io/
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/** Connect to MongoDB: */
require("./utils/connectToMongoDB")();

/** Use routes: */
app.use("/api/vote", require("./routes/vote"));

app.listen(port, () => console.log(`~Server started on port ${port}`));
