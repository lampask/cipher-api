import { AuthError, FUser } from '../../utils';
import {
  admin,
  firebase,
  setUserClaims,
} from '../../firebase'
import { Cipher, User } from '../../interfaces'
import { ApolloError, ValidationError } from 'apollo-server-express'

export const create = {
    async newCipher(_, args: { 
        title: string, 
        text: string, 
        source: string, 
        points: number, 
        answer: string
     }, context: {user: FUser}) {
        try {
            try {
                if (context.user.moderator) {
                    const data = await admin
                        .firestore()
                        .collection("ciphers")
                        .doc()
                    await data.create({
                        id: data.id,
                        authorId: context.user.uid,
                        title: args.title,
                        text: args.text,
                        source: args.source,
                        points: args.points,
                    })
                    await admin
                        .firestore()
                        .doc(`results/${data.id}`)
                        .set({
                            id: data.id,
                            result: args.answer
                        })
                    return await (await data.get()).data() as Cipher;
                } else throw Error
            } catch {
                throw new AuthError()
            }
        } catch (error) {
            throw new ApolloError(error);
        }
    }
}