import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
const browser=await chromium.launch({executablePath:"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",headless:true});
const results=[];
for(const [name,width,height] of [["final-desktop",1440,900],["final-mobile",390,844],["short",1024,600],["small",320,568]]){
 const p=await browser.newPage({viewport:{width,height}});
 const errors=[];p.on("pageerror",e=>errors.push(e.message));
 await p.goto("http://localhost:3001",{waitUntil:"networkidle"});
 await p.waitForTimeout(1600);
 const y=async(selector)=>p.locator(selector).evaluate(e=>e.getBoundingClientRect().top+scrollY);
 const go=async(top)=>{await p.evaluate(top=>window.scrollTo(0,top),top);await p.waitForTimeout(1000)};
 const shot=async(label)=>p.screenshot({path:"artifacts/journey/"+name+"-"+label+".png"});
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 if(width<761){await p.getByRole("button",{name:"Abrir menu"}).click();assert.equal(await p.locator(".j-nav").isVisible(),true);await p.getByRole("button",{name:"Fechar menu"}).click();}
 const g=await y(".j-gallery");await go(g+10);
 const matrix=()=>p.locator(".j-gallery-track").evaluateAll(els=>els.map(e=>new DOMMatrix(getComputedStyle(e).transform).m42));
 const a=await matrix();await p.waitForTimeout(350);const b=await matrix();
 assert(b[0]<a[0] && b[1]>a[1] && b[2]<a[2],"Gallery directions");
 const s=await y(".j-solutions");await go(s+height*(width<761?3:3.2)*.67);
 assert.equal(await p.locator(".j-solution-list .is-active").innerText().then(t=>t.includes("Viver")),true);
 await shot("solutions");
 const f=await y(".j-finale");
 await go(f+height*(width<761?6:5)*.08);await shot("fill-start");
 await go(f+height*(width<761?6:5)*.25);await shot("highlight");
 await go(f+height*(width<761?6:5)*.5);await shot("cards");
 await go(f+height*(width<761?6:5)*.98);await shot("app");
 assert.equal(await p.locator(".j-app").evaluate(e=>e.inert),false);
 await go(f+height*(width<761?6:5)*.1);
 assert.equal(await p.locator(".j-app").evaluate(e=>e.inert),true);
 assert.deepEqual(errors,[]);
 results.push({name,errors,galleryDirections:true,solutionSync:true,reverses:true,overflow:false});
 console.log(JSON.stringify(results.at(-1)));
 await p.close();
}
await writeFile("artifacts/journey/verification.json",JSON.stringify(results,null,2));
await browser.close();
