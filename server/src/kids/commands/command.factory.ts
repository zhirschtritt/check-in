import {Injectable} from '@nestjs/common';
import {ICommand} from '@nestjs/cqrs';
import {CheckInCommand} from './impl/check-in.command';
import {LoadFromHistory} from './impl/load-from-history.command';

export enum CommandName {
  CheckIn = 'CHECK-IN',
  LoadFromHistory = 'LOAD-FROM-HISTORY',
}

@Injectable()
export class KidCommandFactory {
  manufacture(commandName: CommandName, data: any): ICommand {
    switch (commandName) {
      case CommandName.CheckIn:
        return new CheckInCommand(data);
      case CommandName.LoadFromHistory:
        return new LoadFromHistory(data);
      default:
        throw new Error(`No matching command for command type ${commandName}`);
    }
  }
}
