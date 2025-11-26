import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { openDrawer } from '../features/uiSlice'
import { useDeleteTicket } from '../hooks/useTickets'

const TicketItem = ({ ticket }) => {
  const dispatch = useDispatch()
  const deleteTicket = useDeleteTicket()
  const [isHighlighted, setIsHighlighted] = useState(false)

  const handleTicketClick = () => {
    dispatch(openDrawer(ticket))
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      deleteTicket.mutate(ticket._id)
    }
  }

  // Highlight effect for updated tickets
  useEffect(() => {
    if (ticket.updating) {
      setIsHighlighted(true)
      const timer = setTimeout(() => setIsHighlighted(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [ticket.updating])

  const statusColors = {
    open: 'bg-yellow-100 text-yellow-800',
    pending: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800'
  }

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-orange-100 text-orange-800',
    high: 'bg-red-100 text-red-800'
  }

  return (
    <div
      className={`bg-white rounded-lg shadow p-4 mb-3 cursor-pointer transition-all duration-300 hover:shadow-md ${
        isHighlighted ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''
      } ${ticket.updating ? 'opacity-60' : ''}`}
      onClick={handleTicketClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 text-lg">{ticket.title}</h3>
        <div className="flex space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[ticket.status]}`}>
            {ticket.status}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[ticket.priority]}`}>
            {ticket.priority}
          </span>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ticket.description}</p>
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span className="font-medium">{ticket.customer_email}</span>
          <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
        </div>
        
        <button
          onClick={handleDelete}
          disabled={deleteTicket.isLoading}
          className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
        >
          {deleteTicket.isLoading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}

export default TicketItem