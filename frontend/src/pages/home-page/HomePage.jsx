import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Card, List } from 'antd';

const { Title } = Typography;

export const HomePage = () => {
	const [attempts, setAttempts] = useState([]);

	useEffect(() => {
		const stored = localStorage.getItem('quizAttempts');
		if (stored) {
			setAttempts(JSON.parse(stored));
		}
	}, []);

	return (
		<Card style={{ maxWidth: 700, margin: '0 auto' }}>
			<Title level={2}>Главная страница</Title>

			<div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
				<Link to="/quiz">
					<Button type="primary">Запустить тест</Button>
				</Link>
				<Link to="/edit">
					<Button>Редактировать тест</Button>
				</Link>
			</div>

			<Title level={4}>История прохождений</Title>

			{attempts.length === 0 ? (
				<p>Пока нет результатов</p>
			) : (
				<List
					bordered
					dataSource={attempts}
					renderItem={(item) => (
						<List.Item>
							Дата: {item.date}, вопросов: {item.totalQuestions}, верно:{' '}
							{item.correctAnswers}
						</List.Item>
					)}
				/>
			)}
		</Card>
	);
};
