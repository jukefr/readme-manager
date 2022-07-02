import { error } from "https://deno.land/std@0.146.0/log/mod.ts";
import { join, resolve } from "https://deno.land/std@0.146.0/path/mod.ts";
import configDir from "https://deno.land/x/config_dir@v0.1.1/mod.ts";

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

  return outStr;
};

export const getUserConfigDirectory = (
  error: (message: string, error?: Error) => void,
) => {
  const userConfigDirectory = configDir();
  if (!userConfigDirectory) {
    error("Could not resolve home config directory.");
  }
  return userConfigDirectory as string;
};

export const getAppConfigDirectory = (
  app: string,
  error: (message: string, error?: Error) => void,
) => {
  const userConfigDirectory = getUserConfigDirectory(error);
  return resolve(join(userConfigDirectory, app));
};

export const getAppConfigFile = (
  app: string,
  error: (message: string, error?: Error) => void,
) => {
  const userConfigDirectory = getUserConfigDirectory(error);
  return resolve(join(userConfigDirectory, `${app}.json`));
};

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
