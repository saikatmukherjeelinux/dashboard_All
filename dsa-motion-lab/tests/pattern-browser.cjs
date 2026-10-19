let playwright;try{playwright=require('playwright');}catch{playwright=require(require('path').join(require('path').dirname(process.execPath),'..','node_modules','playwright'));}
const assert=require('assert/strict'),{pathToFileURL}=require('url');
const catalog=require('../assets/interview-pattern-catalog.js'),{solve}=require('../assets/interview-pattern-engine.js');
(async()=>{
 const browser=await playwright.chromium.launch({headless:true,channel:'msedge'});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(pathToFileURL(require('path').resolve(__dirname,'../index.html')).href);
  assert.equal(await page.locator('nav button').count(),100);
  assert.equal(await page.locator('#topicCount').textContent(),'100');
  for(const config of catalog){
   await page.locator(`[data-lesson="${config.id}"]`).click();
   assert.ok(await page.locator('#patternInput').isVisible());
   assert.ok(await page.locator('#stringControls').isHidden());
   assert.deepEqual(JSON.parse(await page.locator('#patternInput').inputValue()),config.defaults);
   assert.deepEqual(await page.evaluate(()=>frames.at(-1).result),solve(config.id,config.defaults).result);
   assert.ok((await page.locator('#code').textContent()).includes('def '));
   assert.equal(await page.locator('#interviewQuestions details').count(),2);
   assert.match(await page.locator('#simpleGuide').textContent(),/A tiny example/);
   await page.locator('#next').click();const step=await page.locator('#counter').textContent();await page.locator('#prev').click();await page.locator('#next').click();assert.equal(await page.locator('#counter').textContent(),step);
   await page.locator('#timeline').fill(await page.locator('#timeline').getAttribute('max'));assert.ok(await page.locator('.pattern-output').isVisible());
   await page.locator('#interviewQuestions summary').last().click();assert.ok(await page.locator('#interviewQuestions .interview-answer').last().isVisible());
   await page.setViewportSize({width:390,height:844});assert.ok(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'Mobile overflow '+config.id);await page.setViewportSize({width:1280,height:900});
   await page.locator('#random').click();const random=JSON.parse(await page.locator('#patternInput').inputValue());
   assert.notEqual(await page.locator('#counter').textContent(),'0 / 0','Invalid randomized input '+config.id);
   assert.deepEqual(await page.evaluate(()=>frames.at(-1).result),solve(config.id,random).result);
  }
  for(const [id,data] of [
   ['two_sum',{nums:[3,3],target:6}],['sum_k',{nums:[0,0,0],target:0}],
   ['knapsack',{weights:[0,2],values:[5,3],capacity:0}],
   ['islands',{grid:[[1,0],[0,1]]}],['islands',{grid:[]}],
   ['fenwick',{nums:[1,2,3],updates:[[1,-2],[0,4]],queries:[[0,2],[1,1]]}],
   ['union_find',{n:3,edges:[[0,1],[0,1],[2,2]]}],['queens',{n:2}],
  ]){await page.locator(`[data-lesson="${id}"]`).click();await page.locator('#patternInput').fill(JSON.stringify(data));await page.locator('#patternInput').press('Control+Enter');assert.deepEqual(await page.evaluate(()=>frames.at(-1).result),solve(id,data).result);}
  await page.locator('#patternInput').fill('{broken');await page.locator('#reset').click();assert.match(await page.locator('#status').textContent(),/valid JSON/);assert.equal(await page.locator('#counter').textContent(),'0 / 0');
  await page.locator('#patternInput').fill('{"n":9}');await page.locator('#reset').click();assert.match(await page.locator('#status').textContent(),/1 to 8/);
  await page.locator('#patternInput').fill('{"n":4}');await page.locator('#reset').click();assert.equal(await page.evaluate(()=>frames.at(-1).result.length),2);
  await page.locator('#play').click();assert.match(await page.locator('#play').textContent(),/Pause/);await page.locator('#play').click();assert.match(await page.locator('#play').textContent(),/Play/);
  await page.locator('#completion').click();await page.reload();await page.locator('[data-lesson="queens"]').click();assert.match(await page.locator('#completion').textContent(),/Completed/);
  await page.locator('[data-lesson="bubble"]').click();assert.ok(await page.locator('#patternControls').isHidden());
  assert.equal(await page.locator('.github').textContent(),'My profile - Saikat Mukherjee');assert.equal(await page.locator('.github').getAttribute('href'),'https://github.com/saikatmukherjeelinux');assert.equal(await page.locator('footer').textContent(),'Copyright - Saikat Mukherjee');
  assert.deepEqual(errors,[]);
  console.log('All 27 new lessons pass browser checks: editable JSON, valid random examples, grids, traces, playback, Python, integrated Q&A, mobile layout, validation/recovery, and saved completion');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
