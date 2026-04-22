import { apiSlice } from '../apiSlice';

export const adminApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            query: () => '/admin/stats',
            providesTags: ['AdminStats', 'Order', 'Product', 'User'],
        }),
        getShops: builder.query({
            query: (filters) => {
                const queryParams = new URLSearchParams();
                if (filters?.area) queryParams.append('area', filters.area);
                if (filters?.paymentTerm) queryParams.append('paymentTerm', filters.paymentTerm);
                if (filters?.isActive !== undefined && filters?.isActive !== '') queryParams.append('isActive', filters.isActive);
                
                return `/admin/shops?${queryParams.toString()}`;
            },
            providesTags: ['User'],
        }),
        updateShopCredit: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/admin/shops/${id}/credit`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User', 'AdminStats'],
        }),
    }),
});

export const {
    useGetDashboardStatsQuery,
    useGetShopsQuery,
    useUpdateShopCreditMutation,
} = adminApi;
