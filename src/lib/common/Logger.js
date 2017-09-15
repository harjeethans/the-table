class Logger {
  /**
   * Create a new Logger object
   *
   * @constructor
   * @this {Logger}
   * @param {string} category - the log category
   * @param {object} options - over-ride for the options
   */
  constructor(category, options = {}) {
    this.category = category;
    this.logLevel = options.logLevel || 10;
  }

  /**
   * Turn a numeric level into a name
   *
   * @param {number} level the level number
   * @returns {string} the level name
   */
  logLevelName(level) {
    for (const l in Logger.LogLevels) {
      if (Logger.LogLevels[l] === level) {
        return l;
      }
    }
    return 'UNKNOWN';
  }

  /**
   * Turn a named level into a number
   *
   * @param {string} level the level name
   * @param {number} the level number
   */
  logLevelValue(level) {
    return Logger.LogLevels[level] || 10;
  }

  /**
   * Log a message to the console
   *
   * @param {string | number} level the level of the log message
   * @param ...arguments arguments the rest of the message
   */
  log() {

    const logLevel = this.logLevelValue(arguments[0]);
    if (logLevel < this.logLevel || logLevel === 5) {
      return; // We should not be logging this
    }
    //const logLevel = this.logLevel;
    switch (logLevel) {
      case 1:
        console.log(`[${this.category}]`, ...arguments);
        break;
      case 2:
        console.log(`[${this.category}]`, ...arguments);
        break;
      case 3:
        console.info(`[${this.category}]`, ...arguments);
        break;
      case 4:
        console.warn(`[${this.category}]`, ...arguments);
        break;
      case 5:
        console.error(`[${this.category}]`, ...arguments);
        break;
      default:
        console.log(`[${this.category}]`, ...arguments);
        break;
    }
  }

  // Convenience methods for the rest of the LogLevels
  trace() {
    this.log('TRACE', ...arguments);
  }
  debug() {
    this.log('DEBUG', ...arguments);
  }
  info() {
    this.log('INFO', ...arguments);
  }
  warn() {
    this.log('WARN', ...arguments);
  }
  error() {
    this.log('ERROR', ...arguments);
  }
}

/**
 * Definition of the valid log LogLevels
 */
Logger.LogLevels = {
  TRACE: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  SILENT: 5
};

export default Logger;
