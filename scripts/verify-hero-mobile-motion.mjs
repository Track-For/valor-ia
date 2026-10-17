import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: true,
});

try {
  for (const lowPower of [false, true]) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

    if (lowPower) {
      await page.addInitScript(() => {
        Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 2 });
        Object.defineProperty(navigator, "deviceMemory", { get: () => 2 });
      });
    }

    await page.goto(process.env.TEST_URL ?? "http://localhost:3000", {
      waitUntil: "networkidle",
    });

    const heroCard = page.locator(".j-hero-art");
    const first = await heroCard.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        animationName: style.animationName,
        animationState: style.animationPlayState,
        transform: style.transform,
      };
    });

    await page.waitForTimeout(900);
    const secondTransform = await heroCard.evaluate(
      (element) => getComputedStyle(element).transform,
    );

    assert.equal(first.animationName, "j-hero-card-mobile-float");
    assert.equal(first.animationState, "running");
    assert.notEqual(first.transform, secondTransform);

    console.log(JSON.stringify({ lowPower, moved: true }));
    await page.close();
  }

  const reducedMotionPage = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  await reducedMotionPage.goto(process.env.TEST_URL ?? "http://localhost:3000", {
    waitUntil: "networkidle",
  });
  const reducedAnimation = await reducedMotionPage
    .locator(".j-hero-art")
    .evaluate((element) => getComputedStyle(element).animationName);

  assert.equal(reducedAnimation, "none");
  console.log(JSON.stringify({ reducedMotion: true, animation: "none" }));
  await reducedMotionPage.close();
} finally {
  await browser.close();
}
