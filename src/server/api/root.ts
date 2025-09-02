import { createTRPCRouter } from "../api/trpc";
import { postRouter } from "../api/routers/post";
import { demoRouter } from "../api/routers/demo";
import { authRouter } from "../api/routers/auth";

export const appRouter = createTRPCRouter({
  post: postRouter,
  demo: demoRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
