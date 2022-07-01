import {
  getLogger,
  handlers,
  setup,
} from "https://deno.land/std@0.146.0/log/mod.ts";

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

export const error = (appLogFile: string, debug?: boolean) =>
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
    Deno.exit(1);
  };
