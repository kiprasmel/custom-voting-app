"use strict";
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

mongoose.set("debug", true);

/** load models: */
const Poll = require("../models/Poll");

/** load validation: */
const validateCreatePoll = require("../validation/validateCreatePoll");

/** begin routes: */

/** GET get all polls */
router.get("/", async (req, res) => {
	const polls = await Poll.find();
	if (isEmpty(polls)) return res.status(404).json({ error: "0 polls found!" });

	return res.json(polls);
});

/** GET get one poll by it's name or voting code & select if you want the votes to be populated */
router.get("/:nameOrVotingCode/:populateVotesTF", async (req, res) => {
	try {
		const { nameOrVotingCode, populateVotesTF } = req.params;
		const populate = populateVotesTF === "true" ? "votes" : "";

		const poll = await Poll.findOne({
			$or: [{ name: nameOrVotingCode }, { votingCodes: nameOrVotingCode }],
		})
			.populate(populate)
			.exec();

		if (isEmpty(poll)) return res.status(404).json({ error: "Poll doesn't exist!" });

		if (populateVotesTF !== "true") {
			return res.json(poll);
		}

		console.log("analyzing data!");

		/**
		 * the better rank you got, the less points you're going to lose.
		 * rank 1 gets maxPoints (+1, then -1);
		 * last rank gets 1 point (maxPoints + 1 - rank = 1)
		 */

		const maxPoints = poll.votingOptions.length + 1;

		// generate points by rank (NOTE - not an Array, but an Object!)
		let votesPerRank = {};
		// let votesPerRank = [];
		for (let i = 0; i < poll.votingOptions.length; i++) {
			votesPerRank[i] = 0;
			// votesPerRank.push({ rank: i, value: 0 });
		}

		// `teams` are just rewritten votingOptions who have less votingOptions data and more analysis data.

			/** 
		 * note
		 * do not use `votesPerRank: votesPerRank`
		 * instead use `votesPerRank: {...votesPerRank}`
			 * 
		 * there's a big difference:D (making a reference VS copying)
			 */
		let teams = poll.votingOptions.map(({ name }) => {
			return { name: name, points: 0, place: -1, votesPerRank: { ...votesPerRank } };
		});

		/** loop through all poll's votes' rankings' and give teams points based on what rank they got: */
		for (const team of teams) {
			for (const vote of poll.votes) {
				for (const ranking of vote.rankings) {
					if (team.name === ranking.name) {
						team.points += maxPoints - ranking.rank;
						team.votesPerRank[ranking.rank - 1] += 1;
					}
				}
			}
		}

		/**
		 * sort teams by their points.
		 * teams[0] will have the least amount of points points and
		 * teams[teams.length - 1] will have the most amount of points.
		 * more at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
		 */
		teams.sort((a, b) => b.points - a.points);


		// set places (teams MUST be sorted descendingly by their scores beforehand)
		for (let i = 0; i < teams.length; i++) {
			teams[i].place = i + 1;
		}

		return res.json({ poll, teams });
	} catch (e) {
		console.log(e);
		return res.status(500).json(e);
	}
});

/** POST create poll */
router.post("/", async (req, res) => {
	try {
		const {
			name = "",
			votingCodes = [],
			votingOptions = [],
			pollType = "",
			description = "",
		} = req.body;

		const { isValid, errors } = validateCreatePoll(name, votingCodes, votingOptions);
		if (!isValid) return res.status(400).json({ errors });

		const existingPoll = await Poll.findOne({
			$or: [{ name: name }, { votingCodes: { $in: votingCodes } }],
		});

		if (existingPoll !== null)
			return res.status(400).json({ error: "Poll already exists!", existingPoll });

		const poll = new Poll({
			owner: req.ip, // #TODO - only allow authenticated users to create polls
			name: name,
			votingCodes: !isEmpty(votingCodes) ? votingCodes : [name],
			votingOptions: votingOptions,
			pollType: pollType,
			description: description,
		});

		const savedPoll = await poll.save();
		return res.json(savedPoll);
	} catch (e) {
		console.log(e);
		return res.status(500).json(e);
	}
});

router.post("/:pollName/stop", async (req, res) => {
	try {
		const { password } = req.body;
		const { pollName, status } = req.params;

		// const { isValid, errors } = validateCreatePoll(name, votingCodes, votingOptions);
		// if (!isValid) return res.status(400).json({ errors });

		console.log("password", password, process.env.TEMP_ADMIN_PASSWORD);
		if (password === process.env.TEMP_ADMIN_PASSWORD) {
			const existingPoll = await Poll.findOne({
				$or: [{ name: pollName }, { votingCodes: { $in: pollName } }],
			});

			existingPoll.status = "ended";

			const savedPoll = await existingPoll.save();
			return res.json(savedPoll);
		}
	} catch (e) {
		console.log(e);
		return res.status(500).json(e);
	}
});

// #TODO #DELETEME
router.patch("/clearVotes/:password", async (req, res) => {
	const { password } = req.params;

	if (password === process.env.TEMP_ADMIN_PASSWORD) {
		// Poll.findOneAndUpdate({}, {});
	} else res.status(403).json({ error: "Wrong password!" });
});

/** DELETE delete one poll by it's name */
router.delete("/:pollName", async (req, res) => {
	try {
		const { pollName } = req.params;

		const poll = await Poll.findOne({ name: pollName }).exec();

		if (poll.owner === req.ip) {
			await poll.delete();
			return res.json({ sucess: "true" });
		}
	} catch (e) {
		console.log(e);
		return res.status(500).json(e);
	}
});

/** #TODO - implement passport for user authentication */
// router.delete("/:pollName", passport.authenticate("jwt", { session: false }), async (req, res) => {
// 	try {
// 		const { pollName } = req.params;

// 		const poll = await Poll.findOne({ name: pollName }).exec();

// 		if (poll.owner === req.user._id) {
// 			await poll.delete();
// 			return res.json({ sucess: "true" });
// 		}
// 	} catch (e) {
// 		console.log(e);
// 		return res.status(500).json(e);
// 	}
// });

module.exports = router;
