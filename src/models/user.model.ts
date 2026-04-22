import { z } from 'zod';
import { ObjectId } from 'mongodb';

export const UserDbSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  firebaseUid: z.string(),
  email: z.string().email(),
  displayName: z.string().optional(),
  photoURL: z.string().optional(),
  isEmailVerified: z.boolean().default(false),
  role: z.enum(['admin', 'engineer', 'user']).default('user'),
  createdAt: z.date().default(() => new Date()),
});
export type UserDocument = z.infer<typeof UserDbSchema>;

export const SyncUserInput = z.object({
  email: z.string().email(),
  displayName: z.string().optional(),
  photoURL: z.string().optional(),
  isEmailVerified: z.boolean().optional(),
});
