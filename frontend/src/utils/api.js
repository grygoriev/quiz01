const API_URL = 'http://localhost:3001/api';

export async function getQuiz() {
	const res = await fetch(`${API_URL}/questions`);
	return res.json();
}

export async function updateQuiz(quizData) {
	const res = await fetch(`${API_URL}/questions`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(quizData),
	});
	return res.json();
}
