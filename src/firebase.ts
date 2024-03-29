import * as firebaseAdmin from 'firebase-admin'
import * as firebaseMain from 'firebase'
import { AuthError } from './utils'
import * as dotenv from 'dotenv';


dotenv.config()
const admin = firebaseAdmin.initializeApp(
  {
    credential: firebaseAdmin.credential.cert(
      {
      projectId: process.env.GCP_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  },
  'server',
)

const firebase = firebaseMain.initializeApp({
  apiKey: process.env.FIREBASE_WEB_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.GCP_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_FMC_ID
})

//returns cookie token
const createUserSessionToken = async (args) => {
  // Get the ID token.
  const idToken = args.idToken.toString()

  // Only process if the user just signed in in the last 5 minutes.
  // To guard against ID token theft, reject and require re-authentication.
  const decodedIdToken = await admin.auth().verifyIdToken(idToken)
  if (!(new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60))
    throw new AuthError({ message: 'Recent sign in required!' })

  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000

  // Create the session cookie. This will also verify the ID token in the process.
  // The session cookie will have the same claims as the ID token.
  // To only allow session cookie setting on recent sign-in, auth_time in ID token
  // can be checked to ensure user was recently signed in before creating a session cookie.
  const token = await admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .catch(error => {
      console.log(error)
      throw new AuthError({
        message: 'User Session Token Creation Error',
        stack: error,
      })
    })
  if (token) return token
  else throw new AuthError({ message: 'User Session Token Creation Error' })
}

//Returns decoded User Claims
const verifyUserSessionToken = async token => {
  //Verify session cookies tokens with firebase admin.
  //This is a low overhead operation.
  const user = await admin
    .auth()
    .verifySessionCookie(token, true /** checkRevoked */)

  if (user.id) return user
  else if (user.uid) {
    const { customClaims } = await getUserRecord(user.uid)
    return customClaims
  } else
    throw new AuthError({ message: 'User Session Token Verification Error' })
}

//Sets properties into firebase user
const setUserClaims = (uid, data) => admin.auth().setCustomUserClaims(uid, data)

const getUserRecord = uid => admin.auth().getUser(uid)

const verifyIdToken = idToken => admin.auth().verifyIdToken(idToken)

export {
  createUserSessionToken,
  verifyUserSessionToken,
  setUserClaims,
  getUserRecord,
  verifyIdToken,
  firebase,
  admin,
}
