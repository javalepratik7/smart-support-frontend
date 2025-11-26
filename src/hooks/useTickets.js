import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/axios'
import toast from 'react-hot-toast'

// Fetch tickets with filters and pagination
export const useTickets = (filters, pagination) => {
  const params = {
    page: pagination.page,
    limit: pagination.limit,
    ...filters
  }

  // Remove empty filters
  Object.keys(params).forEach(key => {
    if (!params[key]) delete params[key]
  })

  return useQuery({
    queryKey: ['tickets', params],
    queryFn: async () => {
      const { data } = await api.get('/tickets', { params })
      return data
    },
    refetchInterval: 10000, // Auto-refresh every 10 seconds
    keepPreviousData: true,
    refetchOnWindowFocus: true,
    staleTime: 5000,
  })
}

// Fetch single ticket
export const useTicket = (id) => {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: async () => {
      const { data } = await api.get(`/tickets/${id}`)
      return data
    },
    enabled: !!id,
  })
}

// Update ticket mutation with optimistic updates - FIXED
export const useUpdateTicket = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data } = await api.patch(`/tickets/${id}`, updates)
      return data
    },
    onMutate: async ({ id, updates }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(['tickets'])
      await queryClient.cancelQueries(['ticket', id])

      // Snapshot the previous value
      const previousTickets = queryClient.getQueryData(['tickets'])
      const previousTicket = queryClient.getQueryData(['ticket', id])

      // Optimistically update to the new value
      if (previousTickets) {
        queryClient.setQueryData(['tickets'], old => ({
          ...old,
          tickets: old.tickets.map(ticket =>
            ticket._id === id ? { ...ticket, ...updates, updating: true } : ticket
          )
        }))
      }

      if (previousTicket) {
        queryClient.setQueryData(['ticket', id], old => ({
          ...old,
          ...updates,
          updating: true
        }))
      }

      return { previousTickets, previousTicket }
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousTickets) {
        queryClient.setQueryData(['tickets'], context.previousTickets)
      }
      if (context?.previousTicket) {
        queryClient.setQueryData(['ticket', id], context.previousTicket)
      }
      toast.error('Failed to update ticket')
    },
    onSuccess: (responseData, { id }) => {
      // FIX: Add safety check for undefined data
      const updatedTicket = responseData.ticket;
      
      // Safely update tickets list
      queryClient.setQueryData(['tickets'], old => {
        // If no data exists, return undefined (let React Query refetch)
        if (!old || !old.tickets) {
          console.warn('No tickets data found in cache, skipping update');
          return old;
        }
        
        return {
          ...old,
          tickets: old.tickets.map(ticket =>
            ticket._id === id ? { ...updatedTicket, updating: false } : ticket
          )
        }
      })
      
      // Safely update single ticket
      queryClient.setQueryData(['ticket', id], old => {
        if (!old) {
          console.warn('No ticket data found in cache, skipping update');
          return { ...updatedTicket, updating: false };
        }
        
        return {
          ...updatedTicket,
          updating: false
        }
      })
      
      toast.success(responseData.message || 'Ticket updated successfully')
    },
    onSettled: (data, error, { id }) => {
      // Always refetch after error or success to ensure data consistency
      queryClient.invalidateQueries(['tickets'])
      queryClient.invalidateQueries(['ticket', id])
    },
  })
}

// Delete ticket mutation
export const useDeleteTicket = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/tickets/${id}`)
      return id
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries(['tickets'])
      toast.success('Ticket deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete ticket')
    }
  })
}