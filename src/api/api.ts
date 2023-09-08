import axios from 'axios';
import { getCacheByKey, setCacheByExpireTime } from '../utils/cache';
import { CACHE_DELETE_TIME, URL } from '../constants/constants';

export const axiosInstance = axios.create({
	baseURL: URL,
});

export const getSearchData = async (query: string) => {
	try {
		const cacheItem = await getCacheByKey(query);

		if (cacheItem) {
			return cacheItem;
		}

		console.info('calling api');
		const response = await axiosInstance.get(`?q=${query}`);

		setCacheByExpireTime({ key: query, value: response.data, expireTime: CACHE_DELETE_TIME });
		return response.data;
	} catch (error: any) {
		return error.message;
	}
};
