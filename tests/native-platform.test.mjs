import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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

test("ships a reproducible, hardened Android container with native backup", async () => {
  const [config, build, manifest, nativeBridge] = await Promise.all([
    readFile(new URL("../capacitor.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../android/app/build.gradle", import.meta.url), "utf8"),
    readFile(new URL("../android/app/src/main/AndroidManifest.xml", import.meta.url), "utf8"),
    readFile(new URL("../app/native-platform.ts", import.meta.url), "utf8"),
  ]);

  assert.match(config, /appId:\s*"com\.angelsfit\.app"/);
  assert.match(config, /webDir:\s*"native-dist"/);
  assert.match(config, /webContentsDebuggingEnabled:\s*false/);
  assert.match(build, /versionName "1\.1\.0"/);
  assert.match(build, /minifyEnabled true/);
  assert.match(build, /shrinkResources true/);
  assert.match(manifest, /android:usesCleartextTraffic="false"/);
  assert.match(manifest, /android:screenOrientation="portrait"/);
  assert.match(nativeBridge, /shareNativeBackup/);
  assert.match(nativeBridge, /LocalNotifications/);
});
