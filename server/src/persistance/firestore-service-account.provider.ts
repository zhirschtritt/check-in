import {Injectable} from '@nestjs/common';

@Injectable()
export class FirestoreServiceAccountProvider {
  public readonly serviceAccount: string;
  constructor() {
    this.serviceAccount = require('~/.google/pnc-check-in-dev-e42f39334bbe.json');
  }
}
