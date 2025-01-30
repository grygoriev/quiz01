const express = require('express');
const Question = require('../models/Question');
const { mapAnswersForDB, mapAnswersForClient } = require('../helpers/mapAnswer');
const router = express.Router();

/**
 * @route GET /api/questions
 * @desc Получить список всех вопросов
 */
router.get('/', async (req, res) => {
	try {
		const questions = await Question.find();
		const mappedQuestions = questions.map((q) => ({
			_id: q._id,
			title: q.title,
			answers: mapAnswersForClient(q.answers),
		}));

		res.json({ questions: mappedQuestions });
	} catch (error) {
		res.status(500).json({ error: 'Ошибка сервера' });
	}
});

/**
 * @route PATCH /api/questions
 * @desc Массовое обновление всех вопросов и ответов (полностью заменяет список)
 */
router.patch('/', async (req, res) => {
	try {
		const { questions } = req.body;

		if (!Array.isArray(questions) || questions.length === 0) {
			return res
				.status(400)
				.json({ error: 'Список вопросов не может быть пустым' });
		}

		const newIds = questions.map((q) => q._id).filter(Boolean);
		const totalQuestions = await Question.countDocuments();
		if (totalQuestions > 1) {
			await Question.deleteMany({ _id: { $nin: newIds } });
		}

		const updatePromises = questions.map(({ _id, title, answers }) => {
			const formattedAnswers = mapAnswersForDB(answers); // Конвертируем ответы

			if (!_id || _id.startsWith('new_')) {
				return Question.create({ title, answers: formattedAnswers });
			} else {
				return Question.findByIdAndUpdate(
					_id,
					{ title, answers: formattedAnswers },
					{ new: true },
				);
			}
		});

		const updatedQuestions = await Promise.all(updatePromises);
		res.json({
			questions: updatedQuestions.map((q) => ({
				_id: q._id,
				title: q.title,
				answers: mapAnswersForClient(q.answers), // Конвертируем обратно
			})),
		});
	} catch (error) {
		res.status(500).json({ error: 'Ошибка сервера' });
	}
});

module.exports = router;
