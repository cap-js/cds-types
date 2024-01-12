
/**
 * Create a new logger, or install a custom log formatter
 */
export declare const log: LogFactory

/**
 * Shortcut to `cds.log(...).debug`, returning `undefined` if `cds.log(...)._debug` is `false`.
 * Use like this:
 * @example
 * ```js
 *   const dbg = cds.debug('foo')
 *   ...
 *   dbg && dbg('message')
 * ```
 *
 * @param name - logger name
 */
export declare function debug (name: string): undefined | Log

declare type LogFactory = {

  /**
     * Returns a trace logger for the given module if trace is switched on for it,
     * otherwise returns null. All cds runtime packages use this method for their
     * trace and debug output.
     *
     * By default this logger would prefix all output with `[sql] - `
     * You can change this by specifying another prefix in the options:
     * @example
     * ```js
     *   const LOG = cds.log('sql|db', { prefix: 'cds.ql' })
     * ```
     *
     * Call `cds.log()` for a given module again to dynamically change the log level
     * of all formerly created loggers, for example:
     * @example
     * ```js
     *   const LOG = cds.log('sql')
     *   LOG.info ('this will show, as default level is info')
     *   cds.log('sql', 'warn')
     *   LOG.info('this will be suppressed now')
     * ```
     *
     * @param name - logger name
     * @param options - level, label and prefix
     * @returns the logger
     * @see [capire](https://cap.cloud.sap/docs/node.js/cds-log)
     */
  (name: string, options?: string | number | { level?: number, label?: string, prefix?: string }): Logger,

  /**
     * Set a custom formatter function like that:
     * ```js
     *   cds.log.format = (module, level, ...args) => [ '[', module, ']', ...args ]
     * ```
     *
     * The formatter shall return an array of arguments, which are passed to the logger (for example, `console.log()`)
     */
  format: Formatter,

  /**
     * Set a custom logger.
     * ```js
     *   cds.log.Logger = ...
     * ```
     */
  Logger: Logger,

  // FIXME
  /* eslint-disable-next-line @typescript-eslint/ban-types */
  winstonLogger (LoggerOptions?: { level?: string, levels?: any, format?: any, transports?: any, exitOnError?: boolean | Function, silent?: boolean }),
}

declare class Logger {


  /**
    * Logs with 'trace' level
    */
  trace: Log

  /**
     * Logs with 'debug' level
     */
  debug: Log

  /**
     * Logs with 'info' level
     */
  info: Log

  /**
     * Logs with 'warn' level
     */
  warn: Log

  /**
     * Logs with 'error' level
     */
  error: Log

  /**
     * Logs with default level
     */
  log: Log

  /**
     * @returns whether 'trace' level is active
     */
  _trace: boolean

  /**
     * @returns whether 'debug' level is active
     */
  _debug: boolean

  /**
     * @returns whether 'info' level is active
     */
  _info: boolean

  /**
     * @returns whether 'warn' level is active
     */
  _warn: boolean

  /**
     * @returns whether 'error' level is active
     */
  _error: boolean

  /**
     * Change the format for this logger instance:
     * ```
     *   cds.log('foo').setFormat((module, level, ...args) => [ '[', module, ']', ...args ])
     * ```
     *
     * The formatter shall return an array of arguments, which are passed to the logger (for example, `console.log()`)
     */
  setFormat (formatter: Formatter)

}

declare type Formatter = {

  /**
     * Custom format function
     *
     * @param module - logger name
     * @param level - log level
     * @param args - additional arguments
     * @returns an array of arguments, which are passed to the logger (for example, `console.log()`)
     */
  (module: string, level: number, args: any[]): any[],
}

declare type Log = {

  /**
     * Logs a message
     *
     * @param message - text to log
     * @param optionalParams - additional parameters, same as in `console.log(text, param1, ...)`
     */
  (message?: any, ...optionalParams: any[]): void,
}

declare enum levels {
  // FIXME: check if this is a copy-paste error
  /* eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values */
  SILENT = 0, ERROR = 1, WARN = 2, INFO = 3, DEBUG = 4, TRACE = 5, SILLY = 5, VERBOSE = 5
}
