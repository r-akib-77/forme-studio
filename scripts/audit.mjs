/**
 * Responsive audit: loads a URL in headless Chrome at several viewport widths
 * and reports horizontal overflow, element widths and console/network errors.
 *
 *   node scripts/audit.mjs <url> [width,height ...]
 */
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const url = process.argv[2] ?? "http://localhost:3000/";
const viewports = (process.argv[3] ?? "320,375,390,430,768,1024,1440,1920")
  .split(",")
  .map((pair) => {
    const [w, h] = pair.split("x").map(Number);
    return { width: w || Number(pair), height: h || 900 };
  });

const profile = mkdtempSync(join(tmpdir(), "cf-audit-"));
const port = 9333;

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

async function findTarget() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      const targets = await res.json();
      const page = targets.find((t) => t.type === "page");
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {
      /* not up yet */
    }
    await delay(250);
  }
  throw new Error("Chrome DevTools endpoint never came up");
}

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.events = [];
    ws.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
      } else if (msg.method) {
        this.events.push(msg);
      }
    });
  }
  send(method, params = {}) {
    this.id += 1;
    const id = this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
}

const wsUrl = await findTarget();
const socket = new WebSocket(wsUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});
const cdp = new Cdp(socket);

await cdp.send("Page.enable");
await cdp.send("Runtime.enable");
await cdp.send("Log.enable");
await cdp.send("Network.enable");

const audit = `(() => {
  const doc = document.documentElement;
  const vw = doc.clientWidth;
  const offenders = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    const style = getComputedStyle(el);
    if (style.position === 'fixed') continue;
    if (r.right > vw + 1 || r.left < -1) {
      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className && el.className.baseVal !== undefined ? el.className.baseVal : String(el.className || '')).slice(0, 90),
        left: Math.round(r.left),
        right: Math.round(r.right),
        w: Math.round(r.width),
        text: (el.textContent || '').trim().slice(0, 40),
      });
    }
  }
  return {
    scrollWidth: doc.scrollWidth,
    clientWidth: vw,
    bodyScrollWidth: document.body.scrollWidth,
    offenders: offenders.slice(0, 12),
    fonts: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight).slice(0, 8),
    broken: Array.from(document.images)
      .filter(i => i.complete && i.naturalWidth === 0)
      .map(i => (i.currentSrc || i.src || i.getAttribute('src') || '?').split('/').slice(-2).join('/'))
      .slice(0, 12),
    pending: Array.from(document.images).filter(i => !i.complete).length,
    imageCount: document.images.length,
  };
})()`;

for (const vp of viewports) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: vp.width,
    height: vp.height,
    deviceScaleFactor: 1,
    mobile: vp.width < 768,
  });
  await cdp.send("Page.navigate", { url });
  await delay(1200);
  // Scroll the page so lazy-loaded images are requested before measuring.
  await cdp.send("Runtime.evaluate", {
    expression: `(async () => {
      const step = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 900));
    })()`,
    awaitPromise: true,
  });
  await delay(700);
  const { result } = await cdp.send("Runtime.evaluate", {
    expression: audit,
    returnByValue: true,
  });
  const r = result.value;
  const overflow = r.scrollWidth > r.clientWidth + 1;
  console.log(
    `\n=== ${vp.width}px === client=${r.clientWidth} scroll=${r.scrollWidth} ` +
      `${overflow ? "❌ H-OVERFLOW" : "✅ no overflow"} | imgs=${r.imageCount} ` +
      `broken=${r.broken.length} pending=${r.pending}`,
  );
  if (r.broken.length) console.log("   broken images:", JSON.stringify(r.broken));
  if (overflow) {
    console.log("   offenders:", JSON.stringify(r.offenders, null, 1).slice(0, 1600));
  }
  console.log("   fonts:", (r.fonts || []).join(", ") || "none loaded");
  const errors = cdp.events
    .filter((e) => e.method === "Log.entryAdded" && e.params.entry.level === "error")
    .map((e) => e.params.entry.text + (e.params.entry.url ? " :: " + e.params.entry.url : ""));
  if (errors.length) console.log("   console errors:", [...new Set(errors)].slice(0, 6));
  const failed = cdp.events
    .filter((e) => e.method === "Network.loadingFailed")
    .map((e) => e.params.errorText);
  if (failed.length) console.log("   network failures:", [...new Set(failed)].slice(0, 5));
  cdp.events.length = 0;
}

socket.close();
chrome.kill();
process.exit(0);
