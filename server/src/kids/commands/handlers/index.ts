import {CheckInHandler} from './check-in.handler';
import {LoadFromHistoryHandler} from './load-from-history.handler';
import {CheckOutHandler} from './check-out.handler';

export const CommandHandlers = [
  CheckInHandler,
  CheckOutHandler,
  LoadFromHistoryHandler,
];
