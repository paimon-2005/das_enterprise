import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api/v1',
    prepareHeaders: (headers, { getState }) => {
        const token = localStorage.getItem('token');
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery,
    tagTypes: ['Product', 'Order', 'User', 'Category', 'Cart', 'Review', 'AdminStats', 'Areas', 'Dealers'],

    endpoints: (builder) => ({}),
});
