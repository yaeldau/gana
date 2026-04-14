import { FastifyInstance, FastifyRequest } from 'fastify';
import { personService } from './person.service';
import { createPersonSchema, updatePersonSchema, searchPersonsSchema } from './person.validation';
import { ValidationError } from '../../shared/errors/app-error';

// Authentication decorator
async function authenticate(request: FastifyRequest) {
  await request.jwtVerify();
}

export async function personRoutes(server: FastifyInstance) {
  // Create person
  server.post(
    '/',
    { preHandler: authenticate },
    async (request: FastifyRequest) => {
      const validation = createPersonSchema.safeParse(request.body);

      if (!validation.success) {
        throw new ValidationError('Validation failed', validation.error.format());
      }

      const { userId } = request.user as { userId: string };
      const person = await personService.createPerson(validation.data, userId);

      return { person };
    }
  );

  // List persons
  server.get(
    '/',
    { preHandler: authenticate },
    async (request: FastifyRequest) => {
      const validation = searchPersonsSchema.safeParse(request.query);

      if (!validation.success) {
        throw new ValidationError('Validation failed', validation.error.format());
      }

      const { userId } = request.user as { userId: string };
      const result = await personService.listPersons(userId, validation.data);

      return result;
    }
  );

  // Get person by ID
  server.get(
    '/:id',
    { preHandler: authenticate },
    async (request: FastifyRequest<{ Params: { id: string } }>) => {
      const person = await personService.getPerson(request.params.id);
      return { person };
    }
  );

  // Update person
  server.put(
    '/:id',
    { preHandler: authenticate },
    async (request: FastifyRequest<{ Params: { id: string } }>) => {
      const validation = updatePersonSchema.safeParse(request.body);

      if (!validation.success) {
        throw new ValidationError('Validation failed', validation.error.format());
      }

      const { userId } = request.user as { userId: string };
      const person = await personService.updatePerson(
        request.params.id,
        validation.data,
        userId
      );

      return { person };
    }
  );

  // Delete person
  server.delete(
    '/:id',
    { preHandler: authenticate },
    async (request: FastifyRequest<{ Params: { id: string } }>) => {
      const { userId } = request.user as { userId: string };
      const result = await personService.deletePerson(request.params.id, userId);
      return result;
    }
  );
}
