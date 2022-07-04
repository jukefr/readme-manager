import { ensureDir, move } from "https://deno.land/std@0.146.0/fs/mod.ts";
import { join, resolve } from "https://deno.land/std@0.146.0/path/mod.ts";

import { checkExists } from "./utils.ts";

/**
 * Base template used to include other.
 * Allow javascript and async function calls.
 */
export const readme = `<%~ await include("HEADER.template.md", {...it}) %>

<% it.javascripted = 13 + 12 %>

<%= it.javascripted %>

<% it.asyncJavascripted = await fetch("https://jsonplaceholder.typicode.com/todos/1").then(r => r.json()) %>

<%= it.asyncJavascripted.title %>

<%= it.readme %>

<%~ await include("FOOTER.template.md", {...it}) %>`;

/**
 * Example header template.
 */
export const header = `# <%= it.name %>

hello world
---
`;

/**
 * Example footer template.
 */
export const footer = `---
made with k by love

<%= await fetch("https://jsonplaceholder.typicode.com/todos/2").then(r => r.json()).then(r => JSON.stringify(r)) %>
`;

/**
 * Bootstrap template files in a specified directory.
 * Creates the required files for readme-manager.
 *
 * ```ts
 * import { bootstrap } from "./bootstrap.ts"
 * await bootstrap('/path/to/templates', (errorMsg: string, error?: Error) => {})
 * ```
 *
 * @param {string} templateDirectory Directory where files should be created.
 * @param {function(string, Error)} error Handler for errors.
 */
export const bootstrap = async (
  templateDirectory: string,
  error: (message: string, error?: Error) => void,
) => {
  if (await checkExists(templateDirectory, error)) {
    console.log("You ran bootstrap mode with present templates, backing up.");
    try {
      await move(templateDirectory, `${templateDirectory}.old`, {
        overwrite: true,
      });
    } catch (e) {
      error("Something went wrong backing up your templates.", e);
    }
  }

  try {
    await ensureDir(templateDirectory);
  } catch (e) {
    error(
      `Something went wrong trying to create the templates directory at ${templateDirectory}.`,
      e,
    );
  }
  const readmePath = resolve(join(templateDirectory, "README.template.md"));
  try {
    await Deno.writeTextFile(readmePath, readme);
  } catch (e) {
    error(`Something went wrong trying to boostrap ${readmePath}.`, e);
  }
  const headerPath = resolve(join(templateDirectory, "HEADER.template.md"));
  try {
    await Deno.writeTextFile(headerPath, header);
  } catch (e) {
    error(`Something went wrong trying to boostrap ${headerPath}.`, e);
  }
  const footerPath = resolve(join(templateDirectory, "FOOTER.template.md"));
  try {
    await Deno.writeTextFile(footerPath, footer);
  } catch (e) {
    error(`Something went wrong trying to boostrap ${footerPath}.`, e);
  }
  console.log(`Template bootstrapping done in ${templateDirectory}.`);
  console.log("Feel free to edit anything to your liking.");
};
