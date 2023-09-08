import React, { useEffect, useState } from 'react';
import useDebounce from '../hooks/useDebounce';
import { getSearchData } from '../api/api';
import SearchSuggestionBox from './SearchSuggestionBox';
import { SearchWordType } from '../types/searchWord';
import styled from '@emotion/styled';
import { DEBOUNCE_DELAY_TIME, MAX_SEARCH_LIST_NUM } from '../constants/constants';

function SearchInput() {
	const [searchWord, setSearchWord] = useState('');
	const [selectedIdx, setSelectedIdx] = useState(-1);
	const [recommendWords, setRecommendWords] = useState<SearchWordType[]>([]);
	const [showSuggestionBox, setShowSuggestionBox] = useState(false);
	const debouncedValue = useDebounce(searchWord, DEBOUNCE_DELAY_TIME);

	const handleInputChange = (e: any) => {
		setSearchWord(e.target.value);
	};

	useEffect(() => {
		const axiosSick = async () => {
			const data = await getSearchData(debouncedValue);
			setRecommendWords(data.slice(0, MAX_SEARCH_LIST_NUM));
		};
		if (!debouncedValue) {
			return setRecommendWords([]);
		}
		axiosSick();
	}, [debouncedValue]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (recommendWords.length === 0) return;
		const startIdx = 0;
		const endIdx = recommendWords.length - 1;

		if (e.key === 'ArrowUp') {
			if (e.nativeEvent.isComposing) return;
			setSelectedIdx(selectedIdx > startIdx ? selectedIdx - 1 : endIdx);
		}
		if (e.key === 'ArrowDown') {
			if (e.nativeEvent.isComposing) return;
			setSelectedIdx(selectedIdx < endIdx ? selectedIdx + 1 : startIdx);
		}
		if (e.key === 'Enter' && selectedIdx !== -1) {
			setSearchWord(recommendWords[selectedIdx].sickNm);
			setSelectedIdx(-1);
		}
	};

	return (
		<SearchContainer>
			<SearchBar>
				<SearchBarInput
					type="text"
					value={searchWord}
					onChange={handleInputChange}
					placeholder="검색어를 입력해 주세요."
					onFocus={() => setShowSuggestionBox(true)}
					onBlur={() => setShowSuggestionBox(false)}
					onKeyDown={handleKeyDown}
				/>
				<SearchBarButton>검색</SearchBarButton>
			</SearchBar>
			<SearchSuggestionBox
				list={recommendWords}
				selectedIdx={selectedIdx}
				showSuggestionBox={showSuggestionBox}
			/>
		</SearchContainer>
	);
}
export default SearchInput;

const SearchContainer = styled.div`
	width: 100%;
	height: 100vh;
	margin: 0 auto;
	padding-top: 90px;
	background-color: rgb(212, 232, 253);
`;

const SearchBar = styled.div`
	width: 50vw;
	margin: 0 auto;

	display: flex;
	border-radius: 80px;
	height: 75px;
`;

const SearchBarInput = styled.input`
	flex-grow: 1;
	padding-left: 30px;
	border: 0;
	outline: 0;
	background-color: #fff;
	border-radius: 80px 0 0 80px;
	font-size: 18px;
	border: 1px solid #fff;

	&:focus {
		border: 1px solid #457ae5;
	}
`;

const SearchBarButton = styled.button`
	width: 100px;
	border-radius: 0 80px 80px 0;
	border: 0;
	outline: 0;
	padding-right: 16px;
	font-size: 18px;
	color: #fff;
	background-color: #457ae5;
	font-weight: bold;
	cursor: pointer;

	&:hover {
		background-color: #1f4084;
	}
`;
