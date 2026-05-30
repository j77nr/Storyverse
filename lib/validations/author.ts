import { z } from 'zod';

export const authorApplicationSchema = z.object({
  bio: z
    .string()
    .min(50, 'La biographie doit contenir au moins 50 caractères')
    .max(1000, 'La biographie ne peut pas dépasser 1000 caractères'),
  motivation: z
    .string()
    .min(100, 'La motivation doit contenir au moins 100 caractères')
    .max(2000, 'La motivation ne peut pas dépasser 2000 caractères'),
});

export type AuthorApplicationInput = z.infer<typeof authorApplicationSchema>;
