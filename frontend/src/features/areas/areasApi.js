import { apiSlice } from '../apiSlice';

export const areasApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAreas: builder.query({
            query: () => '/areas',
            providesTags: ['Area'],
            transformResponse: (response) => response.areas,
        }),
        createArea: builder.mutation({
            query: (data) => ({
                url: '/areas',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Area'],
        }),
        updateArea: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/areas/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Area'],
        }),
        deleteArea: builder.mutation({
            query: (id) => ({
                url: `/areas/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Area'],
        }),
    }),
});

export const {
    useGetAreasQuery,
    useCreateAreaMutation,
    useUpdateAreaMutation,
    useDeleteAreaMutation,
} = areasApi;
