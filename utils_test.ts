import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.146.0/testing/asserts.ts";

import {
  getAppConfigDirectory,
  getAppConfigFile,
  getAppLogFile,
  getUserConfigDirectory,
  runCommand,
} from "./utils.ts";

Deno.test("utils", async (t) => {
  await t.step("run command", async () => {
    const output = await runCommand(
      ["echo", "testing"],
      (_errorMsg: string, _error?: Error) => {},
    );
    assertEquals(output, "testing");
  });

  await t.step("get user config directory", () => {
    assert(
      getUserConfigDirectory(
        (_errorMsg: string, _error?: Error) => {},
      ),
    );
  });

  await t.step("get app config directory", () => {
    assert(
      getAppConfigDirectory(
        "testing-readme-manager",
        (_errorMsg: string, _error?: Error) => {},
      ),
    );
  });

  await t.step("get app config file", () => {
    assert(
      getAppConfigFile(
        "testing-readme-manager",
        (_errorMsg: string, _error?: Error) => {},
      ),
    );
  });

  await t.step("get app log file", () => {
    assert(
      getAppLogFile(
        "testing-readme-manager",
      ),
    );
  });
});
