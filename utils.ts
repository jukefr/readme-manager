import { error } from "https://deno.land/std@0.146.0/log/mod.ts";
import { join, resolve } from "https://deno.land/std@0.146.0/path/mod.ts";
import configDir from "https://deno.land/x/config_dir@v0.1.1/mod.ts";

/**
 * Run a shell command.
 *
 * ```ts
 * import { runCommand } from "./utils.ts"
 * const output = await runCommand("ls", (errorMsg: string, error?: Error) => {}, true)
 * try {
 *   const failing = await runCommand(">&2 echo error", (errorMsg: string, error?: Error) => {})
 * } catch (e) {
 *   console.log(e)
 * }
 * ```
 *
 * @param {Array.<string>} command The command to run in a shell.
 * @param {function(string, Error)} error Error handler function.
 * @param {boolean} allowFail If true will silently fail, otherwise throws on error.
 */
export const runCommand = async (
  command: string[],
  error: (message: string, error?: Error) => void,
  allowFail?: boolean,
) => {
  const process = Deno.run({
    cmd: command,
    stdout: "piped",
    stderr: "piped",
  });

  const output = await process.output(); // "piped" must be set
  const outStr = new TextDecoder().decode(output);

  const err = await process.stderrOutput();
  const errStr = new TextDecoder().decode(err);

  process.close();

  if (errStr && !allowFail) {
    error(`Something went wrong running the command ${command}`);
  }

  return outStr.trim();
};

/**
 * Get the user configuration directory.
 *
 * ```ts
 * import { getUserConfigDirectory } from "./utils.ts"
 * const configDir = await getUserConfigDirectory((errorMsg: string, error?: Error) => {})
 * ```
 *
 * @param {function(string, Error)} error Error handler function.
 */

export const getUserConfigDirectory = (
  error: (message: string, error?: Error) => void,
) => {
  const userConfigDirectory = configDir();
  if (!userConfigDirectory) {
    error("Could not resolve home config directory.");
  }
  return userConfigDirectory as string;
};

/**
 * Get the app configuration directory.
 *
 * ```ts
 * import { getAppConfigDirectory } from "./utils.ts"
 * const appDir = await getAppConfigDirectory("readme-manager", (errorMsg: string, error?: Error) => {})
 * ```
 *
 * @param {string} app The name of the application.
 * @param {function(string, Error)} error Error handler function.
 */
export const getAppConfigDirectory = (
  app: string,
  error: (message: string, error?: Error) => void,
) => {
  const userConfigDirectory = getUserConfigDirectory(error);
  return resolve(join(userConfigDirectory, app));
};

/**
 * Get the app configuration file path.
 *
 * ```ts
 * import { getAppConfigFile } from "./utils.ts"
 * const appConfig = await getAppConfigFile("readme-manager", (errorMsg: string, error?: Error) => {})
 * ```
 *
 * @param {string} app The name of the application.
 * @param {function(string, Error)} error Error handler function.
 */
export const getAppConfigFile = (
  app: string,
  error: (message: string, error?: Error) => void,
) => {
  const userConfigDirectory = getUserConfigDirectory(error);
  return resolve(join(userConfigDirectory, `${app}.json`));
};

/**
 * Get the app log file path.
 *
 * ```ts
 * import { getAppLogFile } from "./utils.ts"
 * const appLog = await getAppLogFile("readme-manager")
 * ```
 *
 * @param {string} app The name of the application.
 */
export const getAppLogFile = (
  app: string,
) => {
  const userConfigDirectory = configDir();
  if (!userConfigDirectory) {
    error("Could not resolve home config directory. Please file an issue.");
    Deno.exit(1);
  }
  return resolve(join(userConfigDirectory, `${app}.log`));
};

/**
 * Check if a given path exists on the filesystem.
 * Returns a boolean or an error if something goes terribly wrong.
 *
 * ```ts
 * import { checkExists } from "./utils.ts"
 * const exists = await checkExists("/some/path", (errorMsg: string, error?: Error) => {})
 * ```
 *
 * @param {string} path The path to check for.
 * @param {function(string, Error)} error Error handler function.
 */
export const checkExists = async (
  path: string,
  error: (message: string, error?: Error) => void,
) => {
  try {
    await Deno.stat(path);
    return true;
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      return false;
    } else {
      error(`Something went wrong checking ${path} exists.`, e);
    }
  }
};
