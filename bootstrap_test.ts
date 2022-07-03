import { assertArrayIncludes } from "https://deno.land/std@0.146.0/testing/asserts.ts";
import { info } from "https://deno.land/std@0.146.0/log/mod.ts";

import { bootstrap } from "./bootstrap.ts";

const testErrorHandler = (message: string, error?: Error) => {
  info(message);
  info(error);
};

Deno.test("bootstrap", async (t) => {
  const testingPath = await Deno.makeTempDir();

  await t.step("creates the required files", async () => {
    await bootstrap(testingPath, testErrorHandler);

    const files = Array.from(Deno.readDirSync(testingPath));

    assertArrayIncludes(files, [
      {
        name: "FOOTER.template.md",
        isFile: true,
        isSymlink: false,
        isDirectory: false,
      },
      {
        name: "HEADER.template.md",
        isFile: true,
        isSymlink: false,
        isDirectory: false,
      },
      {
        name: "README.template.md",
        isFile: true,
        isSymlink: false,
        isDirectory: false,
      },
    ]);
  });

  await Deno.remove(testingPath, { recursive: true });
  await Deno.remove(`${testingPath}.old`, { recursive: true });
});
