const isEmpty = require("../utils/isEmpty");

module.exports = validateCreatePoll = (name, votingCodes, votingOptions) => {
	let errors = {};

	if (name.length < 2 || name.length > 32)
		errors.name = "`name` must contain at least 2 characters, but not more than 32";

	if (isEmpty(name)) errors.name = "Event name is required!";

	for (const code of votingCodes) {
		if (isEmpty(code)) errors.votingCodes = "votingCodes must NOT contain empty strings!";
		break;
	}

	let badVotingOptionsObjects = [];
	for (const obj of votingOptions) {
		if (obj.hasOwnProperty("name") === false) {
			errors.votingOptions =
				"Names of voting options must be provided but a bad object was passed!";
			badVotingOptionsObjects.push(obj);
		}
	}

	if (!isEmpty(badVotingOptionsObjects)) errors.badVotingOptionsObjects = badVotingOptionsObjects;

	return { errors, isValid: isEmpty(errors) };
};
