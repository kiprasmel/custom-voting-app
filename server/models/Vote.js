"use strict";
const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const VoteSchema = new Schema(
	{
		ip: { type: String, required: true },
		teamCode: { type: String, required: true },
	},
	{}
);

module.exports = mongoose.model("Vote", VoteSchema, "votes", false);
