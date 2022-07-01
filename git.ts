import { runCommand } from "./utils.ts";

export const getRepository = (
  directory: string,
  error: (message: string, error?: Error) => void,
) => {
  return runCommand(
    [
      "git",
      "-C",
      directory,
      "config",
      "--get",
      "remote.origin.url",
    ],
    error,
  );
};

export const getTag = (
  directory: string,
  error: (message: string, error?: Error) => void,
) => {
  return runCommand(
    [
      "git",
      "-C",
      directory,
      "describe",
      "--tags",
      "--abbrev=0",
    ],
    error,
  );
};

export const getBranch = (
  directory: string,
  error: (message: string, error?: Error) => void,
) => {
  return runCommand(
    [
      "git",
      "-C",
      directory,
      "rev-parse",
      "--abbrev-ref",
      "HEAD",
    ],
    error,
  );
};

export const getCommit = (
  directory: string,
  error: (message: string, error?: Error) => void,
) => {
  return runCommand(
    [
      "git",
      "-C",
      directory,
      "rev-parse",
      "HEAD",
    ],
    error,
  );
};
