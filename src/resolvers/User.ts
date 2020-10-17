import { admin } from '../firebase'
import { ApolloError } from 'apollo-server-express'
import { Cipher, User as UserData } from '../interfaces'

export const User = {
    async ciphersMade(user) {
        try {
            const userCiphers = await admin
                .firestore()
                .collection('ciphers')
                .where('authorId', '==', user.uid)
                .get();
            return userCiphers.docs.map(cipher => cipher.data()) as Cipher[];
        } catch (error) {
            throw new ApolloError(error);
        }
    },
    async ciphersSolved(user) {
        try {
            var arr = []
            for(const x in Object.entries(user.cipherData)) {
                let s: any = Object.entries(user.cipherData)[x][1]
                if (s.value.solved) arr.push(s.key)
            }
            const userCiphers = await admin
                .firestore()
                .collection('ciphers')
                .where('id', 'in', arr)
                .get();
            return userCiphers.docs.map(cipher => cipher.data()) as Cipher[];
        } catch (error) {
            throw new ApolloError(error);
        }
    }
}