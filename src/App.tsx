import SearchPage from './pages/SearchPage';
import { Global } from '@emotion/react';
import { GlobalStyles } from './styles/GlobalStyles';

function App() {
	return (
		<>
			<Global styles={GlobalStyles} />
			<SearchPage />
		</>
	);
}
export default App;
