import React from 'react'

export const TicketSkeleton = () => {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow p-4 mb-3">
      <div className="flex justify-between items-start mb-2">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
      <div className="flex justify-between items-center">
        <div className="h-3 bg-gray-200 rounded w-24"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  )
}

export const TicketListSkeleton = ({ count = 5 }) => {
  return (
    <div>
      {Array.from({ length: count }).map((_, index) => (
        <TicketSkeleton key={index} />
      ))}
    </div>
  )
}

export const NoteSkeleton = () => {
  return (
    <div className="animate-pulse bg-gray-50 rounded-lg p-3 mb-3">
      <div className="flex justify-between items-center mb-2">
        <div className="h-3 bg-gray-200 rounded w-20"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
    </div>
  )
}