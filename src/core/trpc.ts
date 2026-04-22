import { initTRPC, TRPCError } from '@trpc/server';
import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { OpenApiMeta } from 'trpc-openapi';
import { auth } from './firebase';
import { connectToDatabase } from './db';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import superjson from 'superjson';

export const createContext = async ({ event }: CreateAWSLambdaContextOptions<APIGatewayProxyEvent>) => {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  let user: DecodedIdToken | null = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try { user = await auth.verifyIdToken(token); } catch (e) { console.error('Auth fail:', e); }
  }

  const { db } = await connectToDatabase();
  return { event, user, db };
};

type Context = Awaited<ReturnType<typeof createContext>>;
const t = initTRPC.context<Context>().meta<OpenApiMeta>().create({
  transformer: superjson
});

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
  return next({ ctx: { user: ctx.user, db: ctx.db } });
});

export const protectedProcedure = t.procedure.use(isAuthed);
