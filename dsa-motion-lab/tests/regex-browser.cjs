let playwright;
try{playwright=require('playwright');}catch{playwright=require(require('path').join(require('path').dirname(process.execPath),'..','node_modules','playwright'));}
const assert=require('assert/strict');
const {pathToFileURL}=require('url');
const {solve}=require('../assets/regex-engine.js');
const recipes=require('../assets/regex-catalog.js');
(async()=>{
 const browser=await playwright.chromium.launch({headless:true,channel:'msedge'});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(pathToFileURL(require('path').resolve(__dirname,'../index.html')).href);
  const ready=()=>page.waitForFunction(()=>frames.length&&Object.prototype.hasOwnProperty.call(frames.at(-1),'result'));
  assert.equal(await page.locator('nav button').count(),100);
  for(const recipe of recipes){
   await page.locator(`[data-lesson="${recipe.id}"]`).click();await ready();
   assert.equal(await page.locator('#matchText').inputValue(),recipe.defaults[0]);
   assert.equal(await page.locator('#matchPattern').inputValue(),recipe.defaults[1]);
   assert.equal(await page.locator('#regexReplacement').isVisible(),recipe.mode==='replace');
   assert.ok(await page.locator('#regexFlags').isVisible());
   assert.deepEqual(await page.evaluate(()=>frames.at(-1).result),solve(recipe,...recipe.defaults,recipe.flags,recipe.replacement).result);
   assert.match(await page.locator('#simpleGuide').textContent(),/A tiny example/);
   assert.match(await page.locator('#code').textContent(),/regex_recipe/);
   await page.locator('#next').click();const counter=await page.locator('#counter').textContent();await page.locator('#prev').click();await page.locator('#next').click();assert.equal(await page.locator('#counter').textContent(),counter);
   await page.locator('#timeline').fill(await page.locator('#timeline').getAttribute('max'));
   assert.ok(await page.locator('.regex-output').isVisible());
   await page.setViewportSize({width:390,height:844});assert.ok(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'Mobile overflow: '+recipe.id);await page.setViewportSize({width:1280,height:900});
  }
  // Exercise asynchronous edits, Unicode spans, flags, and captures.
  await page.locator('[data-lesson="rx_literal"]').click();await ready();
  await page.locator('#matchText').fill('🙂CAT\ncat');await page.locator('#matchPattern').fill('cat');await page.locator('#regexFlags').fill('i');await page.locator('#reset').click();await ready();
  assert.deepEqual(await page.evaluate(()=>frames.at(-1).result.map(m=>m.start)),[1,5]);
  await page.locator('#matchPattern').fill('(');await page.locator('#reset').click();await page.waitForFunction(()=>document.getElementById('counter').textContent==='0 / 0');assert.match(await page.locator('#status').textContent(),/Invalid/);
  await page.locator('#matchPattern').fill('a');await page.locator('#regexFlags').fill('ii');await page.locator('#reset').click();await page.waitForFunction(()=>document.getElementById('status').textContent.startsWith('Flags'));
  // A catastrophic pattern must be terminated without blocking navigation.
  await page.locator('#regexFlags').fill('');await page.locator('#matchText').fill('a'.repeat(120)+'!');await page.locator('#matchPattern').fill('(a+)+$');await page.locator('#reset').click();
  await page.waitForFunction(()=>document.getElementById('status').textContent.includes('exceeded 1.5 seconds'),{},{timeout:8000});
  await page.locator('#matchText').fill('cat');await page.locator('#matchPattern').fill('cat');await page.locator('#reset').click();await ready();assert.equal(await page.evaluate(()=>frames.at(-1).result.length),1);
  // Cancelling a running worker cannot overwrite a different lesson.
  await page.locator('#matchText').fill('a'.repeat(120)+'!');await page.locator('#matchPattern').fill('(a+)+$');await page.locator('#reset').click();await page.locator('[data-lesson="bubble"]').click();
  assert.equal(await page.locator('#lessonTitle').textContent(),'Bubble Sort');assert.ok(await page.locator('#regexOptions').isHidden());
  await page.locator('[data-lesson="rx_lazy"]').click();await ready();await page.locator('#timeline').fill(await page.locator('#timeline').getAttribute('max'));assert.equal(await page.locator('#viz script').count(),0);
  await page.locator('#completion').click();await page.reload();await page.locator('[data-lesson="rx_lazy"]').click();await ready();assert.match(await page.locator('#completion').textContent(),/Completed/);
  assert.equal(await page.locator('footer').textContent(),'Copyright - Saikat Mukherjee');assert.deepEqual(errors,[]);
  console.log('All 30 regex lessons pass browser checks: worker results, flags, multiline text, Unicode spans, playback, mobile layout, errors, timeout/recovery, cancellation, and saved progress');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
