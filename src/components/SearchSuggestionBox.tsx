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
				<SearchListContainer>
					<SubTitle>추천검색어</SubTitle>
					<SearchList>
						{!isListEmpty ? (
							list.map((word: SearchWordType, idx: number) => (
								<RecommendItem key={word.sickCd} className={selectedIdx === idx ? 'selected' : ''}>
									{word.sickNm}
								</RecommendItem>
							))
						) : (
							<EmptyList>추천검색어가 없습니다.</EmptyList>
						)}
					</SearchList>
				</SearchListContainer>
			)}
		</>
	);
}
export default SearchSuggestionBox;

const SearchListContainer = styled.div`
	width: 50vw;
	margin: 0 auto;
	margin-top: 10px;
	box-sizing: border-box;
	padding: 20px;
	background-color: #fff;
	border-radius: 20px;
`;

const SubTitle = styled.p`
	color: #6a737b;
	font-size: 13px;
`;

const SearchList = styled.ul`
	margin-top: 20px;
`;

const EmptyList = styled.p`
	color: #6a737b;
	margin-top: 20px;
`;

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
