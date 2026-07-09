import { z } from 'zod';

export const generateTextSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt cannot be empty')
    .max(5000, 'Prompt is too long'),
});

export type GenerateTextRequest = z.infer<
  typeof generateTextSchema
>;