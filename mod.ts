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

const appName = "readme-manager";

export const mod = async (args: Args) => {
  const appLogFile = getAppLogFile(appName);
  await setupLogs(appLogFile);
  const logger = getLogger(args.debug && "debug");
  if (args.debug) {
    logger.debug(`Logs will be appended to ${appLogFile}`);
  }
  const errorHandler = error(appLogFile, args.debug);

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
    );
  }

  if (args.bootstrap) {
    return bootstrap(appConfigDirectory, errorHandler);
  }

  logger.debug("Checking configuration file.");
  let appConfigFileContent;
  if (!await checkExists(appConfigFile, errorHandler)) {
    appConfigFileContent = await setup(
      appName,
      appConfigFile,
      logger,
      errorHandler,
      appConfigDirectory,
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
        ),
      );
    }

    // get path
    let targetPath = args?._?.[0];
    if (args._.length === 0) targetPath = Deno.cwd();
    targetPath = `${targetPath}`; // cast to string

    const { default: render } = await import(
      resolve(join(appConfigFileContent.templates, "mod.ts"))
    );

    for await (const file of Deno.readDir(targetPath)) {
      if (file.isFile && file.name === appConfigFileContent.match) {
        console.log(`Matched ${file.name}.`);
        try {
          const readme = await render(
            resolve(join(targetPath, file.name)),
            resolve(targetPath),
            await Deno.readTextFile(resolve(join(targetPath, file.name))),
          );
          await Deno.writeTextFile(
            resolve(join(targetPath, "README.md")),
            readme,
          );
        } catch (e) {
          error(
            `Something went wrong rendering ${
              resolve(join(targetPath, "README.md"))
            }`,
            e,
          );
        }
        console.log(`Generated ${join(targetPath, "README.md")}.`);
      }
    }
  }
};

export const bin = (args: string[]): Promise<void | string | undefined> => {
  const parsedArgs = parse(args);

  if (parsedArgs.help) {
    return help();
  }

  return mod(parsedArgs);
};

await bin(Deno.args);
