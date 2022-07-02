import {
  basename,
  join,
  resolve,
} from "https://deno.land/std@0.146.0/path/mod.ts";
import {
  compile,
  render as etaRender,
  templates,
} from "https://deno.land/x/eta@v1.12.3/mod.ts";

import { getBranch, getCommit, getRepository, getTag } from "./git.ts";

export const render = async (
  readmeFilePath: string,
  readmeDirectoryPath: string,
  readmeTemplate: string,
  templatesPath: string,
  error: (message: string, error?: Error) => void,
): Promise<string | void> => {
  for await (const template of Deno.readDir(templatesPath)) {
    if (template.isFile && template.name.endsWith(".template.md")) {
      templates.define(
        template.name,
        compile(
          await Deno.readTextFile(resolve(join(templatesPath, template.name))),
        ),
      );
    }
  }
  try {
    return etaRender(
      '<%~ include("README.template.md", {...it}) %>',
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
