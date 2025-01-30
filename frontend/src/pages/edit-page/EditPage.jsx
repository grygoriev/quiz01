import { useEffect, useState } from 'react';
import { getQuiz, updateQuiz } from '../../utils/api.js';
import { useNavigate } from 'react-router-dom';
import { QuestionEditor } from '../../components/QuestionEditor.jsx';
import { Card, Button, Typography, Spin, message } from 'antd';

const { Title } = Typography;

export const EditPage = () => {
	const navigate = useNavigate();
	const [quiz, setQuiz] = useState(null);

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

	const handleAddQuestion = () => {
		setQuiz((prev) => ({
			...prev,
			questions: [
				...prev.questions,
				{
					id: Math.random().toString(36).substr(2, 9),
					title: 'Новый вопрос',
					answers: [{ content: 'Вариант 1', isCorrect: false }],
				},
			],
		}));
	};

	const handleRemoveQuestion = (qIndex) => {
		const updated = [...quiz.questions];
		updated.splice(qIndex, 1);
		setQuiz((prev) => ({ ...prev, questions: updated }));
	};

	const handleSave = async () => {
		try {
			const updated = await updateQuiz(quiz);
			setQuiz(updated);
			navigate('/');
		} catch (err) {
			message.error('Ошибка сохранения');
		}
	};

	return (
		<Card style={{ maxWidth: 800, margin: '0 auto' }}>
			<div style={{ margin: '10px' }}>
				<Title level={3}>Редактирование теста</Title>
			</div>

			{quiz.questions.map((question, index) => (
				<QuestionEditor
					key={question.id || index}
					index={index}
					question={question}
					onRemove={() => handleRemoveQuestion(index)}
					onChange={(updatedQuestion) => {
						const updated = [...quiz.questions];
						updated[index] = updatedQuestion;
						setQuiz((prev) => ({ ...prev, questions: updated }));
					}}
				/>
			))}

			<div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
				<Button onClick={handleAddQuestion}>Добавить вопрос</Button>
				<Button type="primary" onClick={handleSave}>
					Сохранить
				</Button>
				<Button onClick={() => navigate('/')}>Назад</Button>
			</div>
		</Card>
	);
};
