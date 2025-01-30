const Question = require('../models/Question');

async function getAllQuestions() {
	try {
		const questions = await Question.find().populate('answers');
		return { questions };
	} catch (error) {
		console.error('Ошибка при получении списка вопросов:', error);
		return { error: 'Не удалось получить вопросы' };
	}
}

async function getQuestionById(id) {
	try {
		const question = await Question.findById(id).populate('answers');

		if (!question) {
			return { error: 'Вопрос не найден' };
		}

		return { question };
	} catch (error) {
		console.error('Ошибка при получении вопроса:', error);
		return { error: 'Не удалось получить вопрос' };
	}
}

async function updateQuestions(questionsData) {
	const bulkOperations = [];

	for (const questionData of questionsData) {
		if (questionData.id.startsWith('new_')) {
			bulkOperations.push({
				insertOne: {
					document: {
						title: questionData.title,
						answers: questionData.answers,
					},
				},
			});
		} else {
			bulkOperations.push({
				updateOne: {
					filter: { _id: questionData.id },
					update: {
						$set: {
							title: questionData.title,
							answers: questionData.answers,
						},
					},
				},
			});
		}
	}

	if (bulkOperations.length > 0) {
		await Question.bulkWrite(bulkOperations);
	}

	const updatedQuestions = await Question.find();
	return updatedQuestions;
}

module.exports = {
	getAllQuestions,
	getQuestionById,
	updateQuestions,
};
