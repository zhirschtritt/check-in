import {Module, LoggerService} from '@nestjs/common';
import {Logger as Pino, LoggerOptions} from 'pino';

// tslint:disable-next-line:no-var-requires
const pino = require('pino');

export const createPinoLogger = (
  name: string,
  optionsInput: LoggerOptions = {},
): Pino => {
  const defaults = {
    prettyPrint: true,
    level: process.env.LOG_LEVEL || 'debug',
    base: {},
    name,
  };

  const options = Object.assign({}, defaults, optionsInput);

  return pino(options);
};

export function LoggerFactory(name: string): AppLogger {
  return new AppLogger(name);
}

export class AppLogger implements LoggerService {
  private readonly pino: Pino;
  constructor(name: string) {
    this.pino = createPinoLogger(name);
  }
  log(ctx: any, msg: string) {
    this.info(ctx, msg);
  }
  info(ctx: any, msg: string) {
    this.pino.info(ctx, msg);
  }
  debug(ctx: any, msg: string) {
    this.pino.debug(ctx, msg);
  }
  warn(ctx: any, msg: string) {
    this.pino.info(ctx, msg);
  }
  error(ctx: any, msg: string) {
    this.pino.info(ctx, msg);
  }
}

@Module({
  providers: [
    {
      provide: 'LoggerFactory',
      useValue: LoggerFactory,
    },
  ],
  exports: [LoggerFactory],
})
export class LoggerModule {}
