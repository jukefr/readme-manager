import {
  getLogger,
  handlers,
  setup,
} from "https://deno.land/std@0.146.0/log/mod.ts";

/**
 * Setup different loggers used by the application.
 * The default one hides debugs and detailed error messages.
 * The debug one shows everything.
 * The file error one is used in default mode to write error details to file but hide them in console.
 *
 * ```ts
 * import { getLogger } from "https://deno.land/std@0.146.0/log/mod.ts"
 * import { setupLogs } from "./logs.ts"
 * await setupLogs('/path/to/logfile.log')
 * const default = getLogger()
 * const debug = getLogger('debug')
 * const fileError = getLogger('fileError')
 * ```
 *
 * @param {string} appLogFile The path the app should log to.
 */
export const setupLogs = async (appLogFile: string) => {
  await setup({
    handlers: {
      console: new handlers.ConsoleHandler("DEBUG"),
      file: new handlers.FileHandler("DEBUG", {
        filename: appLogFile,
        formatter: `${new Date().toISOString()} {levelName} {msg}`,
      }),
      errors: new handlers.FileHandler("ERROR", {
        filename: appLogFile,
        formatter: `${new Date().toISOString()} {levelName} {msg}`,
      }),
    },
    loggers: {
      default: {
        level: "WARNING",
        handlers: ["console", "errors"],
      },
      debug: {
        level: "DEBUG",
        handlers: ["console", "file"],
      },
      fileError: {
        level: "ERROR",
        handlers: ["errors"],
      },
    },
  });
};

/**
 * Error handler.
 * Used log information to console and write to file then exit app.
 *
 * ```ts
 * import { error } from "./log.ts"
 * const errorHandler = error("/path/to/logfile.log", true)
 * errorHandler('Something went wrong.', new Error('The error'))
 * ```
 *
 * @param {string} appLogFile The path the app should log to.
 * @param {boolean} cliMode Determines whever the errorHandler should exit or throw.
 * @param {boolean} debug Show more information be shown to console if true.
 */
export const error = (appLogFile: string, cliMode?: boolean, debug?: boolean) =>
  (
    message: string,
    error?: Error,
  ) => {
    const defaultLogger = getLogger();
    const debugLogger = getLogger("debug");
    const fileErrorLogger = getLogger("fileError");
    defaultLogger.error(`${message} Please file an issue.`);
    if (error) {
      if (debug) {
        debugLogger.error("There was an attached error.");
        debugLogger.error(error);
      } else {
        fileErrorLogger.error(error);
      }
      defaultLogger.error(`Details logged to ${appLogFile}.`);
    }
    cliMode && Deno.exit(1);
    throw error ? error : new Error(message);
  };
