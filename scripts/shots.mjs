/**
 * Device-emulated full-page screenshots via the Chrome DevTools Protocol.
 * Unlike `chrome --screenshot --window-size`, this sets the real viewport and
 * captures the full scrollable page.
 *
 *   node scripts/shots.mjs <baseUrl> <outDir> [width] [height] [routes...]
 */
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const outDir = process.argv[3] ?? "shots";
const width = Number(process.argv[4] ?? 390);
const height = Number(process.argv[5] ?? 844);
const routes = process.argv.slice(6);

const DEFAULT_ROUTES = [
  ["/", "home"],
  ["/shop/", "shop"],
  ["/collections/", "collections"],
  ["/collections/new-arrivals/", "collection"],
  ["/products/essential-heavyweight-tee/", "product"],
  ["/products/utility-cargo-pants/", "product-bottoms"],
  ["/cart/", "cart"],
  ["/checkout/", "checkout"],
  ["/search/?q=jersey", "search"],
  ["/policies/delivery/", "policy"],
  ["/nope/", "notfound"],
];

mkdirSync(outDir, { recursive: true });
const profile = mkdtempSync(join(tmpdir(), "cf-shots-"));
const port = 9337;
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
});const send = (method, params = {}) =>
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
await send("Emulation.setTouchEmulationEnabled", { enabled: true, maxTouchPoints: 5 });

const list = routes.length
  ? routes.map((r) => {
      const [path, name] = r.split("::");
      return [path, name || path.replace(/[^\w]+/g, "_")];
    })
  : DEFAULT_ROUTES;

for (const [path, name] of list) {
  await send("Page.navigate", { url: base + path });
  await delay(1500);
  await send("Runtime.evaluate", {
    expression: `(async () => {
      const step = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 150));
      }
      window.scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 700));
    })()`,
    awaitPromise: true,
  });
  await delay(900);

  const metrics = await send("Page.getLayoutMetrics");
  const fullHeight = Math.min(Math.ceil(metrics.cssContentSize.height), 12000);
  const shot = await send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width, height: fullHeight, scale: 1 },
  });
  const file = join(outDir, `${name}-${width}.png`);
  writeFileSync(file, Buffer.from(shot.data, "base64"));

  const overflow = await send("Runtime.evaluate", {
    expression: `(() => {
      const doc = document.documentElement;
      const bad = [];
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect();
        if (!r.width && !r.height) continue;
        const s = getComputedStyle(el);
        if (s.position === 'fixed') continue;
        if (r.right > doc.clientWidth + 1 || r.left < -1) {
          bad.push(el.tagName.toLowerCase() + '.' + String(el.className).slice(0,60) + ' [' + Math.round(r.left) + '→' + Math.round(r.right) + ']');
        }
      }
      return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, bad: bad.slice(0, 8) };
    })()`,
    returnByValue: true,
  });
  const o = overflow.result.value;
  const flag = o.scrollWidth > o.clientWidth + 1 ? "OVERFLOW" : "ok";
  console.log(`${name.padEnd(16)} ${width}px  ${flag}  scroll=${o.scrollWidth}/${o.clientWidth}  -> ${file}`);
  if (o.bad.length) console.log("   ", o.bad.join("\n    "));
}

socket.close();
chrome.kill();
process.exit(0);
