import admin from 'firebase-admin';
import {Injectable, Inject} from '@nestjs/common';
import {FirestoreServiceAccountProvider} from './firestore-service-account.provider';

@Injectable()
export class FirestoreDbClientFactory {
  constructor(
    @Inject(FirestoreServiceAccountProvider) serviceAcctProvider: FirestoreServiceAccountProvider,
  ) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAcctProvider.serviceAccount),
    });
  }

  manufacture() {
    return admin.firestore();
  }
}
