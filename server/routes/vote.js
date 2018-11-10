"use strict";
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

mongoose.set("debug", true);

/** load models: */
const Vote = require("../models/Vote");

router.get("/test", async (req, res) => {
	return res.json("Test route works!");
});

router.post("/", async (req, res) => {
	return res.json("Todo");
});

module.exports = router;
