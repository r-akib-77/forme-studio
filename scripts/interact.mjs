/**
 * End-to-end interaction smoke test against a running FORME STUDIO build.
 * Drives the real UI with Chrome DevTools Protocol and asserts the outcomes.
 *
 *   node scripts/interact.mjs <baseUrl>
 */
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const port = 9334;

const profile = mkdtempSync(join(tmpdir(), "cf-interact-"));
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
      /* waiting */
    }
    await delay(250);
  }
  throw new Error("devtools never came up");
}

const socket = new WebSocket(await findTarget());
await new Promise((res, rej) => {
  socket.addEventListener("open", res, { once: true });
  socket.addEventListener("error", rej, { once: true });
});

let msgId = 0;
const pending = new Map();
socket.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    const { resolve, reject } = pending.get(m.id);
    pending.delete(m.id);
    if (m.error) reject(new Error(JSON.stringify(m.error)));
    else resolve(m.result);
  }
});
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = ++msgId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 1440,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});

const evaluate = async (expression) => {
  const { result, exceptionDetails } = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (exceptionDetails) throw new Error(exceptionDetails.text + " " + JSON.stringify(exceptionDetails.exception?.description ?? ""));
  return result.value;
};

const go = async (path) => {
  await send("Page.navigate", { url: base + path });
  await delay(1500);
  await evaluate("document.fonts.ready.then(() => true)");
};

const results = [];
const check = (name, pass, detail = "") => {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`);
};

/* ------------------------------------------------------------------ tests */

await go("/");
await evaluate("localStorage.clear()");
await go("/products/essential-heavyweight-tee/");

// 1. Add to bag is blocked until a size is chosen.
let blocked = await evaluate(`(() => {
  const btn = [...document.querySelectorAll('button')].find(b => /add to bag/i.test(b.textContent));
  btn.click();
  return new Promise(r => setTimeout(() => r(!!document.querySelector('[role="alert"]')), 400));
})()`);
check("Add to bag blocked without a size", blocked === true);

// 2. Choose a size, then add.
const added = await evaluate(`(() => {
  const size = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'M');
  size.click();
  return new Promise(r => setTimeout(() => {
    const btn = [...document.querySelectorAll('button')].find(b => /add to bag/i.test(b.textContent));
    btn.click();
    setTimeout(() => r(true), 500);
  }, 200));
})()`);
check("Size selection then add to bag", added === true);

const badge = await evaluate(`(() => {
  const bag = [...document.querySelectorAll('button')].find(b => /open shopping bag/i.test(b.getAttribute('aria-label') || ''));
  return bag ? bag.getAttribute('aria-label') : null;
})()`);
check("Header bag count updates", /1 item/.test(badge || ""), badge);

// 3. Cart drawer opens with the line and totals.
const drawer = await evaluate(`(() => {
  const bag = [...document.querySelectorAll('button')].find(b => /open shopping bag/i.test(b.getAttribute('aria-label') || ''));
  bag.click();
  return new Promise(r => setTimeout(() => {
    const dlg = document.querySelector('[role="dialog"][aria-label="Shopping bag"]');
    if (!dlg) return r({ ok: false });
    const text = dlg.innerText;
    r({
      ok: true,
      hasProduct: /Essential Heavyweight Tee/.test(text),
      hasVariant: /Size M/i.test(text),
      hasTotal: /Total/i.test(text) && /৳/.test(text),
      subtotal: (text.match(/Subtotal\\s*৳([\\d,]+)/) || [])[1] || null,
    });
  }, 700));
})()`);
check(
  "Cart drawer lists the item with variant and total",
  drawer.ok && drawer.hasProduct && drawer.hasVariant && drawer.hasTotal,
  JSON.stringify(drawer),
);

// 4. Quantity increment updates the line total.
const qty = await evaluate(`(() => {
  const dlg = document.querySelector('[role="dialog"][aria-label="Shopping bag"]');
  const inc = [...dlg.querySelectorAll('button')].find(b => /increase quantity/i.test(b.getAttribute('aria-label') || ''));
  inc.click();
  return new Promise(r => setTimeout(() => {
    const t = dlg.innerText;
    r({ subtotal: (t.match(/Subtotal\\s*৳([\\d,]+)/) || [])[1] || null, has2: /৳2,980/.test(t) });
  }, 500));
})()`);
check("Quantity increment updates subtotal to ৳2,980", qty.has2 === true, JSON.stringify(qty));

// 5. Cart persists across a reload.
await go("/cart/");
const persisted = await evaluate(`(() => {
  const t = document.body.innerText;
  return { hasProduct: /Essential Heavyweight Tee/.test(t), qty2: /2/.test(t) };
})()`);
check(
  "Cart persists after navigation to the cart page",
  persisted.hasProduct === true,
  JSON.stringify(persisted),
);

// 6. Remove the item empties the cart.
const removed = await evaluate(`(() => {
  const rm = [...document.querySelectorAll('button')].find(b => /remove .* from bag/i.test(b.getAttribute('aria-label') || ''));
  rm.click();
  return new Promise(r => setTimeout(() => {
    r({ empty: /your bag is empty/i.test(document.body.innerText) });
  }, 500));
})()`);
check("Removing the line empties the cart", removed.empty === true);

// 7. Search overlay returns live results.
await go("/");
const search = await evaluate(`(() => {
  const btn = [...document.querySelectorAll('button')].find(b => /search products/i.test(b.getAttribute('aria-label') || ''));
  btn.click();
  return new Promise(r => setTimeout(() => {
    const input = document.querySelector('[role="dialog"] input[type="search"]');
    if (!input) return r({ ok: false });
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(input, 'cargo');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    setTimeout(() => {
      const dlg = document.querySelector('[role="dialog"]');
      const links = dlg.querySelectorAll('a[href^="/products/"]');
      r({ ok: true, count: links.length, first: links[0]?.getAttribute('href') || null, viewAll: /view all/i.test(dlg.innerText) });
    }, 600);
  }, 700));
})()`);
check(
  "Search overlay returns live product results",
  search.ok && search.count > 0 && !!search.viewAll,
  JSON.stringify(search),
);

// 8. Search with no matches shows the empty state.
const noMatch = await evaluate(`(() => {
  const input = document.querySelector('[role="dialog"] input[type="search"]');
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(input, 'zzzzqqq');
  input.dispatchEvent(new Event('input', { bubbles: true }));
  return new Promise(r => setTimeout(() => {
    r({ empty: /no results/i.test(document.querySelector('[role="dialog"]').innerText) });
  }, 600));
})()`);
check("Search shows a no-results state", noMatch.empty === true);

// 9. Escape closes the search overlay.
const closed = await evaluate(`(() => {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  return new Promise(r => setTimeout(() => r(!document.querySelector('[role="dialog"]')), 500));
})()`);
check("Escape closes the search overlay", closed === true);

// 10. Catalogue filtering narrows the grid.
await go("/shop/");
const filtered = await evaluate(`(() => {
  const before = document.querySelectorAll('article').length;
  const label = [...document.querySelectorAll('label')].find(l => /^Jerseys/i.test(l.innerText.trim()));
  const box = label && label.querySelector('input[type="checkbox"]');
  if (!box) return { error: 'no jersey checkbox' };
  box.click();
  return new Promise(r => setTimeout(() => {
    const after = document.querySelectorAll('article').length;
    const chips = /clear all/i.test(document.body.innerText);
    r({ before, after, chips });
  }, 500));
})()`);
check(
  "Category filter narrows the product grid and shows chips",
  filtered.before > filtered.after && filtered.after > 0 && filtered.chips,
  JSON.stringify(filtered),
);

// 11. Sorting by price works.
const sorted = await evaluate(`(() => {
  const sel = document.getElementById('sort-select');
  const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;
  setter.call(sel, 'price-asc');
  sel.dispatchEvent(new Event('change', { bubbles: true }));
  return new Promise(r => setTimeout(() => {
    const prices = [...document.querySelectorAll('article')].map(a => {
      const m = a.innerText.match(/৳([\\d,]+)/);
      return m ? Number(m[1].replace(/,/g, '')) : null;
    }).filter(v => v !== null);
    r({ first: prices[0], last: prices[prices.length - 1], ascending: prices.every((v, i) => i === 0 || prices[i - 1] <= v) });
  }, 600));
})()`);
check("Price low-to-high sort is applied", sorted.ascending === true, JSON.stringify(sorted));

// 12. Narrowing the price range to nothing shows the empty state with a reset.
const emptyState = await evaluate(`(() => {
  const range = document.querySelector('input[type="range"]');
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(range, range.min);
  range.dispatchEvent(new Event('change', { bubbles: true }));
  return new Promise(r => setTimeout(() => {
    r({
      hasEmpty: /nothing matches those filters/i.test(document.body.innerText),
      hasReset: !!([...document.querySelectorAll('button')].find(b => /reset filters/i.test(b.textContent))),
    });
  }, 600));
})()`);
check(
  "Impossible filter combination shows the empty state with a reset",
  emptyState.hasEmpty === true && emptyState.hasReset === true,
  JSON.stringify(emptyState),
);

// 12b. Reset restores the full grid.
const reset = await evaluate(`(() => {
  const btn = [...document.querySelectorAll('button')].find(b => /reset filters/i.test(b.textContent));
  btn.click();
  return new Promise(r => setTimeout(() => r(document.querySelectorAll('article').length), 600));
})()`);
check("Reset filters restores the full catalogue", reset === 25, `${reset} products`);

// 13. Checkout validation blocks an empty submit.
// Put something in the bag first so the checkout form renders.
await go("/products/utility-cargo-pants/");
await evaluate(`(() => {
  const size = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === '32');
  size.click();
  return new Promise(r => setTimeout(() => {
    [...document.querySelectorAll('button')].find(b => /add to bag/i.test(b.textContent)).click();
    setTimeout(() => r(true), 400);
  }, 200));
})()`);
await go("/checkout/");

const validation = await evaluate(`(() => {
  const submit = [...document.querySelectorAll('button[type="submit"]')].find(b => /place demo order/i.test(b.textContent));
  if (!submit) return { error: 'no submit button' };
  submit.click();
  return new Promise(r => setTimeout(() => {
    const alerts = [...document.querySelectorAll('[role="alert"]')].map(a => a.innerText);
    r({ count: alerts.length, alerts });
  }, 500));
})()`);
check(
  "Checkout blocks submission and shows inline errors",
  validation.count >= 3,
  `${validation.count} errors: ${(validation.alerts || []).join(" | ")}`,
);

// 14. Invalid Bangladeshi phone is rejected.
const badPhone = await evaluate(`(() => {
  const phone = document.getElementById('checkout-phone');
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  setter.call(phone, '12345');
  phone.dispatchEvent(new Event('input', { bubbles: true }));
  const submit = [...document.querySelectorAll('button[type="submit"]')].find(b => /place demo order/i.test(b.textContent));
  submit.click();
  return new Promise(r => setTimeout(() => {
    r({ msg: document.getElementById('checkout-phone-error')?.innerText || null });
  }, 400));
})()`);
check(
  "Invalid mobile number shows a Bangladesh-specific error",
  /Bangladeshi/i.test(badPhone.msg || ""),
  badPhone.msg,
);

// 15. Valid submission produces a demo confirmation and clears the cart.
const confirmed = await evaluate(`(() => {
  const set = (id, v) => {
    const el = document.getElementById(id);
    const setter = Object.getOwnPropertyDescriptor(el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype, 'value').set;
    setter.call(el, v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  };
  set('checkout-name', 'Nusrat Jahan');
  set('checkout-phone', '01712345678');
  set('checkout-address', 'House 42, Road 11, Banani');
  const district = document.getElementById('checkout-district');
  const ds = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;
  ds.call(district, 'Dhaka');
  district.dispatchEvent(new Event('change', { bubbles: true }));
  return new Promise(r => setTimeout(() => {
    const submit = [...document.querySelectorAll('button[type="submit"]')].find(b => /place demo order/i.test(b.textContent));
    submit.click();
    setTimeout(() => {
      const t = document.body.innerText;
      r({
        ref: (t.match(/FMS-\\d{6}-\\d{4}/) || [])[0] || null,
        demo: /demonstration/i.test(t),
        noReal: /no order has been created/i.test(t),
        total: (t.match(/Total payable\\s*৳([\\d,]+)/) || [])[1] || null,
      });
    }, 2600);
  }, 300));
})()`);
check(
  "Valid checkout shows a demo reference and the no-real-order notice",
  !!confirmed.ref && confirmed.demo && confirmed.noReal,
  JSON.stringify(confirmed),
);

// 16. The cart is emptied after checkout.
const cleared = await evaluate(`(() => {
  const bag = [...document.querySelectorAll('button')].find(b => /open shopping bag/i.test(b.getAttribute('aria-label') || ''));
  return { label: bag?.getAttribute('aria-label') || null };
})()`);
check("Cart is cleared after the demo order", /0 items/.test(cleared.label || ""), cleared.label);

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
socket.close();
chrome.kill();
process.exit(failed.length ? 1 : 0);
