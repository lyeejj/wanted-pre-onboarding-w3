import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

export const axiosInstance = axios.create({
	baseURL: BASE_URL,
});

export const getSearchData = async (value: string) => {
	try {
		const response = await axiosInstance.get('/sick', {
			params: {
				q: value,
			},
		});
		return response;
	} catch (error: any) {
		return error.message;
	}
};
