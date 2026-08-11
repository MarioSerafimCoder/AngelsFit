import assert from "node:assert/strict";
import test from "node:test";

import { isIosDevice } from "../app/native-platform.ts";

test("detects iPhone, iPadOS and native iOS devices", () => {
  assert.equal(isIosDevice({ userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X)", platform: "iPhone", maxTouchPoints: 5, nativePlatform: "web" }), true);
  assert.equal(isIosDevice({ userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)", platform: "MacIntel", maxTouchPoints: 5, nativePlatform: "web" }), true);
  assert.equal(isIosDevice({ nativePlatform: "ios" }), true);
});

test("does not expose the iOS option on Android or desktop browsers", () => {
  assert.equal(isIosDevice({ userAgent: "Mozilla/5.0 (Linux; Android 15; Pixel 9)", platform: "Linux armv8l", maxTouchPoints: 5, nativePlatform: "web" }), false);
  assert.equal(isIosDevice({ userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", platform: "Win32", maxTouchPoints: 0, nativePlatform: "web" }), false);
  assert.equal(isIosDevice({ nativePlatform: "android" }), false);
});
