import { useEffect, useState } from 'react';
import { getQuiz } from '../../utils/api.js';
import { useNavigate } from 'react-router-dom';
import { Card, Radio, Typography, Button, Spin, message } from 'antd';

const { Title, Paragraph } = Typography;

export const QuizPage = () => {
	const navigate = useNavigate();
	const [quiz, setQuiz] = useState(null);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedAnswers, setSelectedAnswers] = useState({});
	const [isFinished, setIsFinished] = useState(false);
	const [result, setResult] = useState(null);

	useEffect(() => {
		(async () => {
			try {
				const data = await getQuiz();
				setQuiz(data);
			} catch (err) {
				message.error('Ошибка загрузки теста');
			}
		})();
	}, []);

	if (!quiz) {
		return (
			<div style={{ textAlign: 'center', marginTop: '50px' }}>
				<Spin tip="Загрузка теста..." />
			</div>
		);
	}

	const questions = quiz.questions || [];
	const totalQuestions = questions.length;

	// Выбор ответа (один вариант)
	const handleSelectAnswer = (questionIndex, answerIndex) => {
		setSelectedAnswers((prev) => ({
			...prev,
			[questionIndex]: [answerIndex],
		}));
	};

	const handleNext = () => {
		if (currentQuestionIndex < totalQuestions - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else {
			finishQuiz();
		}
	};

	const handlePrev = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex(currentQuestionIndex - 1);
		}
	};

	const finishQuiz = () => {
		let correctCount = 0;
		questions.forEach((q, qIndex) => {
			const correctAnswersIndexes = q.answers
				.map((a, i) => (a.isCorrect ? i : null))
				.filter((i) => i !== null);

			const userAnswers = selectedAnswers[qIndex] || [];
			const isCorrect =
				userAnswers.length === correctAnswersIndexes.length &&
				userAnswers.every((idx) => correctAnswersIndexes.includes(idx));

			if (isCorrect) correctCount++;
		});

		setResult(correctCount);
		setIsFinished(true);

		const attemptRecord = {
			date: new Date().toLocaleString(),
			totalQuestions: totalQuestions,
			correctAnswers: correctCount,
		};
		const stored = localStorage.getItem('quizAttempts');
		const attempts = stored ? JSON.parse(stored) : [];
		attempts.push(attemptRecord);
		localStorage.setItem('quizAttempts', JSON.stringify(attempts));
	};

	if (isFinished) {
		return (
			<Card style={{ maxWidth: 700, margin: '0 auto' }}>
				<Title level={3}>Результат</Title>
				<Paragraph>
					Верных ответов: {result} из {totalQuestions}
				</Paragraph>
				<div style={{ display: 'flex', gap: '10px' }}>
					<Button type="primary" onClick={() => navigate('/')}>
						На главную
					</Button>
					<Button
						onClick={() => {
							setCurrentQuestionIndex(0);
							setSelectedAnswers({});
							setIsFinished(false);
							setResult(null);
						}}
					>
						Пройти ещё раз
					</Button>
				</div>
			</Card>
		);
	}

	const question = questions[currentQuestionIndex];
	const chosenAnswer = selectedAnswers[currentQuestionIndex] || [];

	return (
		<Card style={{ maxWidth: 700, margin: '0 auto' }}>
			<Title level={3}>Прохождение теста</Title>
			<Paragraph>
				Вопрос {currentQuestionIndex + 1} из {totalQuestions}
			</Paragraph>
			<Title level={4}>{question.title}</Title>

			<Radio.Group
				value={chosenAnswer[0]}
				onChange={(e) => handleSelectAnswer(currentQuestionIndex, e.target.value)}
				style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
			>
				{question.answers.map((ans, i) => (
					<Radio key={i} value={i}>
						{ans.content}
					</Radio>
				))}
			</Radio.Group>

			<div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
				<Button onClick={handlePrev} disabled={currentQuestionIndex === 0}>
					Предыдущий
				</Button>
				<Button
					type="primary"
					onClick={handleNext}
					disabled={chosenAnswer.length === 0}
				>
					{currentQuestionIndex === totalQuestions - 1
						? 'Завершить'
						: 'Следующий'}
				</Button>
			</div>
		</Card>
	);
};
