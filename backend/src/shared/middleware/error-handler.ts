import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../errors/app-error';
import { logger } from '../utils/logger';

export async function errorHandler(
  error: FastifyError | AppError | Error,
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  // Log error
  logger.error('Request error', {
    method: request.method,
    url: request.url,
    error: error.message,
    stack: error.stack,
  });

  // Handle known AppError
  if (error instanceof AppError) {
    await reply.status(error.statusCode).send(error.toJSON());
    return;
  }

  // Handle Fastify validation errors
  if ('validation' in error && error.validation) {
    await reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: error.validation,
      },
    });
    return;
  }

  // Handle unknown errors
  await reply.status(500).send({
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : error.message,
    },
  });
}
