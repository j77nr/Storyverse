import { z } from 'zod';

export const chapterSchema = z.object({
  title: z
    .string()
    .min(3, 'Le titre du chapitre doit contenir au moins 3 caractères')
    .max(200, 'Le titre du chapitre ne peut pas dépasser 200 caractères'),
  content: z
    .string()
    .min(500, 'Le contenu du chapitre doit contenir au moins 500 caractères'),
});

export const storySubmissionSchema = z.object({
  title: z
    .string()
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  subtitle: z
    .string()
    .max(200, 'Le sous-titre ne peut pas dépasser 200 caractères')
    .optional(),
  description: z
    .string()
    .min(50, 'La description doit contenir au moins 50 caractères')
    .max(2000, 'La description ne peut pas dépasser 2000 caractères'),
  genre: z
    .array(z.string())
    .min(1, 'Sélectionnez au moins un genre')
    .max(3, 'Vous ne pouvez sélectionner que 3 genres maximum'),
  accentColor: z.string().default('bg-blue-500'),
  contentWarnings: z.array(z.string()).default([]),
  chapters: z
    .array(chapterSchema)
    .min(1, 'Vous devez ajouter au moins un chapitre'),
});

export type StorySubmissionInput = z.infer<typeof storySubmissionSchema>;
export type ChapterInput = z.infer<typeof chapterSchema>;
