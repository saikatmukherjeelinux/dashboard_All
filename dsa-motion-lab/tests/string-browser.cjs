let playwright;
try{playwright=require('playwright');}catch{playwright=require(require('path').join(require('path').dirname(process.execPath),'..','node_modules','playwright'));}
const assert=require('assert/strict');
const {pathToFileURL}=require('url');
const {solve}=require('../assets/string-engine.js');
(async()=>{
 const browser=await playwright.chromium.launch({headless:true,channel:'msedge'});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(pathToFileURL(require('path').resolve(__dirname,'../index.html')).href);
  const lessons=await page.evaluate(()=>stringLessons.map(({id,defaults,single})=>({id,defaults,single})));
  assert.equal(lessons.length,20);
  assert.equal(await page.locator('nav button').count(),100);
  for(const lesson of lessons){
   await page.locator(`[data-lesson="${lesson.id}"]`).click();
   assert.ok(await page.locator('#matchText').isVisible());
   assert.equal(await page.locator('#matchPattern').isVisible(),!lesson.single);
   assert.ok(await page.locator('#code').textContent());
   const expected=solve(lesson.id,...lesson.defaults).result;
   assert.deepEqual(await page.evaluate(()=>frames.at(-1).result),expected);
   await page.locator('#timeline').fill('1');
   const firstCounter=await page.locator('#counter').textContent();
   await page.locator('#next').click();await page.locator('#prev').click();
   assert.equal(await page.locator('#counter').textContent(),firstCounter);
   // Exercise editable inputs, independent from the lesson's supplied example.
   const text=lesson.id==='trie'?'a':'ababa🙂',pattern=['aho','trie','wordbreak'].includes(lesson.id)?'a, ab, aba, 🙂':'a🙂';
   await page.locator('#matchText').fill(text);
   if(!lesson.single)await page.locator('#matchPattern').fill(pattern);
   await page.locator('#reset').click();
   assert.deepEqual(await page.evaluate(()=>frames.at(-1).result),solve(lesson.id,text,lesson.single?'':pattern).result);
   await page.locator('#timeline').fill(await page.locator('#timeline').getAttribute('max'));
   assert.match(await page.locator('#status').textContent(),/^Result:/);
   assert.ok(await page.locator('#viz').textContent());
   await page.setViewportSize({width:390,height:844});
   assert.ok(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'Mobile overflow in '+lesson.id);
   await page.setViewportSize({width:1280,height:900});
  }
  await page.locator('[data-lesson="edit"]').click();
  await page.locator('#matchText').fill('a'.repeat(33));await page.locator('#reset').click();
  assert.match(await page.locator('#status').textContent(),/at most 32/);
  assert.equal(await page.locator('#counter').textContent(),'0 / 0');
  await page.locator('#matchText').fill('🙂a');await page.locator('#matchPattern').fill('🙂b');await page.locator('#reset').click();
  assert.equal(await page.evaluate(()=>frames.at(-1).result),1);
  await page.locator('#matchText').fill('<script>');await page.locator('#matchPattern').fill('<script>');await page.locator('#reset').click();
  await page.locator('#timeline').fill(await page.locator('#timeline').getAttribute('max'));
  assert.equal(await page.locator('#viz script').count(),0);
  assert.ok(await page.locator('#viz table').count());
  await page.locator('#completion').click();await page.reload();await page.locator('[data-lesson="edit"]').click();
  assert.match(await page.locator('#completion').textContent(),/Completed/);
  await page.locator('#lessonSearch').fill('Manacher');assert.ok(await page.locator('[data-lesson="manacher"]').isVisible());
  assert.equal(await page.locator('nav button:visible').count(),1);
  assert.deepEqual(errors,[]);
  console.log('All 20 new string lessons pass browser checks: custom inputs, timeline, guides, Python code, mobile layout, validation, escaping, progress, and lesson search');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
