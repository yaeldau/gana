import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import { errorHandler } from './shared/middleware/error-handler';
import { logger } from './shared/utils/logger';

export async function buildServer(): Promise<FastifyInstance> {
  const server = Fastify({
    logger: false, // We use Winston instead
    requestIdHeader: 'x-request-id',
    requestIdLogLabel: 'requestId',
  });

  // Register plugins
  await server.register(helmet, {
    contentSecurityPolicy: false, // Adjust based on needs
  });

  await server.register(cors, {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  await server.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  });

  // Health check endpoint
  server.get('/health', async () => {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  });

  // API routes (to be added)
  server.get('/api', async () => {
    return {
      name: 'Gana API',
      version: '0.1.0',
      description: 'Family Heritage Platform API',
    };
  });

  // Register module routes
  const { identityRoutes } = await import('./modules/identity/identity.routes');
  const { personRoutes } = await import('./modules/person/person.routes');

  await server.register(identityRoutes, { prefix: '/api/auth' });
  await server.register(personRoutes, { prefix: '/api/persons' });
  // await server.register(relationshipRoutes, { prefix: '/api/relationships' });
  // await server.register(mergeRoutes, { prefix: '/api/merge' });

  // Error handler
  server.setErrorHandler(errorHandler);

  // Request logging
  server.addHook('onRequest', async (request) => {
    logger.info(`Incoming request: ${request.method} ${request.url}`);
  });

  server.addHook('onResponse', async (request, reply) => {
    logger.info(`Request completed: ${request.method} ${request.url} - ${reply.statusCode}`);
  });

  return server;
}
