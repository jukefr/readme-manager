import { Logger } from "https://deno.land/std@0.146.0/log/mod.ts";

import { checkExists } from "./utils.ts";
import { bootstrap } from "./bootstrap.ts";

export const setup = async (
  appName: string,
  appConfigFile: string,
  logger: Logger,
  error: (message: string, error?: Error) => void,
  appConfigDirectory: string,
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
  const templateDirectory = prompt(
    "Where should templates be fetched from?",
    appConfigDirectory,
  ) as string;

  // check if it exists
  if (!await checkExists(templateDirectory, error)) {
    await bootstrap(templateDirectory, error);
  }
  // if it exsists use it
  // if it doesnt exist create it and bootstrap template files

  const filenameMatch = prompt(
    "What readme template filename are we looking for inside repositories?",
    ".README.template.md",
  );

  const value = { templates: templateDirectory, match: filenameMatch };
  console.log();
  console.log(
    `The following configuration will be written to ${appConfigFile}:`,
  );
  console.log(JSON.stringify(value, null, 2));
  const go = confirm("Does this look good ?");
  if (!go) Deno.exit(1);

  await Deno.writeTextFile(appConfigFile, JSON.stringify(value));
  console.log("Configuration written, setup complete.");

  return JSON.stringify(value);
};
