import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../../../router.root'
import Cart from './Cart'

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: Cart,
})
