import { SearchWordType } from '../types/searchWord';

function SearchSuggestionBox({ list }: { list: any }) {
	const isListEmpty = !list.length;
	return (
		<>
			<p>추천검색어</p>
			<ul>
				{!isListEmpty ? (
					list.map((word: SearchWordType) => <li key={word.sickCd}>{word.sickNm}</li>)
				) : (
					<p>추천검색어가 없습니다.</p>
				)}
			</ul>
		</>
	);
}
export default SearchSuggestionBox;
