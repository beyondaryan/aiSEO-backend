import { TRPCError } from '@trpc/server';
import { UserRepository } from '../repositories/user.repository';
import { SyncUserInput, UserDocument } from '../models/user.model';
import { z } from 'zod';

export class UserService {
  constructor(private userRepo: UserRepository) {}

  async getProfile(firebaseUid: string) {
    const user = await this.userRepo.findByUid(firebaseUid);
    if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    return user;
  }

  async syncUser(firebaseUid: string, input: z.infer<typeof SyncUserInput>) {
    const existing = await this.userRepo.findByUid(firebaseUid);
    if (existing) return existing;

    const newUser: UserDocument = { 
      firebaseUid, 
      email: input.email, 
      displayName: input.displayName,
      photoURL: input.photoURL,
      isEmailVerified: input.isEmailVerified || false,
      role: 'user',
      createdAt: new Date()
    };
    return this.userRepo.create(newUser);
  }
}
