import {Module, LoggerService, Global} from '@nestjs/common';
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

export type LogFactory = (name) => AppLogger;

export function LogFactory(name: string): AppLogger {
  return new PinoLogger(name);
}

export interface AppLogger {
  log(ctx: any, msg: string);
  info(ctx: any, msg: string);
  debug(ctx: any, msg: string);
  warn(ctx: any, msg: string);
  error(ctx: any, msg: string);
}

export class PinoLogger implements LoggerService, AppLogger {
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
@Global()
@Module({
  providers: [
    {
      provide: 'LogFactory',
      useValue: LogFactory,
    },
  ],
  exports: [
    {
      provide: 'LogFactory',
      useValue: LogFactory,
    },
  ],
})
export class LoggerModule {}
