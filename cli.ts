import { parse } from "https://deno.land/std@0.146.0/flags/mod.ts";

import { help } from "./help.ts";
import { manager } from "./manager.ts";

/**
 * Cli running mode
 *
 * @param {string[]} args The Deno.args array
 * @returns {Promise<void | string | undefined>}
 */
export const cli = (args: string[]): Promise<void | string | undefined> => {
  const parsedArgs = parse(args);

  if (parsedArgs.help) {
    help.map((msg) => console.log(msg));
    Deno.exit(0);
  }

  return manager(parsedArgs, true);
};

await cli(Deno.args);
