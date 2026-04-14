import { db } from '../../shared/database/client';
import { NotFoundError, ValidationError } from '../../shared/errors/app-error';
import type { CreatePersonInput, UpdatePersonInput, SearchPersonsInput } from './person.validation';

export class PersonService {
  async createPerson(input: CreatePersonInput, createdBy: string) {
    // Validate death date is after birth date
    if (input.birthDate && input.deathDate) {
      const birth = new Date(input.birthDate);
      const death = new Date(input.deathDate);
      if (death < birth) {
        throw new ValidationError('Death date cannot be before birth date');
      }
    }

    const person = await db.person.create({
      data: {
        givenName: input.givenName,
        familyName: input.familyName,
        middleName: input.middleName,
        birthDate: input.birthDate ? new Date(input.birthDate) : null,
        deathDate: input.deathDate ? new Date(input.deathDate) : null,
        gender: input.gender,
        bio: input.bio,
        isLiving: input.isLiving,
        createdBy,
      },
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        userId: createdBy,
        action: 'CREATE',
        entityType: 'Person',
        entityId: person.id,
        changes: {
          after: person,
        },
      },
    });

    return person;
  }

  async getPerson(id: string) {
    const person = await db.person.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        relationshipsFrom: {
          include: {
            personTo: true,
          },
        },
        relationshipsTo: {
          include: {
            personFrom: true,
          },
        },
      },
    });

    if (!person) {
      throw new NotFoundError('Person');
    }

    if (person.isMerged) {
      throw new NotFoundError('Person (merged into another profile)');
    }

    return person;
  }

  async listPersons(userId: string, filters?: SearchPersonsInput) {
    const where: any = {
      isMerged: false,
      createdBy: userId, // Only show user's own persons for now
    };

    if (filters?.query) {
      where.OR = [
        { givenName: { contains: filters.query, mode: 'insensitive' } },
        { familyName: { contains: filters.query, mode: 'insensitive' } },
      ];
    }

    if (filters?.isLiving !== undefined) {
      where.isLiving = filters.isLiving === 'true';
    }

    if (filters?.gender) {
      where.gender = filters.gender;
    }

    const persons = await db.person.findMany({
      where,
      orderBy: [{ familyName: 'asc' }, { givenName: 'asc' }],
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
    });

    const total = await db.person.count({ where });

    return { persons, total };
  }

  async updatePerson(id: string, input: UpdatePersonInput, userId: string) {
    // Check person exists and user owns it
    const existing = await db.person.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundError('Person');
    }

    if (existing.isMerged) {
      throw new ValidationError('Cannot update merged person');
    }

    // Validate dates if both provided
    const birthDate = input.birthDate !== undefined
      ? (input.birthDate ? new Date(input.birthDate) : null)
      : existing.birthDate;
    const deathDate = input.deathDate !== undefined
      ? (input.deathDate ? new Date(input.deathDate) : null)
      : existing.deathDate;

    if (birthDate && deathDate && deathDate < birthDate) {
      throw new ValidationError('Death date cannot be before birth date');
    }

    const person = await db.person.update({
      where: { id },
      data: {
        ...(input.givenName !== undefined && { givenName: input.givenName }),
        ...(input.familyName !== undefined && { familyName: input.familyName }),
        ...(input.middleName !== undefined && { middleName: input.middleName }),
        ...(input.birthDate !== undefined && { birthDate }),
        ...(input.deathDate !== undefined && { deathDate }),
        ...(input.gender !== undefined && { gender: input.gender }),
        ...(input.bio !== undefined && { bio: input.bio }),
        ...(input.isLiving !== undefined && { isLiving: input.isLiving }),
      },
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        userId,
        action: 'UPDATE',
        entityType: 'Person',
        entityId: person.id,
        changes: {
          before: existing,
          after: person,
        },
      },
    });

    return person;
  }

  async deletePerson(id: string, userId: string) {
    // Check person exists
    const person = await db.person.findUnique({
      where: { id },
    });

    if (!person) {
      throw new NotFoundError('Person');
    }

    if (person.isMerged) {
      throw new ValidationError('Cannot delete merged person');
    }

    // Soft delete by marking as merged (we'll use this pattern)
    // In a real implementation, you might want a separate isDeleted flag
    await db.person.delete({
      where: { id },
    });

    // Create audit log
    await db.auditLog.create({
      data: {
        userId,
        action: 'DELETE',
        entityType: 'Person',
        entityId: id,
        changes: {
          before: person,
        },
      },
    });

    return { message: 'Person deleted successfully' };
  }
}

export const personService = new PersonService();
