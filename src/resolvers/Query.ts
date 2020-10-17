import { admin } from '../firebase'
import { ApolloError, ValidationError } from 'apollo-server-express'
import { User, Cipher } from '../interfaces'

export const Query = {
    async ciphers() {
        const ciphers = await admin
            .firestore()
            .collection('ciphers')
            .get();
        return ciphers.docs.map(cipher => cipher.data()) as Cipher[];
    },
    async user(_: null, args: { id: string }) {
        try {
            const userDoc = await admin
                .firestore()
                .doc(`users/${args.id}`)
                .get();
            const user = userDoc.data() as User | undefined;
            var arr = []
            for(const x in Object.keys(user.cipherData)) {
                arr.push({
                    key: Object.keys(user.cipherData)[x],
                    value: user.cipherData[Object.keys(user.cipherData)[x]]
                })
            } 
            (user.cipherData as any) = arr;
            return user || new ValidationError('User ID not found');
        } catch (error) {
            throw new ApolloError(error);
        }
    }
}