import {ICommand} from '@nestjs/cqrs';

export class CheckInCommand implements ICommand {
  public readonly kidId: string;
  public readonly locationId: string;
  constructor(data: {kidId: string; locationId: string}) {
    this.kidId = data.kidId;
    this.locationId = data.locationId;
  }
}
