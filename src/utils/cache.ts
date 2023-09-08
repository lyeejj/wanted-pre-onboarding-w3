import { CACHE_NAME } from '../constants/constants';

export const getCacheByKey = async (key: string) => {
	const cache = await caches.open(CACHE_NAME);

	const keys = await cache.keys();
	const cachedResponses = await Promise.all(
		keys.map(async key => {
			return await cache.match(key);
		}),
	);

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
