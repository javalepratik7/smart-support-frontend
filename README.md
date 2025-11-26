# Smart Support Ticket Inbox - Frontend

A modern, responsive frontend for a Smart Support Ticket Inbox system built with React, Redux Toolkit, and React Query.

## 🚀 Features

- **🎫 Ticket Management** - View, update, and delete support tickets
- **🔐 JWT Authentication** - Secure login and registration
- **📱 Real-time Updates** - Auto-refresh every 10 seconds
- **🎯 Optimistic Updates** - Instant UI feedback with rollback on errors
- **🔍 Advanced Filtering** - Search by title, email, status, and priority
- **📝 Notes System** - Add and view ticket notes with HTML sanitization
- **📊 Responsive Design** - Mobile-friendly with Tailwind CSS
- **⚡ Performance** - Efficient state management with React Query

## 🛠 Tech Stack

- **Frontend Framework:** React 18 + Vite
- **State Management:** Redux Toolkit + React Query
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast
- **UI Components:** Custom components with Headless UI patterns

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- Backend API running on `http://localhost:3000`

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/javalepratik7/smart-support-frontend
cd smart-support-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3000
```

4. **Start development server**
```bash
npm run dev
```

The application will open at `http://localhost:3001`

## 🏗 Project Structure

```
src/
├── api/
│   └── axios.js              # Axios instance with interceptors
├── app/
│   └── store.js              # Redux store configuration
├── components/
│   ├── Button.jsx            # Reusable button component
│   ├── Filters.jsx           # Ticket filtering component
│   ├── LoadingSkeleton.jsx   # Loading states
│   ├── Pagination.jsx        # Pagination controls
│   ├── TicketDrawer.jsx      # Ticket detail side panel
│   └── TicketItem.jsx        # Individual ticket display
├── features/
│   ├── authSlice.js          # Authentication state
│   └── uiSlice.js            # UI state (drawer, filters)
├── hooks/
│   ├── useAuth.js            # Authentication mutations
│   ├── useNotes.js           # Notes CRUD operations
│   └── useTickets.js         # Tickets CRUD operations
├── pages/
│   ├── Inbox.jsx             # Main tickets dashboard
│   ├── Login.jsx             # Authentication page
│   └── Register.jsx          # User registration
├── router/
│   └── AppRouter.jsx         # Protected routes configuration
├── utils/
│   └── debounce.js           # Debounce utility for search
└── ...
```

## 🔌 API Integration

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Tickets
- `GET /tickets` - List tickets with pagination/filtering
- `GET /tickets/:id` - Get single ticket
- `PATCH /tickets/:id` - Update ticket status/priority
- `DELETE /tickets/:id` - Soft delete ticket

### Notes
- `GET /tickets/:id/notes` - Get ticket notes
- `POST /tickets/:id/notes` - Add note to ticket

## 🎯 Key Features Explained

### 🔄 Optimistic Updates
```javascript
// Tickets update immediately with rollback on error
updateTicket.mutate({ 
  id: ticket._id, 
  updates: { status: 'resolved' } 
}, {
  onError: (error) => {
    // Automatic rollback to previous state
    toast.error('Update failed');
  }
});
```

### ⚡ Auto-Refresh
```javascript
// Tickets automatically refresh every 10 seconds
useQuery({
  queryKey: ['tickets', params],
  queryFn: fetchTickets,
  refetchInterval: 10000,
  keepPreviousData: true  // No UI jumps during refresh
});
```

### 🎨 Responsive Design
- Mobile-first approach with Tailwind CSS
- Drawer component for ticket details on desktop
- Full-screen overlay on mobile devices
- Adaptive grid layouts

## 🚀 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🔧 Configuration

### Redux Store
- **Auth State:** JWT tokens, user information
- **UI State:** Drawer visibility, filters, pagination

### React Query
- **Stale Time:** 5 minutes
- **Cache Invalidation:** Automatic on mutations
- **Error Handling:** Global error boundaries

### Axios Interceptors
- Automatic JWT token attachment
- 401 response handling (auto-logout)
- Consistent error formatting

## 🔒 Security

- JWT token storage in localStorage
- Automatic token refresh on API calls
- Protected routes for authenticated users
- HTML sanitization for user-generated content


