import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("artifacts/journey", {recursive:true});
const browser=await chromium.launch({executablePath:"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",headless:true});
const results=[];
for(const [name,width,height,motion] of [["desktop",1440,900,"no-preference"],["mobile",390,844,"no-preference"],["reduced",390,844,"reduce"]]){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:motion});
 const errors=[]; page.on("pageerror",e=>errors.push(e.message));page.on("console",m=>{if(m.type()==="error")errors.push(m.text())});
 await page.goto("http://localhost:3001",{waitUntil:"networkidle"});
 await page.waitForTimeout(2500);
 const capture=async(label,y)=>{await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(1100);await page.screenshot({path:"artifacts/journey/"+name+"-"+label+".png"});};
 const pos=async(sel)=>page.locator(sel).first().evaluate(e=>e.getBoundingClientRect().top+scrollY);
 const initial=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,sections:document.querySelectorAll("main section").length,motion:document.querySelector(".journey").classList.contains("j-motion")}));
 await capture("hero",0);
 const gallery=await pos(".j-gallery");
 await capture("gallery",gallery+30);
 const getTransform=()=>page.locator(".j-gallery-track").first().evaluate(e=>getComputedStyle(e).transform);
 const t1=await getTransform();await page.waitForTimeout(600);const t2=await getTransform();
 let pauseWorks=true;
 if(motion!=="reduce"){await page.getByRole("button",{name:"Pausar movimento da galeria"}).click();const t3=await getTransform();await page.waitForTimeout(400);pauseWorks=t3===await getTransform();}
 await capture("intro",await pos(".j-intro"));
 const solution=await pos(".j-solutions");
 if(motion!=="reduce"){
  for(const [label,p] of [["solution-1",0],["solution-2",.37],["solution-3",.67],["solution-4",.96]]) await capture(label,solution+height*(width<761?3:3.2)*p);
  const finale=await pos(".j-finale");
  for(const [label,p] of [["fill",.18],["cards",.69],["app",.98]]) await capture(label,finale+height*(width<761?6:5)*p);
 }else{
  await capture("solutions",solution);
  await capture("cards",await pos(".j-card-scene"));
  await capture("app",await pos(".j-app"));
 }
 await capture("footer",await pos(".j-footer"));
 const broken=await page.locator("img").evaluateAll(els=>els.filter(e=>!e.complete||!e.naturalWidth).map(e=>e.src));
 results.push({name,errors,...initial,galleryMoves:t1!==t2,pauseWorks,broken});
 console.log(JSON.stringify(results.at(-1)));
 await page.close();
}
await writeFile("artifacts/journey/results.json",JSON.stringify(results,null,2));
await browser.close();
