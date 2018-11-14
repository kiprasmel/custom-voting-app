"use strict";
const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const PollSchema = new Schema(
	{
		owner: { type: String, required: true },
		// owner: { type: ObjectId, ref: "User", required: true }, // #TODO
		name: { type: String, required: true, min: 2, max: 32, unique: true /** NOT A VALIDATOR! */ },
		description: { type: String },
		votingCodes: { type: [String] },
		votingOptions: {
			required: true,
			type: [
				{
					name: { type: String, required: true },
					disableVotesFrom: [{ type: String }],
					info: { type: String },
					imgUrl: { type: String },
				},
			],
		},
		status: {
			type: String,
			required: true,
			enum: ["notStarted", "started", "ended"],
			default: "notStarted",
		},
		pollType: {
			type: String,
			required: true,
			enum: ["top1byRank", "topXbyRank", "top1byStars", "topXbyStars"],
			/** TODO - implement all the different poll types xoxo */
		},
	},
	{ toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

PollSchema.virtual("votes", {
	ref: "Vote",
	localField: "_id",
	foreignField: "pollId",
	justOne: false,
});

module.exports = mongoose.model("Poll", PollSchema, "polls", false);
