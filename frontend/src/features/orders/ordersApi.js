import { apiSlice } from '../apiSlice';

export const ordersApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (orderData) => ({
                url: '/orders',
                method: 'POST',
                body: orderData,
            }),
            invalidatesTags: ['Order', 'User'],
        }),
        getMyOrders: builder.query({
            query: () => '/orders/my-orders',
            providesTags: ['Order'],
        }),
        getAllOrders: builder.query({
            query: (params) => ({
                url: '/orders',
                params,
            }),
            providesTags: ['Order'],
        }),
        getOrderById: builder.query({
            query: (id) => `/orders/${id}`,
            providesTags: (result, error, id) => [{ type: 'Order', id }],
        }),
        updateOrderStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/orders/${id}/status`,
                method: 'PUT',
                body: { status },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }, 'Order'],
        }),
        updatePaymentStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/orders/${id}/payment`,
                method: 'PUT',
                body: { status },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }, 'Order', 'User'],
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetMyOrdersQuery,
    useGetAllOrdersQuery,
    useGetOrderByIdQuery,
    useUpdateOrderStatusMutation,
    useUpdatePaymentStatusMutation,
} = ordersApi;
