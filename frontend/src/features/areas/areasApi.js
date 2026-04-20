import { apiSlice } from '../apiSlice';


export const areasApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAreas: builder.query({
            query: () => '/areas',
            providesTags: ['Areas'],
        }),
        createArea: builder.mutation({
            query: (data) => ({
                url: '/areas',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Areas'],
        }),
        updateArea: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/areas/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Areas'],
        }),
        deleteArea: builder.mutation({
            query: (id) => ({
                url: `/areas/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Areas'],
        }),
        getAreaStats: builder.query({
            query: (id) => `/areas/${id}/stats`,
            providesTags: (result, error, id) => [{ type: 'Areas', id }],
        }),
    }),
});

export const {
    useGetAreasQuery,
    useCreateAreaMutation,
    useUpdateAreaMutation,
    useDeleteAreaMutation,
    useGetAreaStatsQuery,
} = areasApi;
