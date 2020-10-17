import { ApolloError, ValidationError } from 'apollo-server-express';
import { Answer, User } from '../../interfaces';
import { admin } from '../../firebase';
import { AuthError, FUser } from '../../utils';
import { firestore } from 'firebase-admin';

export const result = {
    async result(_, args: { id: string, answer: string }, context: {user: FUser}) {
        try {
            if (context.user) {
                // Check if user didn't sovle already or is author
                const userData = await admin
                    .firestore()
                    .doc(`users/${context.user.uid}`)
                    .get()
                const user = userData.data() as User | undefined
                if (user.cipherData[args.id]) {
                    if (user.cipherData[args.id].solved) return new ValidationError('Cipher already solved by this user');
                }
                // Check if answers match
                const getAnswer = await admin
                    .firestore()
                    .doc(`results/${args.id}`)
                    .get();
                const answer = getAnswer.data() as Answer | undefined;
                if (answer == undefined) return new ValidationError('Cipher ID not found');
                const doc = await admin
                    .firestore()
                    .doc(`users/${context.user.uid}`)
                if (answer.result == args.answer){
                    let update = {
                        cipherCount: firestore.FieldValue.increment(1)
                    }
                    update[`cipherData.${args.id}.solved`] = true
                    await doc.update(update)
                    return true
                } else {
                    let update = {}
                    update[`cipherData.${args.id}.tried`] = firestore.FieldValue.increment(1)
                    await doc.update(update)
                    return false
                }
            } else {
                throw new AuthError();
            }
        } catch (error) {
            throw new ApolloError(error);
        }
    }
}