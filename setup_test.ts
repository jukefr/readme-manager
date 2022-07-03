import { getLogger } from "https://deno.land/std@0.146.0/log/mod.ts";

import { setup } from "./setup.ts";

Deno.test("setup", async (t) => {
  const testingDir = await Deno.makeTempDir();
  const testingFile = await Deno.makeTempFile();
  await Deno.remove(testingDir);

  await t.step("setups", async () => {
    await setup(
      "testing-readme-manager",
      testingFile,
      getLogger(),
      (_errorMsg: string, _error?: Error) => {},
      testingDir,
    );
  });

  await Deno.remove(testingDir, { recursive: true });
  await Deno.remove(testingFile);
});
