import { ensureDir, move } from "https://deno.land/std@0.146.0/fs/mod.ts";
import { join, resolve } from "https://deno.land/std@0.146.0/path/mod.ts";

import { checkExists } from "./utils.ts";

// this is fugly but eh...
export const readme = `<%~ include("HEADER.template.md", {...it}) %>

<% it.javascripted = 13 + 12 %>

<%= it.javascripted %>

<%= it.readme %>

<%~ include("FOOTER.template.md", {...it}) %>`;

export const header = `# <%= it.name %>

hello world
---
`;

export const footer = `---
made with k by love
`;

export const bootstrap = async (
  templateDirectory: string,
  error: (message: string, error?: Error) => void,
) => {
  if (await checkExists(templateDirectory, error)) {
    console.log(
      "You ran bootstrap mode with present templates, backing up.",
    );
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
    error(
      `Something went wrong trying to boostrap ${readmePath}.`,
      e,
    );
  }
  const headerPath = resolve(join(templateDirectory, "HEADER.template.md"));
  try {
    await Deno.writeTextFile(headerPath, header);
  } catch (e) {
    error(
      `Something went wrong trying to boostrap ${headerPath}.`,
      e,
    );
  }
  const footerPath = resolve(join(templateDirectory, "FOOTER.template.md"));
  try {
    await Deno.writeTextFile(footerPath, footer);
  } catch (e) {
    error(
      `Something went wrong trying to boostrap ${footerPath}.`,
      e,
    );
  }
  console.log(`Template bootstrapping done in ${templateDirectory}.`);
  console.log("Feel free to edit anything to your liking.");
};
