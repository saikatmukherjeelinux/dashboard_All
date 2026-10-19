let playwright;
try{playwright=require('playwright');}catch{playwright=require(require('path').join(require('path').dirname(process.execPath),'..','node_modules','playwright'));}
const assert=require('assert/strict');
const {pathToFileURL}=require('url');
require('../assets/interview-core.js');require('../assets/interview-strings.js');require('../assets/interview-regex.js');
require('../assets/interview-pattern-questions.js');
(async()=>{
 const browser=await playwright.chromium.launch({headless:true,channel:'msedge'});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(pathToFileURL(require('path').resolve(__dirname,'../index.html')).href);
  const ids=await page.locator('nav button').evaluateAll(nodes=>nodes.map(node=>node.dataset.lesson));
  assert.equal(ids.length,100,'Each actual algorithm has one navigation entry');
  assert.deepEqual([...ids].sort(),Object.keys(InterviewBank).sort(),'Every existing lesson must have its own Q&A');
  const allQuestions=new Set();
  for(const id of ids){
   const entries=InterviewBank[id];assert.equal(entries.length,2);
   for(const entry of entries){
    assert.equal(entry.length,4);const [question,answer,example,tradeoff]=entry;
    assert.ok(!allQuestions.has(question),'Duplicate question: '+question);allQuestions.add(question);
    assert.ok(answer.length>180&&example.length>80&&tradeoff.length>100,'Incomplete explanation in '+id);
    for(const field of entry)assert.ok(!/[\x00-\x1f]/.test(field),'Invisible control character in '+id);
   }
   await page.locator(`[data-lesson="${id}"]`).click();
   const section=page.locator('#interviewQuestions');
   assert.ok((await section.locator('h2').textContent()).includes(await page.locator('#lessonTitle').textContent()));
   assert.equal(await section.locator('details').count(),2);
   assert.equal(await section.locator('details[open]').count(),0);
   assert.deepEqual(await section.locator('.interview-level').allTextContents(),['Intermediate','Advanced']);
   for(let i=0;i<2;i++){
    const item=section.locator('details').nth(i);
    assert.equal(await item.locator('.interview-question-title').textContent(),entries[i][0]);
    await item.locator('summary').click();
    assert.ok(await item.locator('.interview-answer').isVisible());
    assert.deepEqual(await item.locator('.interview-answer p').allTextContents(),entries[i].slice(1));
   }
   await page.setViewportSize({width:390,height:844});
   assert.ok(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'Mobile overflow in '+id);
   await page.setViewportSize({width:1280,height:900});
  }
  assert.equal(allQuestions.size,200);
  await page.locator('[data-lesson="rx_boundary"]').click();
  const summary=page.locator('#interviewQuestions summary').first();
  await summary.focus();await page.keyboard.press('Enter');
  assert.ok(await page.locator('#interviewQuestions details').first().getAttribute('open')!==null);
  assert.ok((await page.locator('#interviewQuestions').textContent()).includes('\\bcat\\b'));
  await page.locator('[data-lesson="bubble"]').click();await page.locator('#next').click();
  const step=await page.locator('#counter').textContent();
  await page.locator('#interviewQuestions summary').last().click();
  assert.equal(await page.locator('#counter').textContent(),step,'Reading answers must not reset playback');
  assert.match(await page.locator('#interviewQuestions').textContent(),/inversion count/);
  assert.equal(await page.locator('footer').textContent(),'Copyright - Saikat Mukherjee');
  assert.deepEqual(errors,[]);
  console.log('200 unique interview questions verified across all 100 lessons: complete answers/examples/trade-offs, navigation, keyboard disclosure, mobile layout, and preserved playback');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
