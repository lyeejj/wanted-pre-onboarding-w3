import React, { useEffect, useState } from 'react';
import useDebounce from '../hooks/useDebounce';
import { getSearchData } from '../api/api';
import SearchSuggestionBox from './SearchSuggestionBox';
import { SearchWordType } from '../types/searchWord';

function SearchInput() {
	const [searchWord, setSearchWord] = useState('');
	const [selectedIdx, setSelectedIdx] = useState(-1);
	const [recommendWords, setRecommendWords] = useState<SearchWordType[]>([]);
	const debouncedValue = useDebounce(searchWord, 500);

	const handleInputChange = (e: any) => {
		setSearchWord(e.target.value);
	};

	useEffect(() => {
		const handleSearch = async () => {
			const result = await getSearchData(debouncedValue);
			console.log(result);
			setRecommendWords(result.data);
		};

		if (debouncedValue === '') {
			setRecommendWords([]);
			return;
		}

		handleSearch();
	}, [debouncedValue]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const startIdx = 0;
		const endIdx = recommendWords.length - 1;

		if (e.key === 'ArrowUp') {
			setSelectedIdx(selectedIdx > startIdx ? selectedIdx - 1 : endIdx);
		}
		if (e.key === 'ArrowDown') {
			setSelectedIdx(selectedIdx < endIdx ? selectedIdx + 1 : startIdx);
		}
		if (e.key === 'Enter') {
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
				onKeyDown={handleKeyDown}
			/>
			<button>검색</button>
			<SearchSuggestionBox list={recommendWords} selectedIdx={selectedIdx} />
		</>
	);
}
export default SearchInput;
