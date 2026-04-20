import { apiSlice } from '../apiSlice';
import { CONFIG } from '../../app/config';

export const adminApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAdminStats: builder.query({
            query: () => '/admin/stats',
            providesTags: ['AdminStats'],
        }),
        getRevenueHistory: builder.query({
            query: (period) => `/admin/revenue?period=${period}`,
        }),
        getAdminOrders: builder.query({
            query: () => '/admin/orders',
            providesTags: ['Order'],
        }),
        updateOrderStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/admin/orders/${id}/status`,
                method: 'PUT',
                body: { status },
            }),
            invalidatesTags: ['Order', 'AdminStats'],
        }),
        getAdminStock: builder.query({
            query: () => '/admin/stock',
            providesTags: ['Product'],
        }),
        updateStock: builder.mutation({
            query: ({ id, stock }) => ({
                url: `/admin/stock/${id}`,
                method: 'PUT',
                body: { stock },
            }),
            invalidatesTags: ['Product'],
        }),
        getAdminCustomers: builder.query({
            query: () => '/admin/customers',
            providesTags: ['User'],
        }),
    }),
});

export const {
    useGetAdminStatsQuery,
    useGetRevenueHistoryQuery,
    useGetAdminOrdersQuery,
    useUpdateOrderStatusMutation,
    useGetAdminStockQuery,
    useUpdateStockMutation,
    useGetAdminCustomersQuery,
} = adminApi;

