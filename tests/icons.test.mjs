import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { inflateSync } from "node:zlib";

function inspectPng(buffer) {
  assert.deepEqual([...buffer.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const imageData = [];
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    }
    if (type === "IDAT") imageData.push(data);
    offset += length + 12;
  }
  const raw = inflateSync(Buffer.concat(imageData));
  return { width, height, bitDepth, colorType, firstPixel: [...raw.subarray(1, 4)] };
}

test("iPhone home-screen icons are opaque, square and full bleed", async () => {
  for (const filename of ["apple-touch-icon.png", "apple-touch-icon-precomposed.png"]) {
    const path = fileURLToPath(new URL(`../public/${filename}`, import.meta.url));
    const metadata = inspectPng(await readFile(path));
    assert.equal(metadata.width, 180);
    assert.equal(metadata.height, 180);
    assert.equal(metadata.bitDepth, 8);
    assert.equal(metadata.colorType, 2);
    assert.deepEqual(metadata.firstPixel, [255, 98, 0]);
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
