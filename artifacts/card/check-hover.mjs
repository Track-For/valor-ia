import { chromium } from "playwright-core";
const browser = await chromium.launch({executablePath:"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",headless:true});
const page = await browser.newPage({viewport:{width:1440,height:900}});
const errors=[];
page.on("pageerror",e=>errors.push(e.message));
await page.goto("http://localhost:3001",{waitUntil:"networkidle"});
await page.waitForTimeout(6500);
for(const [name,x,y] of [["left",820,280],["right",1300,600],["reset",10,850]]){
 await page.mouse.move(x,y,{steps:12});
 await page.waitForTimeout(900);
 await page.screenshot({path:"artifacts/card/hover-"+name+".png"});
}
console.log(JSON.stringify({errors}));
await browser.close();
