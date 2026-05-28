import { createRoute } from '@tanstack/react-router'
import { rootRoute } from '../../../router.root'
import ProductDetail from './ProductDetail'

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/$productId',
  component: ProductDetail,
})
