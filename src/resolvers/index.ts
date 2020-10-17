import { Query } from './Query';
import { User } from './User';
import { Cipher } from './Cipher';
import { auth } from './Mutation/auth';
import { result } from './Mutation/result';
import { create } from './Mutation/create';

export const resolvers = {
  Mutation: {
    ...auth,
    ...result,
    ...create,
  },
  Query,
  User,
  Cipher,
}
