import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { QuizPage, EditPage, HomePage } from './pages';

const { Header, Content, Footer } = Layout;

export const App = () => {
	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Header>
				<Menu
					theme="dark"
					mode="horizontal"
					selectable={false}
					items={[
						{ key: 'home', label: <Link to="/">Главная</Link> },
						{ key: 'quiz', label: <Link to="/quiz">Пройти тест</Link> },
						{ key: 'edit', label: <Link to="/edit">Редактировать</Link> },
					]}
				/>
			</Header>
			<Content style={{ padding: '24px' }}>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/quiz" element={<QuizPage />} />
					<Route path="/edit" element={<EditPage />} />
				</Routes>
			</Content>
			<Footer style={{ textAlign: 'center' }}>
				Quiz App ©2025 Created by Vladimir
			</Footer>
		</Layout>
	);
};
