import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

test("iPhone home-screen icons are opaque, square and full bleed", async () => {
  for (const filename of ["apple-touch-icon.png", "apple-touch-icon-precomposed.png"]) {
    const path = fileURLToPath(new URL(`../public/${filename}`, import.meta.url));
    const metadata = await sharp(path).metadata();
    const { data, info } = await sharp(path).raw().toBuffer({ resolveWithObject: true });

    assert.equal(metadata.width, 180);
    assert.equal(metadata.height, 180);
    assert.equal(metadata.hasAlpha, false);
    assert.equal(info.channels, 3);
    assert.deepEqual([...data.subarray(0, 3)], [255, 98, 0]);
  }

  assert.deepEqual(
    await readFile(new URL("../public/apple-touch-icon.png", import.meta.url)),
    await readFile(new URL("../public/apple-touch-icon-precomposed.png", import.meta.url)),
  );

  const standardSvg = await readFile(new URL("../public/icon.svg", import.meta.url), "utf8");
  const maskableSvg = await readFile(new URL("../public/icon-maskable.svg", import.meta.url), "utf8");
  const profile = await readFile(new URL("../public/AngelsFit.mobileconfig", import.meta.url), "utf8");
  const embeddedIcon = profile.match(/<key>Icon<\/key>\s*<data>([\s\S]*?)<\/data>/)?.[1];
  assert.match(standardSvg, /id="angelsfit-a"/);
  assert.match(maskableSvg, /id="angelsfit-a"/);
  assert.doesNotMatch(standardSvg, /brasafit|letter B|letra B/i);
  assert.ok(embeddedIcon, "the iPhone install profile should embed its icon");
  assert.deepEqual(Buffer.from(embeddedIcon.replaceAll(/\s/g, ""), "base64"), await readFile(new URL("../public/apple-touch-icon.png", import.meta.url)));
});
