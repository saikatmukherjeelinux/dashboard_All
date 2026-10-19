const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),{pathToFileURL}=require('node:url');
const {chromium}=require(process.env.PML_PLAYWRIGHT_PATH||'playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.platform==='win32'?{channel:'msedge'}:{})});
 try {
  const root=path.resolve(__dirname,'..'),page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  // Force the real clipboard-denied path to verify copying still selects code.
  await page.addInitScript(()=>{if(navigator.clipboard)Object.defineProperty(navigator.clipboard,'writeText',{value:async()=>{throw Error('Clipboard denied in this test');}});});
  await page.goto(process.env.PML_TEST_URL||pathToFileURL(path.join(root,'index.html')).href);
  await page.locator('.worked-example').first().waitFor();
  const ids=await page.evaluate(()=>LESSONS.map(l=>l.id));let count=0;
  for(const id of ids){
   await page.evaluate(id=>document.querySelector(`[data-lesson="${id}"]`).click(),id);
   const result=await page.evaluate(id=>{
    const lesson=LESSONS.find(l=>l.id===id),cards=[...document.querySelectorAll('#workedExamples .worked-example')];
    return {count:cards.length,expected:lesson.examples.length,content:cards.every((card,i)=>card.querySelector('pre:not(.example-output) code').textContent===lesson.examples[i].code&&card.querySelector('.example-output code').textContent===lesson.examples[i].output&&card.querySelectorAll('.example-explanation li').length===lesson.examples[i].explanation.length),summary:document.querySelector('#simplestSummary p').textContent===lesson.summary,last:document.querySelector('#lessonBody').lastElementChild.id==='simplestSummary'};
   },id);
   assert.equal(result.count,result.expected,`Example count: ${id}`);assert(result.content,`Code/output escaping: ${id}`);assert(result.summary&&result.last,`Final summary: ${id}`);count+=result.count;
  }
  await page.locator('#topicFilter').selectOption('new');
  assert.equal(await page.locator('.lesson-link').count(),96);
  assert.deepEqual(await page.locator('.lesson-link').evaluateAll(items=>items.map(x=>+x.dataset.lesson).sort((a,b)=>a-b)),Array.from({length:96},(_,i)=>106+i));
  assert.equal(await page.locator('#lessonCount').textContent(),'200');
  assert.equal(await page.locator('#cardDeck option[value="all"]').textContent(),'All 200 questions');
  await page.locator('#topicFilter').selectOption('latest-36');assert.equal(await page.locator('.lesson-link').count(),36);await page.locator('#topicFilter').selectOption('latest-10');assert.equal(await page.locator('.lesson-link').count(),10);await page.locator('[data-lesson="201"]').click();
  assert.equal(await page.locator('#sourceCredit').textContent(),'Additional conceptual Python lesson');
  await page.locator('#complete').click();await page.locator('#bookmark').click();await page.reload();
  assert.equal(await page.locator('#progressText').textContent(),'1 / 200');
  assert.equal(await page.locator('#bookmark').getAttribute('aria-pressed'),'true');
  await page.locator('#recall').click();assert.equal(await page.locator('#cardPosition').textContent(),'Card 200 of 200');await page.locator('#flipCard').click();assert((await page.locator('#cardAnswer').textContent()).includes('HTMLParser'));
  await page.locator('[data-view="learn"]').click();await page.locator('#topicFilter').selectOption('all');
  await page.evaluate(()=>document.querySelector('[data-lesson="12"]').click());
  await page.locator('[data-lesson-jump="workedExamples"]').click();assert.equal(await page.evaluate(()=>document.activeElement.id),'workedTitle');await page.waitForFunction(()=>Math.abs(document.querySelector('#workedExamples').getBoundingClientRect().top)<80);
  await page.locator('#workedExamples .copy-code').first().click();const first=await page.evaluate(()=>LESSONS.find(l=>l.id===12).examples[0].code);assert.equal(await page.evaluate(()=>getSelection().toString()),first);
  await page.locator('[data-lesson-jump="simplestSummary"]').click();assert.equal(await page.evaluate(()=>document.activeElement.id),'summaryTitle');assert(await page.locator('#summaryTitle').isVisible());
  await page.reload();assert.equal(await page.locator('#personalNote').count(),0);assert.equal(await page.locator('.note-area').count(),0);assert.equal(await page.locator('.worked-example').count(),3);
  await page.locator('[data-lesson-jump="workedExamples"]').click();
  const out=path.join(root,'test-results');fs.mkdirSync(out,{recursive:true});await page.screenshot({path:path.join(out,'worked-examples-desktop.png')});
  for(const width of [390,768]){
   await page.setViewportSize({width,height:844});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`Mobile overflow: ${width}`);
   await page.locator('[data-lesson-jump="simplestSummary"]').click();assert.equal(await page.evaluate(()=>document.activeElement.id),'summaryTitle');
  }
  await page.setViewportSize({width:390,height:844});await page.locator('[data-lesson-jump="workedExamples"]').click();await page.screenshot({path:path.join(out,'worked-examples-mobile.png')});
  await page.locator('[data-lesson-jump="simplestSummary"]').click();await page.screenshot({path:path.join(out,'summary-mobile.png')});
  await page.locator('[data-view="quiz"]').click();await page.locator('#startQuiz').click();assert.equal(await page.locator('.answer').count(),4);
  await page.locator('[data-view="cards"]').click();await page.locator('#flipCard').click();assert(await page.locator('#cardAnswer').isVisible());
  assert.deepEqual(errors,[]);
  console.log(`PASS: ${ids.length} lesson screens, ${count} rendered code/output pairs, detailed explanations, final summaries, jump controls, copying fallback, lesson reload, mobile layout, and quiz/flashcard integration.`);
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
