const winston = require('winston')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  )
}

const customLogger = {
  error: (message) => {
    logger.error(message)
  },
  warn: (message) => {
    logger.warn(message)
  },
  info: (message) => {
    logger.info(message)
  },
  verbose: (message) => {
    logger.verbose(message)
  },
  debug: (message) => {
    logger.debug(message)
  },
  silly: (message) => {
    logger.silly(message)
  }
}

module.exports = customLogger
