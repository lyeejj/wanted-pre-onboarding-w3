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

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {};

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
			<SearchSuggestionBox list={recommendWords} />
		</>
	);
}
export default SearchInput;
