import { Injectable } from '@nestjs/common';
import { Kid } from '../models/kid.model';
import { testKid } from './fixtures/kids';

@Injectable()
export class KidRepository {
  async findOneById(id: number): Promise<Kid> {
    return testKid;
  }
}