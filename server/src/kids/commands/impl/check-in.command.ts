import {ICommand} from '@nestjs/cqrs';

export class CheckInCommand implements ICommand {
  constructor(
    public readonly kidId: string,
    public readonly locationId: string,
  ) {}
}
