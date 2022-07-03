import { Logger } from "https://deno.land/std@0.146.0/log/mod.ts";

import { checkExists } from "./utils.ts";
import { bootstrap } from "./bootstrap.ts";

/**
 * Setup logic.
 * Will create a configuration file with the prompted information.
 * Will also run the template bootstrapping logic.
 *
 * ```ts
 * import { getLogger } from "https://deno.land/std@0.146.0/log/mod.ts";
 * import { setup } from "./setup.ts"
 * await setup("readme-manager", "/path/to/readme-manager.json", getLogger(), (errorMsg: string, error?: Error) => {}, "/path/to/readme-templates")
 * ```
 *
 * @param {string} appName The name of the current app.
 * @param {string} appConfigFile The path where the configuration should be stored.
 * @param {Logger} _logger The logger instance.
 * @param {function(string, Error)} error Error handler function.
 * @param {string} appConfigDirectory The path where the templates will be stored.
 * @param {boolean} cliMode If set to true will ask for user inputs otherwise uses defaults from params.
 */
export const setup = async (
  appName: string,
  appConfigFile: string,
  _logger: Logger,
  error: (message: string, error?: Error) => void,
  appConfigDirectory: string,
  cliMode?: boolean,
) => {
  if (await checkExists(appConfigFile, error)) {
    console.log(
      "Your configuration is either empty or you ran setup mode.",
    );
    console.log(`Backing up current configuration.`);
    try {
      await Deno.writeTextFile(
        appConfigFile.replace(".json", ".old.json"),
        await Deno.readTextFile(appConfigFile),
      );
    } catch (e) {
      error("Something went wrong backing up your configuration.", e);
    }
  } else {
    console.log(`Looks like this is your first time running ${appName}.`);
    console.log("Let's get you set up.");
  }

  console.log();
  let templateDirectory = appConfigDirectory;
  if (cliMode) {
    templateDirectory = prompt(
      "Where should templates be fetched from?",
      appConfigDirectory,
    ) as string;
  }

  if (!await checkExists(templateDirectory, error)) {
    await bootstrap(templateDirectory, error);
  }

  console.log();
  let filenameMatch = ".README.template.md";
  if (cliMode) {
    filenameMatch = prompt(
      "What readme template filename are we looking for inside repositories?",
      filenameMatch,
    ) as string;
  }

  const value = { templates: templateDirectory, match: filenameMatch };
  console.log();
  console.log(
    `The following configuration will be written to ${appConfigFile}:`,
  );
  console.log(JSON.stringify(value, null, 2));
  if (cliMode) {
    const go = confirm("Does this look good ?");
    if (!go) Deno.exit(1);
  }

  await Deno.writeTextFile(appConfigFile, JSON.stringify(value));
  console.log("Configuration written, setup complete.");

  return JSON.stringify(value);
};
