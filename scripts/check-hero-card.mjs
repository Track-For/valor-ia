import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
await mkdir("artifacts/card", {recursive:true});
const browser = await chromium.launch({executablePath:"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",headless:true});
for (const [name,width,height,reducedMotion] of [["desktop",1440,900,"no-preference"],["mobile",390,844,"no-preference"],["reduced",1440,900,"reduce"]]) {
  const page = await browser.newPage({viewport:{width,height},reducedMotion});
  const errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  page.on("console",m=>{if(m.type()==="error")errors.push(m.text())});
  await page.goto("http://localhost:3001",{waitUntil:"networkidle"});
  await page.waitForTimeout(6500);
  await page.mouse.move(width*.8,height*.4);
  await page.waitForTimeout(500);
  await page.screenshot({path:"artifacts/card/"+name+".png"});
  console.log(JSON.stringify({name,errors,...await page.evaluate(()=>({canvas:!!document.querySelector("canvas"),fallback:!!document.querySelector(".hero-card-static"),overflow:document.documentElement.scrollWidth>innerWidth}))}));
  await page.close();
}
await browser.close();

