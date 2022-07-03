import { getLogger } from "https://deno.land/std@0.146.0/log/mod.ts";
import { Args, parse } from "https://deno.land/std@0.146.0/flags/mod.ts";
import { join, resolve } from "https://deno.land/std@0.146.0/path/mod.ts";

import {
  checkExists,
  getAppConfigDirectory,
  getAppConfigFile,
  getAppLogFile,
} from "./utils.ts";
import { setup } from "./setup.ts";
import { help } from "./help.ts";
import { error, setupLogs } from "./log.ts";
import { bootstrap } from "./bootstrap.ts";
import { render } from "./render.ts";

const appName = "readme-manager";

/**
 * The main readme-manager module.
 *
 * @param {Args} args The parsed Deno.args.
 * @param {boolean} cliMode
 */
export const mod = async (args: Args, cliMode?: boolean) => {
  const appLogFile = getAppLogFile(appName);
  await setupLogs(appLogFile);
  const logger = getLogger(args.debug && "debug");
  if (args.debug) {
    logger.debug(`Logs will be appended to ${appLogFile}`);
  }
  const errorHandler = error(appLogFile, cliMode, args.debug);

  const appConfigFile = getAppConfigFile(appName, errorHandler);
  logger.info(`App config file will be ${appConfigFile}`);
  const appConfigDirectory = getAppConfigDirectory(appName, errorHandler);
  logger.info(`App config file will be ${appConfigDirectory}`);

  if (args.setup) {
    return setup(
      appName,
      appConfigFile,
      logger,
      errorHandler,
      appConfigDirectory,
      cliMode,
    );
  }

  if (args.bootstrap) {
    return bootstrap(appConfigDirectory, errorHandler);
  }

  let templates = args?.templates;
  let match = args?.match;

  if (!args.match || !args.templates) {
    logger.debug("Checking configuration file.");
    let appConfigFileContent;
    if (!(await checkExists(appConfigFile, errorHandler))) {
      appConfigFileContent = await setup(
        appName,
        appConfigFile,
        logger,
        errorHandler,
        appConfigDirectory,
        cliMode,
      );
    }

    if (!appConfigFileContent) {
      try {
        appConfigFileContent = await Deno.readTextFile(appConfigFile);
      } catch (e) {
        errorHandler(`Something went wrong reading ${appConfigFile}.`, e);
      }

      if (!appConfigFileContent) {
        appConfigFileContent = await setup(
          appName,
          appConfigFile,
          logger,
          errorHandler,
          appConfigDirectory,
          cliMode,
        );
      }

      try {
        appConfigFileContent = JSON.parse(appConfigFileContent);
      } catch (e) {
        errorHandler(
          `Something went wrong parsing the json in ${appConfigFile}.`,
          e,
        );
      }

      if (
        !appConfigFileContent ||
        typeof appConfigFileContent !== "object" ||
        Object.keys(appConfigFileContent).length === 0
      ) {
        appConfigFileContent = JSON.parse(
          await setup(
            appName,
            appConfigFile,
            logger,
            errorHandler,
            appConfigDirectory,
            cliMode,
          ),
        );
      }

      match = appConfigFileContent.match;
      if (args.match) match = args.match;

      templates = appConfigFileContent.templates;
      if (args.templates) templates = appConfigFileContent.templates;
    }
  }

  let targetPath = args?._?.[0];
  if (args._.length === 0) targetPath = Deno.cwd();
  targetPath = `${targetPath}`; // cast to string
  try {
    for await (const file of Deno.readDir(targetPath)) {
      logger.debug(`Checking ${file.name} in ${targetPath}`);
      if (file.isFile && file.name === match) {
        console.log(`Matched ${file.name}.`);
        try {
          const readme = await render(
            resolve(join(targetPath, file.name)),
            resolve(targetPath),
            await Deno.readTextFile(resolve(join(targetPath, file.name))),
            templates,
            errorHandler,
          );
          if (readme) {
            await Deno.writeTextFile(
              resolve(join(targetPath, "README.md")),
              readme,
            );
          } else {
            errorHandler(
              `Something went wrong, ${
                resolve(join(targetPath, file.name))
              } generated an empty render output.`,
            );
          }
        } catch (e) {
          errorHandler(
            `Something went wrong rendering ${
              resolve(
                join(targetPath, "README.md"),
              )
            }`,
            e,
          );
        }
        console.log(`Generated ${join(targetPath, "README.md")}.`);
      }
    }
  } catch (e) {
    if (e instanceof Deno.errors.PermissionDenied) {
      logger.error("PermissionDenied on a directory.");
      logger.error(e.message);
    } else {
      errorHandler(
        "Something went wrong reading the direcotries of the target path.",
        e,
      );
    }
  }
};

/**
 * Cli running mode
 *
 * @param {string[]} args The Deno.args array
 * @returns {Promise<void | string | undefined>}
 */
export const bin = (args: string[]): Promise<void | string | undefined> => {
  const parsedArgs = parse(args);

  if (parsedArgs.help) {
    help.map((msg) => console.log(msg));
    Deno.exit(0);
  }

  return mod(parsedArgs, true);
};

await bin(Deno.args);
