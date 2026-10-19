const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),{pathToFileURL}=require('node:url');
const {chromium}=require(process.env.PML_PLAYWRIGHT_PATH||'playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.platform==='win32'?{channel:'msedge'}:{})});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const root=path.resolve(__dirname,'..');await page.goto(pathToFileURL(path.join(root,'index.html')).href+'#learn/192');
  const toggle=page.locator('#sidebarToggle'),before=await page.locator('.lesson-panel').boundingBox();
  assert.equal(await toggle.getAttribute('aria-expanded'),'true');
  await toggle.click();assert.equal(await toggle.getAttribute('aria-expanded'),'false');
  assert(await page.locator('#sidebar').evaluate(el=>el.inert));
  const after=await page.locator('.lesson-panel').boundingBox();assert(after.width>before.width+200);
  assert.equal(await page.locator('.shell').evaluate(el=>getComputedStyle(el).marginLeft),'0px');
  await page.reload();assert.equal(await toggle.getAttribute('aria-expanded'),'false');
  await page.locator('#theme').click();assert.equal(await toggle.getAttribute('aria-label'),'Show lesson index');
  await toggle.click();assert.equal(await toggle.getAttribute('aria-expanded'),'true');
  assert(!await page.locator('#sidebar').evaluate(el=>el.inert));
  await toggle.focus();await page.keyboard.press('Enter');assert.equal(await toggle.getAttribute('aria-expanded'),'false');
  await page.locator('#lessonTitle').click();await page.keyboard.press('/');assert.equal(await toggle.getAttribute('aria-expanded'),'true');
  assert.equal(await page.evaluate(()=>document.activeElement.id),'search');
  await toggle.click();
  for(const width of [1024,820,390]){
   await page.setViewportSize({width,height:844});
   assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1));
   if(width<=820){await page.waitForFunction(()=>!document.querySelector('#sidebar').inert);
    assert(!await toggle.isVisible());assert(!await page.locator('#sidebar').evaluate(el=>el.inert));
    await page.locator('#menu').click();assert.equal(await page.locator('#menu').getAttribute('aria-expanded'),'true');
    await page.locator('[data-lesson="193"]').click();assert.equal(await page.locator('#menu').getAttribute('aria-expanded'),'false');
   }
  }
  await page.setViewportSize({width:1440,height:1000});await page.waitForFunction(()=>document.querySelector('#sidebar').inert);assert.equal(await toggle.getAttribute('aria-expanded'),'false');
  await page.locator('#theme').click();await page.locator('[data-lesson-jump="workedExamples"]').click();
  fs.mkdirSync(path.join(root,'test-results'),{recursive:true});await page.screenshot({path:path.join(root,'test-results/collapsed-index.png')});
  assert.deepEqual(errors,[]);
  console.log('PASS: sliding index expands reading width, persists, supports keyboard/search, restores, and preserves mobile navigation.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
