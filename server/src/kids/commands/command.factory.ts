import {Injectable} from '@nestjs/common';
import {ICommand} from '@nestjs/cqrs';
import {CheckInCommand} from './impl/check-in.command';
import {LoadFromHistory} from './impl/load-from-history.command';

type CommandName = 'CHECK-IN' | 'LOAD-FROM-HISTORY';

@Injectable()
export class KidCommandFactory {
  manufacture(commandName: CommandName, data: any): ICommand {
    switch (commandName) {
      case 'CHECK-IN':
        return new CheckInCommand(data);
      case 'LOAD-FROM-HISTORY':
        return new LoadFromHistory(data);
      default:
        throw new Error(`No matching command for command type ${commandName}`);
    }
  }
}
