import {Module, Global} from '@nestjs/common';
import {firestoreClientFactory} from './firestore-client.factory';
import {FirestoreRepositoryFactory} from './firestore-repository.factory';
import {di_keys} from '../common/di-keys';

const servieAccountProvider = {
  provide: di_keys.GoogleServiceAcctProvider,
  useValue: require('/Users/zacharyhirschtritt/.google/pnc-check-in-dev-e42f39334bbe.json'),
};

const clientFactory = {
  provide: di_keys.FirestoreClient,
  useFactory: firestoreClientFactory,
  inject: [di_keys.GoogleServiceAcctProvider],
};

@Global()
@Module({
  providers: [clientFactory, FirestoreRepositoryFactory, servieAccountProvider],
  exports: [FirestoreRepositoryFactory, clientFactory],
})
export class PersistanceModule {}
