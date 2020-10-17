import { AuthError, FUser, isEmailValid } from '../../utils'
import {
  admin,
  firebase,
  setUserClaims,
} from '../../firebase'
import { User, AuthPayload } from '../../interfaces'
import { ApolloError, ValidationError } from 'apollo-server-express'

export const auth = {
  async signup(_, args: {
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  }) {
    try {
      var data = await firebase.auth()
      .createUserWithEmailAndPassword(
        args.email,
        args.password
      )

      return new Promise<AuthPayload> ((resolve, reject) => {
        var uid: string = data.user.uid
        data.user.getIdToken(true).then(async token => {
          const user: User = {
            uid: uid,
            name: args.name,
            displayName: args.name,
            cipherCount: 0,
            pointsCount: 0,
            cipherData: {},
            email: args.email,
            firstName: "",
            lastName: "",
            profilePicture: null,
            phone: "",
          }

          await admin
                .firestore()
                .doc(`users/${uid}`)
                .set(user);

          await setUserClaims(uid, { moderator: true, admin: true })

          resolve({
            token: token,
            user: user
          } as AuthPayload | undefined);    
        })
      })
    } catch (error) {
      throw new ApolloError(error);
    }
  },

  async login(_, args: { key: string, password: string }) {
    try {
      let key
      if (isEmailValid(args.key))
      {
        key = args.key;
      } else {
        const search = await admin
          .firestore()
          .collection('users')
          .where('name', '==', args.key)
          .get();
        const user = search.docs[0].data() as User | undefined;
        key = user.email;
      }

      var data = await firebase
      .auth()
      .signInWithEmailAndPassword(key, args.password)
      

      return new Promise<AuthPayload> ((resolve, reject) => {
        var uid: string = data.user.uid
        data.user.getIdToken().then(async token => {
          
          const user_req = await admin
            .firestore()
            .doc(`users/${uid}`)
            .get();

          const user = user_req.data() as User | undefined
          
          resolve({
            token: token,
            user: user,
          } as AuthPayload | undefined)
        })
      })
    } catch (error) {
      throw new ApolloError(error);
    }
  },
}