import { dirname } from "https://deno.land/std@0.146.0/path/mod.ts";

import { render } from "./render.ts";

Deno.test("render", async (t) => {
  const testingDir = await Deno.makeTempDir();
  const testingFile = await Deno.makeTempFile();

  await t.step("renders", async () => {
    await render(
      testingFile,
      dirname(testingFile),
      "# hello world",
      testingDir,
      (_errorMsg: string, _error?: Error) => {},
    );
  });

  await Deno.remove(testingDir);
  await Deno.remove(testingFile);
});
