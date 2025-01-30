const mapAnswersForDB = (answers) =>
	answers.map(({ content, isCorrect }) => ({
		content,
		is_correct: isCorrect,
	}));

const mapAnswersForClient = (answers) =>
	answers.map(({ content, is_correct }) => ({
		content,
		isCorrect: is_correct,
	}));

module.exports = { mapAnswersForDB, mapAnswersForClient };
