import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.146.0/testing/asserts.ts";
import { info } from "https://deno.land/std@0.146.0/log/mod.ts";

import { getBranch, getCommit, getRepository, getTag } from "./git.ts";

const testErrorHandler = (message: string, error?: Error) => {
  info(message);
  info(error);
};

Deno.test("git", async (t) => {
  const testingPath = Deno.cwd();

  await t.step("gets the repository url", async () => {
    const url = await getRepository(testingPath, testErrorHandler);
    assertEquals(url, "git@code.eutychia.org:kay/readme-manager.git");
  });

  await t.step("gets the repository branch", async () => {
    const branch = await getBranch(testingPath, testErrorHandler);
    assertEquals(branch, "main");
  });

  await t.step("gets the repository commit", async () => {
    const commit = await getCommit(testingPath, testErrorHandler);
    assert(commit);
  });

  await t.step("gets the repository tag", async () => {
    const tag = await getTag(testingPath, testErrorHandler);
    assert(tag);
  });
});
