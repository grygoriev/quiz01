const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
	content: String,
	is_correct: Boolean,
});

const QuestionSchema = new mongoose.Schema({
	title: String,
	answers: [AnswerSchema], // Вопрос содержит массив ответов
});

module.exports = mongoose.model('Question', QuestionSchema);
