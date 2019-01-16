import {IEvent} from '@nestjs/cqrs';

export class KidCheckedOutEvent implements IEvent {
  public readonly kidId: string;

  constructor(data: {kidId: string}) {
    this.kidId = data.kidId;
  }
}
