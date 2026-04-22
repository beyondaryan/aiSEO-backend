import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda';
import { createOpenApiAwsLambdaHandler } from 'trpc-openapi';
import { appRouter } from './app.router';
import { createContext } from './core/trpc';
import { disconnectFromDatabase } from './core/db';

export const trpcHandler = awsLambdaRequestHandler({ router: appRouter, createContext });
export const openApiHandler = createOpenApiAwsLambdaHandler({ router: appRouter, createContext });

const gracefulShutdown = async (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  await disconnectFromDatabase();
  process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
