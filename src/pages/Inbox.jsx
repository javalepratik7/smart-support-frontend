import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectCurrentUser } from '../features/authSlice'
import { selectFilters, selectPagination } from '../features/uiSlice'
import { useTickets } from '../hooks/useTickets'
import Filters from '../components/Filters'
import Pagination from '../components/Pagination'
import TicketItem from '../components/TicketItem'
import TicketDrawer from '../components/TicketDrawer'
import { TicketListSkeleton } from '../components/LoadingSkeleton'
import Button from '../components/Button'

const Inbox = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const filters = useSelector(selectFilters)
  const pagination = useSelector(selectPagination)
  
  const { data, isLoading, error, isFetching } = useTickets(filters, pagination)

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Support Inbox</h1>
              <p className="text-sm text-gray-600">
                Welcome back, {user?.name}!
              </p>
            </div>
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Filters */}
          <Filters />

          {/* Loading State */}
          {isLoading && <TicketListSkeleton count={5} />}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-400">⚠</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Failed to load tickets
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    {error.response?.data?.error || 'Please try again later.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && data?.tickets?.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tickets found
                </h3>
                <p className="text-gray-500 mb-4">
                  {filters.status || filters.priority || filters.search
                    ? 'Try adjusting your filters to see more results.'
                    : 'No support tickets have been created yet.'}
                </p>
              </div>
            </div>
          )}

          {/* Tickets List */}
          {!isLoading && data?.tickets?.length > 0 && (
            <>
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {isFetching && !isLoading && (
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-primary-600 rounded-full animate-ping mr-2" />
                      Updating...
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Showing {data.tickets.length} of {data.pagination.total} tickets
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {data.tickets.map(ticket => (
                  <TicketItem key={ticket._id} ticket={ticket} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination data={data} />
            </>
          )}
        </div>
      </main>

      {/* Ticket Detail Drawer */}
      <TicketDrawer />
    </div>
  )
}

export default Inbox