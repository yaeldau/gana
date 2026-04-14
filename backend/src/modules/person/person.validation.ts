import { z } from 'zod';

export const createPersonSchema = z.object({
  givenName: z.string().min(1, 'First name is required').max(100),
  familyName: z.string().min(1, 'Last name is required').max(100),
  middleName: z.string().max(100).optional(),
  birthDate: z.string().datetime().optional().nullable(),
  deathDate: z.string().datetime().optional().nullable(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'UNKNOWN']).optional().nullable(),
  bio: z.string().max(5000).optional().nullable(),
  isLiving: z.boolean().default(true),
});

export const updatePersonSchema = z.object({
  givenName: z.string().min(1).max(100).optional(),
  familyName: z.string().min(1).max(100).optional(),
  middleName: z.string().max(100).optional().nullable(),
  birthDate: z.string().datetime().optional().nullable(),
  deathDate: z.string().datetime().optional().nullable(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'UNKNOWN']).optional().nullable(),
  bio: z.string().max(5000).optional().nullable(),
  isLiving: z.boolean().optional(),
});

export const searchPersonsSchema = z.object({
  query: z.string().optional(),
  isLiving: z.enum(['true', 'false']).optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'UNKNOWN']).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export type CreatePersonInput = z.infer<typeof createPersonSchema>;
export type UpdatePersonInput = z.infer<typeof updatePersonSchema>;
export type SearchPersonsInput = z.infer<typeof searchPersonsSchema>;
