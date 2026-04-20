import { apiSlice } from '../apiSlice';

export const dealersApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDealers: builder.query({
            query: (params) => ({
                url: '/dealers',
                params,
            }),
            providesTags: ['Dealers'],
        }),
        getDealer: builder.query({
            query: (id) => `/dealers/${id}`,
            providesTags: (result, error, id) => [{ type: 'Dealers', id }],
        }),
        approveDealer: builder.mutation({
            query: (id) => ({
                url: `/dealers/${id}/approve`,
                method: 'PUT',
            }),
            invalidatesTags: (result, error, id) => ['Dealers', { type: 'Dealers', id }],
        }),
        rejectDealer: builder.mutation({
            query: (id) => ({
                url: `/dealers/${id}/reject`,
                method: 'PUT',
            }),
            invalidatesTags: (result, error, id) => ['Dealers', { type: 'Dealers', id }],
        }),
        updateDealerCredit: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/dealers/${id}/credit`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['Dealers', { type: 'Dealers', id }],
        }),
        getDealerOrders: builder.query({
            query: (id) => `/dealers/${id}/orders`,
            providesTags: (result, error, id) => [{ type: 'Orders', id }],
        }),
    }),
});

export const {
    useGetDealersQuery,
    useGetDealerQuery,
    useApproveDealerMutation,
    useRejectDealerMutation,
    useUpdateDealerCreditMutation,
    useGetDealerOrdersQuery,
} = dealersApi;
