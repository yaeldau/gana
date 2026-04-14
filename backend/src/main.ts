import 'dotenv/config';
import { buildServer } from './server';
import { logger } from './shared/utils/logger';
import { db, disconnectPrisma } from './shared/database/client';

const PORT = parseInt(process.env.PORT || '4000', 10);
const HOST = process.env.HOST || '0.0.0.0';

async function start() {
  try {
    // Test database connection
    await db.$connect();
    logger.info('✅ Database connected successfully');

    // Build and start server
    const server = await buildServer();

    await server.listen({ port: PORT, host: HOST });

    logger.info(`🚀 Server running at http://${HOST}:${PORT}`);
    logger.info(`📊 Health check: http://${HOST}:${PORT}/health`);
    logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);

      try {
        await server.close();
        await disconnectPrisma();
        logger.info('✅ Shutdown completed');
        process.exit(0);
      } catch (error) {
        logger.error('❌ Error during shutdown', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('❌ Failed to start server', error);
    process.exit(1);
  }
}

start();
