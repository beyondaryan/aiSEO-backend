import { router } from './core/trpc';
import { userController } from './controllers/user.controller';

export const appRouter = router({
  users: userController,
});
export type AppRouter = typeof appRouter;
