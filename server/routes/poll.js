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
		let teams = poll.votingOptions.map(({ name }) => {
			return { name: name, points: 0, place: -1, votesPerRank: { ...votesPerRank } };
			// // return { name: name, points: 0, place: -1, votesPerRank: votesPerRank };
			/** 
			 * OH MY FUCKING GOD.
			 * I JUST SPENT 3 HOURS FIGURING OUT WHY ALL VOTESPERRANK SUMS WERE ADDED TOGETHER.
			 * IT TURNS OOUT THAT I WHEN I CREATED THE VOTESPERRANK OBJECT AND USED IT TO CREATE `TEAMS`,
			 * EACH TEAM'S VOTESPERRANK OBJECT WAS JUST *A FUCKING REFERENCE* TO THE SAME VOTESPERRANK OBJECT,
			 * AND THAT MEANT THAT THE SUMS WERE ADDING UP TOGETHER. OH MY GOD.
			 * WHAT THE FUCK JAVASCRIPT? I CAME FROM C++ AND I FIND THIS OFFENSIVE
			 * 
			 * IT PREVIOUSLY WAS LIKE THIS:
			 * `return { name: name, points: 0, place: -1, votesPerRank: votesPerRank };`
			 * 
			 * DEBUGGING CODE:
				`
				for (const team of teams) {
					for (const vote of poll.votes) {
						for (const ranking of vote.rankings) {
							if (team.name === ranking.name) {
								console.log("team.name", team.name, "ranking.name", ranking.name, "team.votesPerRank[ranking.rank - 1]", team.votesPerRank[ranking.rank - 1], "ranking.rank", ranking.rank, "team.votesPerRank", team.votesPerRank)
								team.votesPerRank[ranking.rank - 1] += 1;
							}
						}
					}
				}
				`
			 * 
			 * AND THE OBVIOUS FIX WHICH I INSTANTLY NOTICED 
			 * AFTER I STARTED CONSOLE LOGGING EVERYTHING EVERYTIME IN THE FOR LOOP
			 * WAS TO ADD A SPREAD OPERATOR ... AND PUT THE THING IN CURLY BRACES {} SO THAT IT GETS COPIED,
			 * INSTEAD OF GETTING A REFERENCE.
			 * 
			 * THE MORE YOU KNOW...
			 */
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

		// sort teams by their points. teams[0] will have the most points, and teams[teams.length - 1] will have the least amount of points.
		teams.sort((a, b) => a.points < b.points);

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
