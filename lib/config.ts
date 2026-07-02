export const PORTFOLIO_URL = process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? 'https://atulsharma.vercel.app'

export const TEST_TYPES = ['Smoke', 'Load', 'Stress', 'Soak', 'Spike', 'Breakpoint'] as const
export const PROTOCOLS = ['REST / HTTP', 'GraphQL', 'WebSocket', 'gRPC', 'Browser / UI'] as const

export const EXAMPLE_INPUT = {
  appName: 'ShopStream E-commerce Platform',
  appDescription: 'A multi-tenant e-commerce platform handling product browsing, cart management, and checkout with payment processing. Backend is Node.js + PostgreSQL, fronted by a React SPA, deployed on AWS ECS behind an ALB.',
  targetEndpoints: `/api/products?category=electronics&page=1  (GET — public, high read traffic)
/api/cart/add  (POST — authenticated, cart mutations)
/api/checkout/initiate  (POST — authenticated, triggers payment gateway)
/api/users/me  (GET — authenticated, session validation)
/api/search?q=laptop  (GET — Elasticsearch-backed, expensive)`,
  expectedUsers: '5000',
  peakConcurrent: '500',
  rampUpSeconds: '120',
  slaP95: '800',
  slaP99: '2000',
  slaErrorRate: '0.5',
  testTypes: ['Smoke', 'Load', 'Stress', 'Soak'],
  additionalContext: 'Flash sale expected next month — need to validate the system can handle 3x normal load for 2 hours. Payment endpoint is most critical, must not degrade under any load. We have autoscaling configured above 70% CPU.',
}
