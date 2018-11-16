"use strict";
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

mongoose.set("debug", true);

/** load models: */
const Poll = require("../models/Poll");
const Vote = require("../models/Vote");

/** load validation: */
const isEmpty = require("../utils/isEmpty");
const validateCreateVote = require("../validation/validateCreateVote");

router.get("/test", async (req, res) => {
	return res.json("Test route works!");
});

router.post("/", async (req, res) => {
	try {
		const { isValid, errors } = validateCreateVote(req.body);

		if (!isValid) return res.status(400).json(errors);

		const { rankings, votingCode, pollName } = req.body;
		const { ip } = req;

		// make sure poll exists:
		const poll = await Poll.findOne({ name: pollName, votingCodes: votingCode }).exec();
		if (isEmpty(poll)) return res.status(404).json({ error: "Poll not found!" });
		// if (poll.status === "ended") return res.status(403).json({ error: "Poll has ended!" });

		console.log("poll found!", poll);

		// TODO #todo - validate rankings:
		// ...

		const newVote = new Vote({
			ip,
			pollName,
			pollId: poll._id,
			votingCode,
			rankings,
		});

		const savedVote = await newVote.save();

		return res.json(savedVote);
	} catch (e) {
		console.log(e);
		return res.status(500).json(e);
	}
});

module.exports = router;
