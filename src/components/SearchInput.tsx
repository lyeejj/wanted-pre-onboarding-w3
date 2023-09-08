import React, { useEffect, useState } from 'react';
import useDebounce from '../hooks/useDebounce';
import { getSearchData } from '../api/api';
import SearchSuggestionBox from './SearchSuggestionBox';
import { SearchWordType } from '../types/searchWord';
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
		<>
			<input
				type="text"
				value={searchWord}
				onChange={handleInputChange}
				placeholder="질환명을 입력해 주세요."
				onFocus={() => setShowSuggestionBox(true)}
				onBlur={() => setShowSuggestionBox(false)}
				onKeyDown={handleKeyDown}
			/>
			<button>검색</button>
			<SearchSuggestionBox
				list={recommendWords}
				selectedIdx={selectedIdx}
				showSuggestionBox={showSuggestionBox}
			/>
		</>
	);
}
export default SearchInput;
