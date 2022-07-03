import { runCommand } from "./utils.ts";

/**
 * Attempt to find the repository remote url.
 * Silently fails.
 *
 * ```ts
 * import { getRepository } from "./git.ts"
 * const url = await getRepository('/path/to/git/repo', (errorMsg: string, error?: Error) => {})
 * ```
 *
 * @param {string} directory The path of the git directory.
 * @param {function(string, Error)} error Handler for errors.
 */
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
    true,
  );
};

/**
 * Attempt to find the current repos git tag.
 * Silently fails.
 *
 * ```ts
 * import { getTag } from "./git.ts"
 * const tag = await getTag('/path/to/git/repo', (errorMsg: string, error?: Error) => {})
 * ```
 *
 * @param {string} directory The path of the git directory.
 * @param {function(string, Error)} error Handler for errors.
 */
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
    true,
  );
};

/**
 * Attempt to find the current git branch.
 * Silently fails.
 *
 * ```ts
 * import { getBranch } from "./git.ts"
 * const branch = await getBranch('/path/to/git/repo', (errorMsg: string, error?: Error) => {})
 * ```
 *
 * @param {string} directory The path of the git directory.
 * @param {function(string, Error)} error Handler for errors.
 */
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
    true,
  );
};

/**
 * Attempt to find the current git commit sha.
 * Silently fails.
 *
 * ```ts
 * import { getCommit } from "./git.ts"
 * const commit = await getCommit('/path/to/git/repo', (errorMsg: string, error?: Error) => {})
 * ```
 *
 * @param {string} directory The path of the git directory.
 * @param {function(string, Error)} error Handler for errors.
 */
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
    true,
  );
};
