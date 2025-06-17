import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import queryString from 'query-string'
import useToken from '~/app/store/useToken'

import { MUTATION_PATH_TO_INVALIDATIONS } from './invalidations'

export const STALE_TIME_5M = 1000 * 60 * 5
export const STALE_TIME_1M = 1000 * 60

const FOUR_HUNDREDS = [400, 401, 403, 409, 500]

/**
 * Performs an HTTP request to the API with the specified options.
 *
 * @param {Object} params - The parameters for the API request.
 * @param {Object} [params.payload] - The data to send in the request body (for POST, PUT, PATCH methods).
 * @param {string} params.method - The HTTP method to use (e.g., GET, POST, PUT, PATCH, DELETE).
 * @param {string} params.url - The API endpoint URL.
 * @param {string} [params.token] - The authentication token to include in the Authorization header.
 * @param {string} [params.contentType='application/json'] - The Content-Type of the request body (e.g., 'application/json', 'text/csv').
 *
 * @returns {Promise<Object>} - The API response containing the status and data.
 * @throws {Object} - Throws an error object if the response status is in the 400 or 500 range.
 *
 */
export const apiFetch = async ({
  payload,
  method,
  url,
  token,
  contentType,
}) => {
  const options = {
    method,
    headers: {
      'Content-Type': contentType ?? 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
  }
  if (method !== 'GET') {
    options.body = JSON.stringify(payload)
  }
  const response = await fetch(url, options)
  if (FOUR_HUNDREDS.includes(response.status)) {
    const data = await response.json()
    throw data
  }
  const data = await response.json()
  return data
}

/**
 * Custom hook for making API queries using React Query
 * @param {Object} params - The parameters object
 * @param {string} params.path - The API endpoint path
 * @param {Object} [params.payload={}] - The query parameters object
 * @param {Object} [params.opts={}] - Additional options
 * @param {Object} [params.opts.queryOptions={}] - React Query options
 * @param {Array} [params.opts.queryOptions.queryKey] - Custom query key for React Query
 * @param {Function} [params.opts.queryOptions.queryFn] - Custom query function
 * @returns {UseQueryResult} React Query result object containing data, loading state, and error state
 */
export const useApiQuery = ({ path, payload = {}, opts = {} }) => {
  const { queryOptions = {}, ...options } = opts
  const token = useToken(state => state.token)

  const url = `/api/${path}`
  const queryParams = queryString.stringify(payload)

  return useQuery({
    staleTime: STALE_TIME_5M,
    ...queryOptions,
    queryKey: queryOptions.queryKey ?? [path, queryParams],
    queryFn: queryOptions.queryFn
      ? () => queryOptions.queryFn(apiFetch)
      : () => apiFetch({ url, payload, method: 'GET', token, ...options }),
  })
}

/**
 * Custom hook for making API mutations using React Query
 * @param {Object} params - The parameters object
 * @param {string} params.path - The API endpoint path
 * @param {Object} [params.opts={}] - Additional options
 * @param {string} params.opts.method - HTTP method to use (must be one of: POST, PUT, PATCH)
 * @returns {UseMutationResult} React Query mutation result object containing mutate function, loading state, and error state
 */
export const useApiMutation = ({ path, opts ={} }) => {
  const ALLOWED_METHODS = ['POST', 'PUT', 'PATCH']
  if(!ALLOWED_METHODS.includes(opts.method)) {
    throw new TypeError(`Error: useApiMutation does not support method: ${opts.method}`)
  }

  const token = useToken(state => state.token)
  const url = `/api/${path}/`
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: payload => apiFetch({ url, payload, method: opts.method, token,...opts }),
    onSuccess: (_, payload) => {
      const getQueryKeys = MUTATION_PATH_TO_INVALIDATIONS[path]
      if (!getQueryKeys) return
      const queryKeys = getQueryKeys(payload)
      queryKeys.forEach(queryKey => queryClient.invalidateQueries({ queryKey }))
    }
  })
}

/**
 * Custom hook for making API DELETE requests using React Query
 * @param {Object} params - The parameters object
 * @param {string} params.path - The API endpoint path
 * @param {Object} [params.opts={}] - Additional options for the request
 * @returns {UseMutationResult} React Query mutation result object containing mutate function, loading state, and error state
 */
export const useApiDelete = ({ path, opts ={} }) => {
  const token = useToken(state => state.token)
  const url = `/api/${path}/`
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: payload => apiFetch({ url, payload, method: 'DELETE', token,...opts }),
    onSuccess: (_, payload) => {
      const getQueryKeys = MUTATION_PATH_TO_INVALIDATIONS[path]
      if (!getQueryKeys) return
      const queryKeys = getQueryKeys(payload)
      queryKeys.forEach(queryKey => queryClient.invalidateQueries({ queryKey }))
    }
  })
}
