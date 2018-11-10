/**
 * Copyright (c) Kipras Melnikovas 2018
 * The main server file
 */

/** load .env environment variables to process.env */
require("./utils/loadDotenv")("../.env");

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const config = require("../config/config.js");

/** Load models here: */
/// foo(bar)

const app = express();
const port = config.server_port;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/** Connect to MongoDB: */
require("./utils/connectToMongoDB")();

app.listen(port, () => console.log(`~Server started on port ${port}`));
