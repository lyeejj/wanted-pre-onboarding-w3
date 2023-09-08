import { SearchWordType } from '../types/searchWord';
import styled from '@emotion/styled';

interface SearchSuggestionBoxProps {
	list: SearchWordType[];
	selectedIdx?: number;
	showSuggestionBox: boolean;
}

function SearchSuggestionBox({ list, selectedIdx, showSuggestionBox }: SearchSuggestionBoxProps) {
	const isListEmpty = !list?.length;

	return (
		<>
			{showSuggestionBox && (
				<>
					<p>추천검색어</p>
					<ul>
						{!isListEmpty ? (
							list.map((word: SearchWordType, idx: number) => (
								<RecommendItem key={word.sickCd} className={selectedIdx === idx ? 'selected' : ''}>
									{word.sickNm}
								</RecommendItem>
							))
						) : (
							<p>추천검색어가 없습니다.</p>
						)}
					</ul>
				</>
			)}
		</>
	);
}
export default SearchSuggestionBox;

const RecommendItem = styled.li`
	padding: 10px;
	display: flex;
	align-items: center;
	cursor: pointer;
	&:hover,
	&.selected {
		background-color: #e9e9e9;
	}
`;
