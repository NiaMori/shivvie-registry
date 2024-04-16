import * as winston from 'winston'
import { DateTime } from 'luxon'

export const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: () => DateTime.local().toISO() }),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
}).child({
  from: '{{{packageName}}}',
})
