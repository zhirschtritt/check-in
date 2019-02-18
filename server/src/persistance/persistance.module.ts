import {Module} from '@nestjs/common';
import {FirestoreDbClientFactory} from './firestore-client-factory';
import {FirestoreServiceAccountProvider} from './firestore-service-account.provider';

@Module({
  providers: [FirestoreDbClientFactory, FirestoreServiceAccountProvider],
})
export class PersistanceModule {}
