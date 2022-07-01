import { ensureDir } from "https://deno.land/std@0.146.0/fs/mod.ts";
import { join, resolve } from "https://deno.land/std@0.146.0/path/mod.ts";

// this is fugly but eh...
export const mod = `
import { basename } from "https://deno.land/std@0.146.0/path/mod.ts";
import * as Eta from "https://deno.land/x/eta@v1.12.3/mod.ts";

const __dirname = new URL(".", import.meta.url).pathname;

export default (
  readmeFilePath: string,
  readmeDirectoryPath: string,
  readmeTemplate: string,
): string | Promise<string> | void => {
  const template = \`<%~ includeFile("HEADER.template.md", {...it}) %>

\${readmeTemplate}\`.replaceAll('includeFile("', \`includeFile("\${__dirname}\`);
  try {
    return Eta.render(
      template,
      {
        name: basename(readmeDirectoryPath),
      },
    );
  } catch (e) {
    console.error(e);
    Deno.exit(1);
  }
};
`;

export const header = `# <%= it.name %>

hello world
`;

export const footer = `---
made with k by love
`;

export const bootstrap = async (
  templateDirectory: string,
  error: (message: string, error?: Error) => void,
) => {
  try {
    await ensureDir(templateDirectory);
  } catch (e) {
    error(
      `Something went wrong trying to create the templates directory at ${templateDirectory}.`,
      e,
    );
  }
  const modPath = resolve(join(templateDirectory, "mod.ts"));
  try {
    await Deno.writeTextFile(modPath, mod);
  } catch (e) {
    error(
      `Something went wrong trying to boostrap ${modPath}.`,
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
