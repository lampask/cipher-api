# cipher-api

GraphQL api for puzzlehunt game apps

## Environment setup
This project requires custom enviromental variables:
```
GCP_PROJECT_ID=project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xyzw@project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY----- ... 
FIREBASE_DATABASE_URL=https://project-id.firebaseio.com
FIREBASE_WEB_API_KEY=AIzaIjhtsRs....
FIREBASE_AUTH_DOMAIN=project-id.firebaseapp.com
FIREBASE_STORAGE_BUCKET=project-id.appspot.com
FIREBASE_FMC_ID=0123456789...
APOLLO_API_KEY=service:.......
ORIGIN_HEADERS=https://localhost:3000, ...
```
(`.env` file example)