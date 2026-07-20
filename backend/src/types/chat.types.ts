import { Types } from 'mongoose';
import { z } from 'zod';

const objectIdSchema = z
  .string()
  .refine((value) => Types.ObjectId.isValid(value), { message: 'Invalid id format' });

export const sendMessageParamsSchema = z.object({
  sessionId: objectIdSchema,
});

export const sendMessageBodySchema = z.object({
  userId: objectIdSchema,
  content: z
    .string()
    .trim()
    .min(1, 'Message content cannot be empty')
    .max(5000, 'Message is too long'),
});

export type SendMessageParams = z.infer<typeof sendMessageParamsSchema>;
export type SendMessageBody = z.infer<typeof sendMessageBodySchema>;
