"use strict";
const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const VoteSchema = new Schema(
	{
		/** NOT reliable! */ ip: { type: String, required: true },
		votingCode: { type: String, required: true },
		pollName: { type: String, required: true },
		pollId: { type: ObjectId, required: true },
		rankings: {
			required: true,
			type: [
				{
					name: { type: String, required: true },
					rank: { type: Number, required: true },
				},
			],
		},
	},
	{}
);

const Vote = mongoose.model("Vote", VoteSchema, "votes", false);

module.exports = Vote;
