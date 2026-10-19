/**
 * Captures overlay UI (cart drawer, filter drawer, mobile menu, search) at a
 * device-emulated viewport.
 *
 *   node scripts\overlays.mjs <baseUrl> <outDir> <width> <height>
 */
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = process.argv[2].replace(/\/$/, "");
const outDir = process.argv[3];
const width = Number(process.argv[4] ?? 390);
const height = Number(process.argv[5] ?? 844);

mkdirSync(outDir, { recursive: true });
const profile = mkdtempSync(join(tmpdir(), "cf-ov-"));
const port = 9339;
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
const evaluate = async (expression) => {
  const { result } = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  return result.value;
};

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

async function shot(name) {
  const s = await send("Page.captureScreenshot", { format: "png" });
  const file = join(outDir, `${name}.png`);
  writeFileSync(file, Buffer.from(s.data, "base64"));
  console.log(file);
}

// 1. Mobile menu
await send("Page.navigate", { url: base + "/" });
await delay(2000);
await evaluate(`[...document.querySelectorAll('button')].find(b => /open menu/i.test(b.getAttribute('aria-label')||''))?.click()`);
await delay(900);
await shot("mobile-menu");

// 2. Search overlay
await send("Page.navigate", { url: base + "/" });
await delay(1800);
await evaluate(`[...document.querySelectorAll('button')].find(b => /search products/i.test(b.getAttribute('aria-label')||''))?.click()`);
await delay(700);
await evaluate(`(() => {
  const i = document.querySelector('[role="dialog"] input[type="search"]');
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(i, 'oversized');
  i.dispatchEvent(new Event('input', { bubbles: true }));
})()`);
await delay(800);
await shot("search-overlay");

// 3. Filter drawer
await send("Page.navigate", { url: base + "/shop/" });
await delay(2000);
await evaluate(`[...document.querySelectorAll('button')].find(b => /filters/i.test(b.textContent))?.click()`);
await delay(900);
await shot("filter-drawer");

// 4. Cart drawer (with an item)
await send("Page.navigate", { url: base + "/products/utility-cargo-pants/" });
await delay(2000);
await evaluate(`(() => {
  [...document.querySelectorAll('button')].find(b => b.textContent.trim() === '32')?.click();
  return new Promise(r => setTimeout(() => {
    [...document.querySelectorAll('button')].find(b => /add to bag/i.test(b.textContent))?.click();
    setTimeout(() => r(true), 500);
  }, 250));
})()`);
await delay(700);
await evaluate(`[...document.querySelectorAll('button')].find(b => /open shopping bag/i.test(b.getAttribute('aria-label')||''))?.click()`);
await delay(900);
await shot("cart-drawer");

socket.close();
chrome.kill();
process.exit(0);
