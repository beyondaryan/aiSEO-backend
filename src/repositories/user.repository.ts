import { Db } from 'mongodb';
import { UserDocument } from '../models/user.model';

export class UserRepository {
  constructor(private db: Db) {}
  private get collection() { return this.db.collection<UserDocument>('users'); }

  async findByUid(firebaseUid: string) { return this.collection.findOne({ firebaseUid }); }
  async create(userData: UserDocument) {
    const result = await this.collection.insertOne(userData);
    return { ...userData, _id: result.insertedId };
  }
}
