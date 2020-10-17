import { admin } from '../firebase'
import { ApolloError } from 'apollo-server-express'
import { User } from '../interfaces'
import { deletedUser } from '../utils';

export const Cipher = {
    async author(cipher) {
        try {
          const cipherAuthor = await admin
            .firestore()
            .doc(`users/${cipher.authorId}`)
            .get();
          const data = cipherAuthor.data() as User | undefined;
          if (data) {
            return data
          } else {
            return deletedUser;
          }
            
        } catch (error) {
          throw new ApolloError(error);
        }
    },
    async solvedBy(cipher) {
      try {
        const cipherSolvers = await admin
                .firestore()
                .collection('users')
                .where(`cipherData.${cipher.id}.solved`, '==', true)
                .get();
            return cipherSolvers.docs.map(cipher => cipher.data()) as User[];          
      } catch (error) {
        throw new ApolloError(error);
      }
  }
}