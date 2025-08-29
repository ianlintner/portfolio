import { createTRPCRouter } from './trpc'
import { postRouter } from './routers/post'
import { demoRouter } from './routers/demo'
import { authRouter } from './routers/auth'

export const appRouter = createTRPCRouter({
  post: postRouter,
  demo: demoRouter,
  auth: authRouter,
})

export type AppRouter = typeof appRouter
