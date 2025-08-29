import { createTRPCReact } from "@trpc/react-query"
import { httpBatchLink } from "@trpc/client"
import type { AppRouter } from "@/server/api/root"

export const trpc = createTRPCReact<AppRouter>()
