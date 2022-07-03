import { assertThrows } from "https://deno.land/std@0.146.0/testing/asserts.ts";

import { error } from "./log.ts";

Deno.test("log", async (t) => {
  const testingPath = await Deno.makeTempFile();

  await t.step("error handler", () => {
    const errorHandler = error(testingPath);
    assertThrows(() => {
      errorHandler("Testing.");
    });
  });

  await t.step("error handler debug mode", () => {
    const errorHandler = error(testingPath, false, true);
    assertThrows(() => {
      errorHandler("Testing.");
    });
  });

  await Deno.remove(testingPath);
});
