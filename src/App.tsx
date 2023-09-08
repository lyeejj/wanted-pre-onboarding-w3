import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './constants/constants';
import SearchPage from './pages/SearchPage';
import NotFoundPage from './pages/NotFoundPage';
import { Global } from '@emotion/react';
import { GlobalStyles } from './styles/GlobalStyles';

function App() {
	return (
		<>
			<Global styles={GlobalStyles} />
			<Routes>
				<Route path={ROUTES.MAIN} element={<SearchPage />} />
				<Route path={ROUTES.NOTFOUND} element={<NotFoundPage />} />
			</Routes>
		</>
	);
}

export default App;
