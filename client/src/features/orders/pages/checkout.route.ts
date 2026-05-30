import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../../../router.root'
import Checkout from './Checkout'

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: Checkout,
})
