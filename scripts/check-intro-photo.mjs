import { chromium } from "playwright-core";
import assert from "node:assert/strict";
const b=await chromium.launch({executablePath:"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",headless:true});
for(const [name,width,height,motion] of [["desktop",1440,900,"no-preference"],["mobile",390,844,"no-preference"],["small",320,568,"no-preference"],["reduced",390,844,"reduce"]]){
 if(process.argv.includes("--desktop") && name!=="desktop") continue;
 const p=await b.newPage({viewport:{width,height},reducedMotion:motion});
 const errors=[];p.on("pageerror",e=>errors.push(e.message));
 await p.goto("http://localhost:3000",{waitUntil:"networkidle"});await p.waitForTimeout(1200);
 const top=await p.locator(".j-intro").evaluate(e=>e.getBoundingClientRect().top+scrollY);
 for(const [label,offset] of [["moving",.35],["done",0]]){
 await p.evaluate(y=>scrollTo(0,y),top-height*offset);await p.waitForTimeout(1100);
 await p.screenshot({path:"artifacts/journey/intro-"+name+"-"+label+".png"});
 }
 const result=await p.locator(".j-intro").evaluate(e=>{const photo=e.querySelector(".j-intro-photo");const rect=photo.getBoundingClientRect();const canvas=e.querySelector("canvas");return {height:e.getBoundingClientRect().height,photoBottom:rect.bottom,photoTop:rect.top,transform:getComputedStyle(photo).transform,shader:canvas?.dataset.image,glError:canvas?.getContext("webgl").getError(),overflow:document.documentElement.scrollWidth>innerWidth}});
 assert.equal(result.overflow,false);assert(result.photoBottom<=height+2);
 if(motion!=="reduce"){assert.equal(result.shader,"ready");assert.equal(result.glError,0)}
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({name,...result,errors}));
 await p.close();
}
await b.close();

