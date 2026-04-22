import { router, protectedProcedure } from '../core/trpc';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';
import { SyncUserInput, UserDbSchema } from '../models/user.model';
import { z } from 'zod';

export const userController = router({
  getProfile: protectedProcedure
    .meta({ openapi: { method: 'GET', path: '/users/profile', tags: ['Users'], protect: true, summary: 'Get profile' } })
    .input(z.object({}))
    .output(UserDbSchema.omit({ _id: true }))
    .query(async ({ ctx }) => {
      const service = new UserService(new UserRepository(ctx.db));
      return service.getProfile(ctx.user.uid);
    }),

  sync: protectedProcedure
    .meta({ openapi: { method: 'POST', path: '/users/sync', tags: ['Users'], protect: true, summary: 'Sync user' } })
    .input(SyncUserInput)
    .output(UserDbSchema.omit({ _id: true }))
    .mutation(async ({ input, ctx }) => {
      const service = new UserService(new UserRepository(ctx.db));
      const user = await service.syncUser(ctx.user.uid, input);
      return user;
    }),
});
