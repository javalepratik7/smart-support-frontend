import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setPagination, selectPagination } from '../features/uiSlice'

const Pagination = ({ data }) => {
  const dispatch = useDispatch()
  const pagination = useSelector(selectPagination)

  if (!data?.pagination) return null

  const { page, limit, total, totalPages, hasNext, hasPrev } = data.pagination

  const handlePageChange = (newPage) => {
    dispatch(setPagination({ page: newPage }))
  }

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow">
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
        <span className="font-medium">{Math.min(page * limit, total)}</span> of{' '}
        <span className="font-medium">{total}</span> results
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={!hasPrev}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 text-sm rounded-md ${
                  page === pageNum
                    ? 'bg-primary-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            )
          })}
        </div>
        
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={!hasNext}
          className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Pagination