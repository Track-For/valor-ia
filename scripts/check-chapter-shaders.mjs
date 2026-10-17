import { chromium } from "playwright-core";
import assert from "node:assert/strict";
const browser=await chromium.launch({executablePath:"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",headless:true});
const p=await browser.newPage({viewport:{width:1440,height:900}});
const errors=[];p.on("pageerror",e=>errors.push(e.message));p.on("console",m=>{if(m.type()==="error")errors.push(m.text())});
await p.goto("http://localhost:3000",{waitUntil:"networkidle"});await p.waitForTimeout(1600);
const start=await p.locator(".j-finale").evaluate(e=>e.getBoundingClientRect().top+scrollY);
await p.evaluate(y=>scrollTo(0,y),start+900*5*.40);await p.waitForTimeout(1200);
await p.screenshot({path:"artifacts/journey/shader-entrance.png"});
const shaders=await p.locator(".j-chapter .j-chapter-shader").evaluateAll(els=>els.map(e=>({ready:e.dataset.shader,error:e.getContext("webgl").getError()})));
console.log(JSON.stringify({shaders,errors}));assert.equal(shaders.length,3);assert(shaders.every(s=>s.ready==="ready"&&s.error===0));
await p.evaluate(y=>scrollTo(0,y),start+900*5*.69);await p.waitForTimeout(1500);
await p.screenshot({path:"artifacts/journey/shader-settled.png"});
const transforms=()=>p.locator(".j-chapter").evaluateAll(els=>els.map(e=>getComputedStyle(e).transform));
const before=await transforms();await p.waitForTimeout(700);assert.deepEqual(await transforms(),before);
assert.deepEqual(errors,[]);
console.log(JSON.stringify({shaders,settled:true,errors}));
await browser.close();


