import assert from "node:assert/strict";
import test from "node:test";

import { defaultRestSeconds } from "../app/rest-policy.ts";

const profile = { goal: "Hipertrofia", experience: "Intermediário", days: ["Seg"], duration: "45 min", location: "Academia", limitations: "" };

test("uses 30 seconds for trained people without conditions or limitations", () => {
  assert.equal(defaultRestSeconds(profile, []), 30);
  assert.equal(defaultRestSeconds({ ...profile, experience: "Avançado", goal: "Força" }, []), 30);
});

test("keeps protective rest when a condition or limitation is present", () => {
  assert.equal(defaultRestSeconds({ ...profile, limitations: "falta de ar" }, ["cardiovascular"]), 90);
  assert.equal(defaultRestSeconds({ ...profile, experience: "Iniciante" }, []), 75);
});
