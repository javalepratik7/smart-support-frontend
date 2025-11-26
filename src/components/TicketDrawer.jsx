import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeDrawer, selectSelectedTicket, selectDrawerOpen } from '../features/uiSlice'
import { useTicket, useUpdateTicket } from '../hooks/useTickets'
import { useNotes, useAddNote } from '../hooks/useNotes'
import { NoteSkeleton } from './LoadingSkeleton'
import Button from './Button'

const TicketDrawer = () => {
  const dispatch = useDispatch()
  const isOpen = useSelector(selectDrawerOpen)
  const selectedTicket = useSelector(selectSelectedTicket)
  
  const { data: ticket, isLoading: ticketLoading } = useTicket(selectedTicket?._id)
  const { data: notes, isLoading: notesLoading } = useNotes(selectedTicket?._id)
  const updateTicket = useUpdateTicket()
  const addNote = useAddNote()

  const [noteText, setNoteText] = useState('')

  // Add debugging
  useEffect(() => {
    if (ticket) {
      console.log('🎫 Current ticket data:', ticket)
      console.log('🎫 Ticket ID:', ticket._id)
    }
  }, [ticket])

  const handleClose = () => {
    dispatch(closeDrawer())
    setNoteText('')
  }

  const handleStatusChange = (newStatus) => {
    console.log('🔄 Changing status to:', newStatus)
    console.log('🔄 Using ticket ID:', ticket?._id)
    
    if (ticket) {
      updateTicket.mutate({ 
        id: ticket._id, 
        updates: { status: newStatus } 
      }, {
        onError: (error) => {
          console.error('❌ Update error:', error)
          console.log('❌ Error response:', error.response)
        }
      })
    } else {
      console.error('❌ No ticket data available')
    }
  }

  const handlePriorityChange = (newPriority) => {
    console.log('🔄 Changing priority to:', newPriority)
    console.log('🔄 Using ticket ID:', ticket?._id)
    
    if (ticket) {
      updateTicket.mutate({ 
        id: ticket._id, 
        updates: { priority: newPriority } 
      }, {
        onError: (error) => {
          console.error('❌ Update error:', error)
          console.log('❌ Error response:', error.response)
        }
      })
    }
  }

  const handleAddNote = (e) => {
    e.preventDefault()
    if (noteText.trim() && ticket) {
      addNote.mutate({ ticketId: ticket._id, text: noteText.trim() })
      setNoteText('')
    }
  }

  const statusOptions = [
    { value: 'open', label: 'Open', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'pending', label: 'Pending', color: 'bg-blue-100 text-blue-800' },
    { value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-800' }
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: 'medium', label: 'Medium', color: 'bg-orange-100 text-orange-800' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' }
  ]

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Ticket Details
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {ticketLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ) : ticket ? (
              <>
                {/* Ticket Info */}
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {ticket.title}
                  </h1>
                  <p className="text-gray-600 mb-4">{ticket.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer Email
                      </label>
                      <p className="text-gray-900">{ticket.customer_email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Created
                      </label>
                      <p className="text-gray-900">
                        {new Date(ticket.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Status and Priority Controls */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <div className="flex space-x-2">
                        {statusOptions.map(option => (
                          <button
                            key={option.value}
                            onClick={() => handleStatusChange(option.value)}
                            disabled={updateTicket.isLoading || ticket.updating}
                            className={`px-3 py-1 text-sm rounded-full border ${
                              ticket.status === option.value
                                ? option.color + ' border-transparent'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                            } disabled:opacity-50`}
                          >
                            {updateTicket.isLoading && ticket.status === option.value ? 'Updating...' : option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <div className="flex space-x-2">
                        {priorityOptions.map(option => (
                          <button
                            key={option.value}
                            onClick={() => handlePriorityChange(option.value)}
                            disabled={updateTicket.isLoading || ticket.updating}
                            className={`px-3 py-1 text-sm rounded-full border ${
                              ticket.priority === option.value
                                ? option.color + ' border-transparent'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                            } disabled:opacity-50`}
                          >
                            {updateTicket.isLoading && ticket.priority === option.value ? 'Updating...' : option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                  
                  {/* Add Note Form */}
                  <form onSubmit={handleAddNote} className="mb-6">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add a note..."
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      disabled={addNote.isLoading}
                    />
                    <div className="mt-2 flex justify-end">
                      <Button
                        type="submit"
                        loading={addNote.isLoading}
                        disabled={!noteText.trim()}
                      >
                        Add Note
                      </Button>
                    </div>
                  </form>

                  {/* Notes List */}
                  <div className="space-y-3">
                    {notesLoading ? (
                      <NoteSkeleton />
                    ) : notes?.length > 0 ? (
                      notes.map(note => (
                        <div
                          key={note._id}
                          className={`bg-gray-50 rounded-lg p-4 ${
                            note.optimistic ? 'opacity-60' : ''
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-900">
                              {note.user_id?.name || 'Unknown User'}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(note.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {note.text}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No notes yet. Add the first note!
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500">Ticket not found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default TicketDrawer