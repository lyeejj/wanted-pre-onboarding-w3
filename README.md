# wanted-pre-onboarding-w3

## 실행 방법

```jsx
npm install
npm run server // json-server 실행
npm start // client 실행
```

## 주요 기능

- 검색시 API 호출 통해서 검색어 추천 기능 구현
- API 호출 로컬 캐싱 구현 + expire time 구현 추가
- 입력마다 API 호출하지 않도록 검색 디바운싱 기능 구현
- 키보드 이동으로 추천 검색어들로 이동 가능하도록 구현

## 기술 스택 및 사용한 라이브러리

기술 스택 :
<img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white"/>
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white"/>
<img src="https://img.shields.io/badge/emotion-DB7093?style=flat-square&logo=Emotion&logoColor=white"/>
<img src="https://img.shields.io/badge/eslint-4B32C3?style=flat-square&logo=eslint&logoColor=white"/>
<img src="https://img.shields.io/badge/prettier-F7B93E?style=flat-square&logo=prettier&logoColor=white"/>

추가 라이브러리 : axios, react-router-dom, json-server

## 폴더 구조

```
📦src
 ┣ 📂api
 ┃ ┗ 📜api.ts
 ┣ 📂components
 ┃ ┣ 📜SearchInput.tsx
 ┃ ┗ 📜SearchSuggestionBox.tsx
 ┣ 📂constants
 ┃ ┗ 📜constants.ts
 ┣ 📂hooks
 ┃ ┗ 📜useDebounce.ts
 ┣ 📂pages
 ┃ ┣ 📜NotFoundPage.tsx
 ┃ ┗ 📜SearchPage.tsx
 ┣ 📂styles
 ┃ ┗ 📜GlobalStyles.ts
 ┣ 📂types
 ┃ ┗ 📜searchWord.ts
 ┣ 📂utils
 ┃ ┗ 📜cache.ts
 ┣ 📜App.tsx
 ┣ 📜declaration.d.ts
 ┗ 📜index.tsx
```

## 구현 코드

### 1. 디바운싱

```ts
import { useEffect, useState } from 'react';

const useDebounce = (value: string, delay: number) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay || 500);

		return () => clearTimeout(timer);
	}, [value]);

	return debouncedValue;
};

export default useDebounce;
```

- 연속적으로 이벤트가 발생할 때 마지막으로 발생한 이벤트를 기준으로 특정 시간이 지난 후 하나의 이벤트만 실행합니다
- useDebounce 커스텀훅을 생성하여 검색 디바운싱 구현
- setTimeout 사용하여 일정 대기시간 지정
- 검색 디바운싱을 통해 입력마다 API 호출하지 않도록 설정

### 2. 로컬 캐싱

```tsx
export const getCacheByKey = async (key: string) => {
	const cache = await caches.open(CACHE_NAME);
  ...
	await Promise.all(
		cachedResponses.map(async (response, index) => {
			if (response && response.ok) {
				try {
					const jsonData = await response.json();
					if (jsonData.expiry < new Date().getTime()) {
						cache.delete(keys[index]);
					}
				} catch (error) {
					return false;
				}
			}
		}),
	);
	const cachedResponse = await cache.match(key);

	if (cachedResponse) {
		const cachedData = await cachedResponse.json();
		return cachedData.value;
	}

	return null;
};

export const setCacheByExpireTime = async ({
	key,
	value,
	expireTime = 0,
}: {
	key: string;
	value: string;
	expireTime: number;
}) => {
	const cache = await caches.open(CACHE_NAME);
	const item = {
		value,
		expiry: new Date().getTime() + expireTime,
	};
	const response = new Response(JSON.stringify(item));
	await cache.put(key, response);
};
```

- getCacheByKey, setCacheByExpireTime로 캐싱된 값을 가져오고 저장하는 함수 모듈화
- 키값을 통해 캐시스토리지에 값이 있으면 캐시데이터를 제공하고 없으면 새로운 API 요청과 캐시데이터를 저장합니다
- 설정한 expireTime을 통해 요청했을때의 시간을 비교하여 만료가 되었는지 확인
- console.info('calling api'); 를 통해 API 호출 횟수 확인 가능

### 3. 키보드를 이용한 검색어 이동

```tsx
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
```

- useState를 사용하여 추천검색어 데이터 배열의 index를 활용한 구현
- 키보드의 ArrowUp, ArrowDown, Enter 키를 통해 이동
- Enter키 키보드 입력시에는 해당인덱스값에 매칭된 데이터가 검색어에 입력되고 selectedIdx 초기화
- selectIdx와 일치한 인덱스를 가진 배열 아이템의 값은 배경색을 통해 포커싱된것처럼 표시
