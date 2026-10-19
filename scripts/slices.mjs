/**
 * Device-emulated viewport slices — readable screenshots at real mobile size.
 *
 *   node scripts/slices.mjs <baseUrl> <outDir> <width> <height> <route> [name] [maxSlices]
 */
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = (process.argv[2]).replace(/\/$/, "");
const outDir = process.argv[3];
const width = Number(process.argv[4]);
const height = Number(process.argv[5]);
const route = process.argv[6];
const name = process.argv[7] ?? "page";
const maxSlices = Number(process.argv[8] ?? 6);
/** Optional: seed the cart before capturing (e.g. "prefill" for checkout). */
const prefill = process.argv[9] === "prefill";

mkdirSync(outDir, { recursive: true });
const profile = mkdtempSync(join(tmpdir(), "cf-slices-"));
const port = 9338;
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);
process.on("exit", () => chrome.kill());

async function target() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const t = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      const p = t.find((x) => x.type === "page");
      if (p?.webSocketDebuggerUrl) return p.webSocketDebuggerUrl;
    } catch {
      /* waiting */
    }
    await delay(250);
  }
  throw new Error("no devtools");
}

const socket = new WebSocket(await target());
await new Promise((r) => socket.addEventListener("open", r, { once: true }));
let id = 0;
const pend = new Map();
socket.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pend.has(m.id)) {
    const p = pend.get(m.id);
    pend.delete(m.id);
    if (m.error) p.reject(new Error(JSON.stringify(m.error)));
    else p.resolve(m.result);
  }
});
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const i = ++id;
    pend.set(i, { resolve, reject });
    socket.send(JSON.stringify({ id: i, method, params }));
  });

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width,
  height,
  deviceScaleFactor: 2,
  mobile: true,
  screenWidth: width,
  screenHeight: height,
});

await send("Page.navigate", { url: base + route });
await delay(1800);

if (prefill) {
  await send("Page.navigate", { url: base + "/products/utility-cargo-pants/" });
  await delay(1800);
  await send("Runtime.evaluate", {
    expression: `(async () => {
      const click = (re) => {
        const el = [...document.querySelectorAll('button')].find(b => re.test(b.textContent.trim()));
        if (el) el.click();
      };
      click(/^32$/);
      await new Promise(r => setTimeout(r, 250));
      click(/add to bag/i);
      await new Promise(r => setTimeout(r, 600));
      const other = [...document.querySelectorAll('button')].find(b => /^add to bag$/i.test(b.textContent.trim()));
      if (other) other.click();
      await new Promise(r => setTimeout(r, 600));
      return true;
    })()`,
    awaitPromise: true,
  });
  await send("Page.navigate", { url: base + route });
  await delay(2000);
}
await send("Runtime.evaluate", {
  expression: `(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 140));
    }
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 600));
  })()`,
  awaitPromise: true,
});
await delay(600);

const total = await send("Runtime.evaluate", {
  expression: "document.body.scrollHeight",
  returnByValue: true,
});
const pages = Math.min(maxSlices, Math.ceil(total.result.value / height));

for (let i = 0; i < pages; i += 1) {
  const y = i * height;
  await send("Runtime.evaluate", {
    expression: `window.scrollTo(0, ${y})`,
  });
  await delay(450);
  const shot = await send("Page.captureScreenshot", { format: "png" });
  const file = join(outDir, `${name}-${i + 1}.png`);
  writeFileSync(file, Buffer.from(shot.data, "base64"));
  console.log(file);
}

socket.close();
chrome.kill();
process.exit(0);
