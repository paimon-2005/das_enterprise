import { apiSlice } from '../apiSlice';

export const productsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (params) => ({
                url: '/products',
                params: { ...params },
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.data.map(({ _id }) => ({ type: 'Product', id: _id })),
                          { type: 'Product', id: 'LIST' },
                      ]
                    : [{ type: 'Product', id: 'LIST' }],
        }),
        getProduct: builder.query({
            query: (slug) => `/products/${slug}`,
            providesTags: (result, error, slug) => [{ type: 'Product', id: slug }],
        }),
        createProduct: builder.mutation({
            query: (data) => ({
                url: '/products',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{ type: 'Product', id: 'LIST' }, { type: 'AdminStats', id: 'LIST' }],
        }),
        updateProduct: builder.mutation({
            query: ({ id, data }) => ({
                url: `/products/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Product', id },
                { type: 'Product', id: 'LIST' },
            ],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Product', id: 'LIST' }, { type: 'AdminStats', id: 'LIST' }],
        }),
        updateStock: builder.mutation({
            query: ({ id, stock }) => ({
                url: `/products/${id}/stock`,
                method: 'PATCH',
                body: { stock },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Product', id },
                { type: 'Product', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useUpdateStockMutation,
} = productsApi;
