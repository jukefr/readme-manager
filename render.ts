import {
  basename,
  join,
  resolve,
} from "https://deno.land/std@0.146.0/path/mod.ts";
import {
  compile,
  renderAsync,
  templates,
} from "https://deno.land/x/eta@v1.12.3/mod.ts";

import { getBranch, getCommit, getRepository, getTag } from "./git.ts";

/**
 * Template rendering function.
 * Uses Eta under the hood.
 *
 * ```ts
 * import { render } from "./render.ts"
 * const output = await render("/path/to/.README.template.md", "/path/to/", "# my-project", "/path/to/templates/", (errorMsg: string, error: Error) => {})
 * ```
 *
 * @param {string} readmeFilePath The path of the readme we want to compile.
 * @param {string} readmeDirectoryPath The directory where the readme resides.
 * @param {string} readmeTemplate The contents of the readme we are compiling.
 * @param {string} templatesPath The directory where the templates used for rendering are.
 * @param {function(string, Error)} error Handler for errors.
 */
export const render = async (
  readmeFilePath: string,
  readmeDirectoryPath: string,
  readmeTemplate: string,
  templatesPath: string,
  error: (message: string, error?: Error) => void,
): Promise<string | void> => {
  for await (const template of Deno.readDir(templatesPath)) {
    if (
      template.isFile && template.name.endsWith(".template.md") &&
      !template.name.endsWith("README.template.md") &&
      !template.name.startsWith(".")
    ) {
      templates.define(
        template.name,
        compile(
          await Deno.readTextFile(resolve(join(templatesPath, template.name))),
        ),
      );
    }
  }
  try {
    return renderAsync(
      await Deno.readTextFile(
        resolve(join(templatesPath, "README.template.md")),
      ),
      {
        name: basename(readmeDirectoryPath),
        readmeFilePath,
        readmeDirectoryPath,
        readme: readmeTemplate,
        gitURL: (await getRepository(readmeDirectoryPath, error)).trim(),
        gitBranch: (await getBranch(readmeDirectoryPath, error)).trim(),
        gitTag: (await getTag(readmeDirectoryPath, error)).trim(),
        gitCommit: (await getCommit(readmeDirectoryPath, error)).trim(),
      },
      {
        async: true,
        autoEscape: false,
        autoTrim: false,
      },
    ) as Promise<string>;
  } catch (e) {
    error(`Something went wrong rendering the README ${readmeFilePath}`, e);
  }
};
