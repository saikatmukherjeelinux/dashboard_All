const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),{pathToFileURL}=require('node:url');
const {chromium}=require(process.env.PML_PLAYWRIGHT_PATH||'playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.platform==='win32'?{channel:'msedge'}:{})});
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const root=path.resolve(__dirname,'..'),url=process.env.PML_TEST_URL||pathToFileURL(path.join(root,'index.html')).href;
 await page.goto(url);await page.waitForSelector('.lesson-link');
 assert.equal(await page.locator('.lesson-link').count(),200);assert.equal(await page.locator('#lessonTitle').textContent(),'Explain the Global Interpreter Lock (GIL) in Python?');
 // Verify every lesson can render without executing source HTML or losing examples.
 const ids=await page.evaluate(()=>LESSONS.map(l=>l.id));
 for(const id of ids){await page.evaluate(id=>document.querySelector(`[data-lesson="${id}"]`).click(),id);assert((await page.locator('#lessonBody').textContent()).length>30);}
 await page.locator('#search').fill('frozenset');assert((await page.locator('.lesson-link').count())>0);await page.locator('#search').fill('zzzz-no-match');assert.equal(await page.locator('.lesson-link').count(),0);await page.locator('#search').fill('');
 await page.locator('[data-lesson="12"]').click();await page.locator('#bookmark').click();await page.locator('#complete').click();await page.reload();assert.equal(await page.locator('#bookmark').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('#personalNote').count(),0);assert.equal(await page.locator('#completedCount').textContent(),'1');
 await page.locator('#topicFilter').selectOption('saved');assert.equal(await page.locator('.lesson-link').count(),1);await page.locator('#topicFilter').selectOption('all');
 await page.locator('[data-view="lab"]').click();
 for(let i=0;i<6;i++){await page.locator(`[data-lab="${i}"]`).click();await page.locator('#labNext').click();assert(!(await page.locator('#stepCount').textContent()).startsWith('1 /'));await page.locator('#labReset').click();assert((await page.locator('#stepCount').textContent()).startsWith('1 /'));}
 await page.locator('[data-lab="0"]').click();await page.locator('#copyMode').selectOption('deep');await page.locator('#timeline').fill('3');assert((await page.locator('#labStage').textContent()).includes('False'));
 await page.locator('[data-lab="5"]').click();await page.locator('#cacheRequests').fill('bad input');await page.locator('#applyCache').click();assert((await page.locator('#cacheError').textContent()).includes('integers'));await page.locator('#cacheRequests').fill('1,2,1,3');await page.locator('#applyCache').click();await page.locator('#timeline').fill('4');assert((await page.locator('#labStatus').textContent()).includes('Evict least recent key 2'));
 await page.locator('#labPlay').click();assert.equal(await page.locator('#labPlay').textContent(),'Ⅱ Pause');await page.locator('[data-view="cards"]').click();await page.waitForTimeout(200);assert.equal(await page.locator('#labPlay').textContent(),'▶ Play experiment');
 await page.locator('#flipCard').click();assert(await page.locator('#cardAnswer').isVisible());await page.locator('#cardDeck').selectOption('saved');assert((await page.locator('#cardTitle').textContent()).includes('deep copy'));await page.locator('#cardKnow').count();
 // One full, deliberately mixed attempt covers every authored question and choice rendering.
 await page.locator('[data-view="quiz"]').click();await page.locator('#quizCollection').selectOption('new-342');assert((await page.locator('#availableCount').textContent()).startsWith('342 '));await page.locator('#quizCollection').selectOption('new-100');assert((await page.locator('#availableCount').textContent()).startsWith('100 '));await page.locator('#quizCollection').selectOption('original');assert((await page.locator('#availableCount').textContent()).startsWith('58 '));await page.locator('#quizCollection').selectOption('all');await page.locator('#quizLength').selectOption('all');await page.locator('#startQuiz').click();
 const total=await page.evaluate(()=>QUIZZES.length);let firstCorrect;
 for(let i=0;i<total;i++){
   assert.equal(await page.locator('.answer').count(),4);
   const q=await page.evaluate(()=>{const a=JSON.parse(localStorage.getItem('pml-quiz-v1'));return QUIZZES.find(q=>q.id===a.items[a.index].id);});
   if(q.code){assert.equal(await page.locator('.quiz-code code').textContent(),q.code);assert.equal(await page.locator('.answer .quiz-answer-output').count(),4);assert.equal(await page.locator('[data-option="0"] code').textContent(),q.options[0]);}
   const selected=i%2===0?q.answer:(q.answer+1)%4;if(i===0)firstCorrect=q.answer;
   await page.locator(`[data-option="${selected}"]`).click();assert(await page.locator('.feedback').isVisible());assert((await page.locator('.feedback').textContent()).includes(q.explanation));assert.equal(await page.locator('.answer:disabled').count(),4);
   if(i===0){await page.reload();assert(await page.locator('.feedback').isVisible());assert.equal(await page.locator('.answer.correct').count(),1);}
   await page.locator('#quizNext').click();
 }
 assert(await page.locator('.quiz-score').isVisible());await page.locator('#retryMissed').click();const retry=await page.evaluate(()=>JSON.parse(localStorage.getItem('pml-quiz-v1')).items.length);assert.equal(retry,Math.floor(total/2));
 await page.locator('#endQuiz').click();await page.locator('#newQuiz').click();await page.locator('#quizCategory').selectOption('Iteration');await page.locator('#startQuiz').click();assert.equal(await page.locator('.quiz-top .eyebrow').textContent(),'ITERATION');
 // Deep links and persistence, including an absent source number.
 await page.goto(url+'#learn/42');assert((await page.locator('#lessonTitle').textContent()).includes('yield from'));await page.goto(url+'#learn/43');assert((await page.locator('#lessonTitle').textContent()).length>0);
 await page.locator('#theme').click();assert.equal(await page.locator('html').getAttribute('data-theme'),'light');await page.reload();assert.equal(await page.locator('html').getAttribute('data-theme'),'light');await page.locator('#theme').click();
 await page.goto(url+'#learn/1');
 const output=path.join(root,'test-results');fs.mkdirSync(output,{recursive:true});await page.screenshot({path:path.join(output,'desktop.png'),fullPage:false});
 for(const width of [390,768]){await page.setViewportSize({width,height:844});for(const mode of ['learn','lab','quiz','cards']){await page.locator(`[data-view="${mode}"]`).click();const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert(!overflow,`Horizontal overflow: ${width}px ${mode}`);} }
 await page.setViewportSize({width:390,height:844});await page.locator('[data-view="learn"]').click();await page.locator('#menu').click();assert.equal(await page.locator('#menu').getAttribute('aria-expanded'),'true');await page.locator('[data-lesson="3"]').click();assert.equal(await page.locator('#menu').getAttribute('aria-expanded'),'false');await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(output,'mobile.png'),fullPage:false});
 assert.deepEqual(errors,[]);await browser.close();console.log(`PASS: 200 lesson renders; search, bookmarks, persistence; six labs; ${total} quiz answer paths, retry/filter; flashcards; theme; deep links; mobile layouts. No browser errors.`);
})().catch(e=>{console.error(e);process.exitCode=1;});
