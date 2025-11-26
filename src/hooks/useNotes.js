import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/axios'
import toast from 'react-hot-toast'

// Fetch notes for a ticket
export const useNotes = (ticketId) => {
  return useQuery({
    queryKey: ['notes', ticketId],
    queryFn: async () => {
      const { data } = await api.get(`/tickets/${ticketId}/notes`)
      return data
    },
    enabled: !!ticketId,
  })
}

// Add note mutation with optimistic updates
export const useAddNote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ ticketId, text }) => {
      const { data } = await api.post(`/tickets/${ticketId}/notes`, { text })
      return data
    },
    onMutate: async ({ ticketId, text }) => {
      await queryClient.cancelQueries(['notes', ticketId])

      const previousNotes = queryClient.getQueryData(['notes', ticketId])

      const optimisticNote = {
        _id: `temp-${Date.now()}`,
        text,
        user_id: { name: 'You', email: '' },
        created_at: new Date().toISOString(),
        optimistic: true
      }

      queryClient.setQueryData(['notes', ticketId], old => [
        optimisticNote,
        ...(old || [])
      ])

      return { previousNotes }
    },
    onError: (err, { ticketId }, context) => {
      queryClient.setQueryData(['notes', ticketId], context.previousNotes)
      toast.error('Failed to add note')
    },
    onSuccess: (data) => {
      toast.success('Note added successfully')
    },
    onSettled: (data, error, { ticketId }) => {
      queryClient.invalidateQueries(['notes', ticketId])
    },
  })
}