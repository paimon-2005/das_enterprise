import { apiSlice } from '../apiSlice';

export const ordersApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: '/orders',
                method: 'POST',
                body: order,
            }),
            invalidatesTags: ['Order', 'AdminStats', 'Dealers', 'Areas'],
        }),
        getMyOrders: builder.query({
            query: () => '/orders/mine',
            providesTags: ['Order'],
        }),
        getOrderDetails: builder.query({
            query: (id) => `/orders/${id}`,
            providesTags: (result, error, id) => [{ type: 'Order', id }],
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetMyOrdersQuery,
    useGetOrderDetailsQuery,
} = ordersApi;
