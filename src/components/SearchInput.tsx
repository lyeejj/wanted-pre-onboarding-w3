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
			const URL = `http://localhost:4000/sick?q=${debouncedValue}`;
			const cacheStorage = await caches.open('search');
			const responsedChache = await cacheStorage.match(URL);
			try {
				if (responsedChache) {
					const cahcedData = await responsedChache.json();
					setRecommendWords(cahcedData.data);
				} else {
					const response = await getSearchData(debouncedValue);
					console.info('calling api');
					const clonedResponse = new Response(JSON.stringify(response));
					await cacheStorage.put(URL, clonedResponse);
					setRecommendWords(response.data);
				}
			} catch (error) {
				console.log(error);
			}
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
				onKeyDown={handleKeyDown}
			/>
			<button>검색</button>
			<SearchSuggestionBox list={recommendWords} selectedIdx={selectedIdx} />
		</>
	);
}
export default SearchInput;
