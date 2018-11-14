const isEmpty = require("../utils/isEmpty");

module.exports = validateCreatePoll = (data) => {
	let errors = {};
	const { rankings, votingCode, pollName } = data;

	return { errors, isValid: isEmpty(errors) };
};
