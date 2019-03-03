import admin, {firestore} from 'firebase-admin';

export const firestoreClientFactory = (serviceAcctProvider: string): firestore.Firestore => {
  const app = admin.initializeApp(
    {
      credential: admin.credential.cert(serviceAcctProvider),
      databaseURL: 'https://pnc-check-in-dev.firebaseio.com',
    },
    'default-app',
  );

  return admin.firestore(app);
};
