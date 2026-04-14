import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { identityService } from './identity.service';
import { registerSchema, loginSchema, updateProfileSchema } from './identity.validation';
import { ValidationError } from '../../shared/errors/app-error';

export async function identityRoutes(server: FastifyInstance) {
  // Register
  server.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    const validation = registerSchema.safeParse(request.body);

    if (!validation.success) {
      throw new ValidationError('Validation failed', validation.error.format());
    }

    const user = await identityService.register(validation.data);

    // Generate JWT token
    const token = server.jwt.sign(
      { userId: user.id, email: user.email },
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    await reply.status(201).send({
      user,
      token,
    });
  });

  // Login
  server.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const validation = loginSchema.safeParse(request.body);

    if (!validation.success) {
      throw new ValidationError('Validation failed', validation.error.format());
    }

    const user = await identityService.login(validation.data);

    // Generate JWT token
    const token = server.jwt.sign(
      { userId: user.id, email: user.email },
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    await reply.send({
      user,
      token,
    });
  });

  // Get current user (requires authentication)
  server.get(
    '/me',
    {
      preHandler: async (request: FastifyRequest) => {
        await request.jwtVerify();
      },
    },
    async (request: FastifyRequest) => {
      const { userId } = request.user as { userId: string };
      const user = await identityService.getUserById(userId);
      return { user };
    }
  );

  // Update profile (requires authentication)
  server.put(
    '/profile',
    {
      preHandler: async (request: FastifyRequest) => {
        await request.jwtVerify();
      },
    },
    async (request: FastifyRequest) => {
      const validation = updateProfileSchema.safeParse(request.body);

      if (!validation.success) {
        throw new ValidationError('Validation failed', validation.error.format());
      }

      const { userId } = request.user as { userId: string };
      const user = await identityService.updateProfile(userId, validation.data);
      return { user };
    }
  );

  // Logout (client-side only - JWT is stateless)
  server.post('/logout', async () => {
    return { message: 'Logged out successfully' };
  });
}
