import React from 'react';
import { Card, Button, Input, Checkbox } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;

export const QuestionEditor = ({ question, index, onRemove, onChange }) => {
	const handleQuestionTextChange = (e) => {
		onChange({
			...question,
			title: e.target.value,
		});
	};

	const handleAddAnswer = () => {
		const newAnswers = [
			...question.answers,
			{ content: 'Новый вариант', isCorrect: false },
		];
		onChange({ ...question, answers: newAnswers });
	};

	const handleRemoveAnswer = (answerIndex) => {
		const newAnswers = [...question.answers];
		newAnswers.splice(answerIndex, 1);
		onChange({ ...question, answers: newAnswers });
	};

	const handleAnswerTextChange = (answerIndex, newText) => {
		const newAnswers = [...question.answers];
		newAnswers[answerIndex].content = newText;
		onChange({ ...question, answers: newAnswers });
	};

	const handleIsCorrectChange = (answerIndex, checked) => {
		const newAnswers = [...question.answers];
		newAnswers[answerIndex].isCorrect = checked;
		onChange({ ...question, answers: newAnswers });
	};

	return (
		<Card
			size="small"
			title={`Вопрос #${index + 1}`}
			style={{ marginBottom: '10px' }}
			extra={
				<Button danger onClick={onRemove}>
					Удалить вопрос
				</Button>
			}
		>
			<div style={{ marginBottom: '10px' }}>
				<Input
					value={question.title}
					onChange={handleQuestionTextChange}
					placeholder="Текст вопроса"
				/>
			</div>

			{question.answers.map((answer, aIndex) => (
				<div
					key={aIndex}
					style={{
						display: 'flex',
						alignItems: 'flex-start',
						gap: '10px',
						marginBottom: '10px',
					}}
				>
					<TextArea
						value={answer.content}
						onChange={(e) => handleAnswerTextChange(aIndex, e.target.value)}
						rows={2}
						autoSize={{ minRows: 2, maxRows: 5 }}
						style={{ width: '100%' }}
						placeholder="Текст ответа"
					/>

					<Checkbox
						checked={answer.isCorrect}
						onChange={(e) => handleIsCorrectChange(aIndex, e.target.checked)}
					/>

					<Button
						shape="circle"
						icon={<DeleteOutlined />}
						danger
						onClick={() => handleRemoveAnswer(aIndex)}
					/>
				</div>
			))}

			<Button
				shape="circle"
				icon={<PlusOutlined />}
				onClick={handleAddAnswer}
				style={{ marginTop: '10px' }}
			/>
		</Card>
	);
};
