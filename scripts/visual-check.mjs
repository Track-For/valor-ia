import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const outputDir = path.resolve("artifacts", "visual");
const targets = [
  ["hero", "#inicio"],
  ["universe", "#universo"],
  ["products", "#produtos"],
  ["report", ".report"],
  ["app", "#app"],
  ["wealth", "#wealth"],
  ["companies", "#empresas"],
  ["simulator", "#simulador"],
  ["tiers", "#atendimento"],
  ["manifesto", ".manifesto"],
  ["faq", "#faq"],
  ["cta", ".final-cta"],
  ["footer", ".footer"],
];

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: edgePath,
  headless: true,
});

const results = [];

for (const viewport of [
  { name: "mobile-320", width: 320, height: 568 },
  { name: "mobile-360", width: 360, height: 800 },
  { name: "mobile-375", width: 375, height: 812 },
  { name: "mobile", width: 390, height: 844, full: true },
  { name: "mobile-430", width: 430, height: 932 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "compact-900", width: 900, height: 600, scroll: true },
  { name: "tablet-landscape", width: 1024, height: 768 },
  { name: "desktop-short", width: 1200, height: 600, scroll: true },
  { name: "desktop-1366", width: 1366, height: 768 },
  { name: "desktop", width: 1440, height: 900, full: true },
  { name: "desktop-1920", width: 1920, height: 1080 },
]) {
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
  });
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(2100);

  const overflow = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    innerHeight: window.innerHeight,
    title: document.title,
    heading: document.querySelector("h1")?.textContent?.trim(),
    offenders: Array.from(document.querySelectorAll("*"))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          className: typeof element.className === "string" ? element.className : "",
          left: Math.round(rect.left),
          right: Math.round(rect.right),
        };
      })
      .filter((element) => element.left < -1 || element.right > window.innerWidth + 1)
      .slice(0, 12),
  }));

  const captureTargets = viewport.full ? targets : [["hero", "#inicio"]];
  for (const [name, selector] of captureTargets) {
    const target = page.locator(selector).first();
    await target.scrollIntoViewIfNeeded();
    await page.waitForTimeout(name === "hero" ? 300 : 760);
    await page.screenshot({
      path: path.join(outputDir, `${viewport.name}-${name}.png`),
      animations: "allow",
    });
  }

  let scrollState;
  if (viewport.scroll) {
    await page.evaluate(() => window.scrollTo(0, Math.round(window.innerHeight * 0.35)));
    await page.waitForTimeout(700);
    await page.screenshot({
      path: path.join(outputDir, `${viewport.name}-hero-scroll.png`),
      animations: "allow",
    });
    scrollState = await page.evaluate(() => ({
      scrollY: Math.round(window.scrollY),
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      heroTop: Math.round(document.querySelector("#inicio")?.getBoundingClientRect().top ?? 0),
    }));
  }

  results.push({ viewport, overflow, scrollState, errors });
  await page.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
