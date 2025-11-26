import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  drawerOpen: false,
  selectedTicket: null,
  filters: {
    status: '',
    priority: '',
    search: ''
  },
  pagination: {
    page: 1,
    limit: 10
  }
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openDrawer: (state, action) => {
      state.drawerOpen = true
      state.selectedTicket = action.payload
    },
    closeDrawer: (state) => {
      state.drawerOpen = false
      state.selectedTicket = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
      state.pagination.page = 1 // Reset to first page when filters change
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
      state.pagination.page = 1
    }
  }
})

export const { openDrawer, closeDrawer, setFilters, setPagination, clearFilters } = uiSlice.actions
export default uiSlice.reducer

export const selectDrawerOpen = (state) => state.ui.drawerOpen
export const selectSelectedTicket = (state) => state.ui.selectedTicket
export const selectFilters = (state) => state.ui.filters
export const selectPagination = (state) => state.ui.pagination