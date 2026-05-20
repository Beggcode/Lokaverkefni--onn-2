import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../../../router.root'
import Products from './Products'

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: Products,
})
