import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/app/layout/AppShell'
import { CreatePurchaseRequestPage } from '@/features/purchaseRequests/pages/CreatePurchaseRequestPage'
import { DashboardPage } from '@/features/purchaseRequests/pages/DashboardPage'
import { PurchaseRequestDetailsPage } from '@/features/purchaseRequests/pages/PurchaseRequestDetailsPage'
import { PurchaseRequestsPage } from '@/features/purchaseRequests/pages/PurchaseRequestsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'requests',
        element: <PurchaseRequestsPage />,
      },
      {
        path: 'requests/new',
        element: <CreatePurchaseRequestPage />,
      },
      {
        path: 'requests/:id',
        element: <PurchaseRequestDetailsPage />,
      },
    ],
  },
])
