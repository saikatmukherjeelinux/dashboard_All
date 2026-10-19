let playwright;try{playwright=require('playwright');}catch{playwright=require(require('path').join(require('path').dirname(process.execPath),'..','node_modules','playwright'));}
const assert=require('assert/strict'),{pathToFileURL}=require('url');
(async()=>{
 const browser=await playwright.chromium.launch({headless:true,channel:'msedge'});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(pathToFileURL(require('path').resolve(__dirname,'../index.html')).href);
  assert.equal(await page.locator('nav button').count(),100);
  await page.locator('#next').click();const lessonStep=await page.locator('#counter').textContent();
  await page.locator('#quizTab').click();assert.ok(await page.locator('#learningContent').isHidden());assert.ok(await page.locator('#quizPanel').isVisible());assert.ok(await page.locator('#nav').isHidden());
  assert.equal(await page.locator('#quizPoolCount').textContent(),'200 available');
  assert.equal(await page.locator('#quizTopic option').count(),101);
  assert.equal(await page.locator('#quizExplanationTitle').count(),0);
  await page.locator('#learnTab').click();assert.equal(await page.locator('#counter').textContent(),lessonStep);
  // Tab roles and arrow-key navigation work without mouse input.
  await page.locator('#learnTab').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#quizTab').getAttribute('aria-selected'),'true');
  await page.locator('#quizCategory').selectOption('Sorting');assert.equal(await page.locator('#quizPoolCount').textContent(),'12 available');
  await page.locator('#quizTopic').selectOption('bubble');await page.locator('#quizLevel').selectOption('advanced');assert.equal(await page.locator('#quizPoolCount').textContent(),'1 available');
  await page.locator('#quizStart').click();assert.equal(await page.evaluate(()=>quizSession.items.length),1);
  assert.equal(await page.locator('.quiz-option').count(),4);assert.ok(await page.locator('#quizNext').isDisabled());assert.equal(await page.locator('.quiz-explanation').count(),0);
  const correctKey=await page.evaluate(()=>String(quizSession.items[0].order.indexOf(0)+1));
  await page.keyboard.press(correctKey);assert.match(await page.locator('#quizFeedback').textContent(),/Correct!/);
  assert.equal(await page.locator('.quiz-option:disabled').count(),4);
  await page.evaluate(()=>submitQuizAnswer(1));assert.equal(await page.evaluate(()=>QuizEngine.score(quizSession,quizQuestions).correct),1);
  await page.reload();assert.ok(await page.locator('#quizPanel').isVisible());assert.equal(await page.locator('.quiz-option:disabled').count(),4);assert.match(await page.locator('#quizFeedback').textContent(),/Correct!/);
  await page.locator('#quizReviewLesson').click();assert.ok(await page.locator('#learningContent').isVisible());assert.equal(await page.locator('#lessonTitle').textContent(),'Bubble Sort');
  await page.locator('#quizTab').click();assert.equal(await page.locator('.quiz-option:disabled').count(),4);
  // Start one full-bank attempt: every question is rendered, answered, explained,
  // and checked for mobile page overflow. Exactly the first answer is wrong.
  await page.locator('#quizCategory').selectOption('all');await page.locator('#quizTopic').selectOption('all');await page.locator('#quizLevel').selectOption('all');await page.locator('#quizCount').selectOption('0');await page.locator('#quizStart').click();
  assert.equal(await page.evaluate(()=>quizSession.items.length),200);
  await page.setViewportSize({width:390,height:844});
  const topics=new Set(),ids=new Set(),correctPositions=new Set();
  for(let i=0;i<200;i++){
   const current=await page.evaluate(()=>{const item=quizSession.items[quizSession.index],q=quizById.get(item.id);return {id:q.id,topic:q.lessonId,question:q.question,options:item.order.map(index=>q.options[index]),explanation:q.explanation,position:item.order.indexOf(0)};});
   assert.ok(!ids.has(current.id));ids.add(current.id);topics.add(current.topic);correctPositions.add(current.position);
   assert.equal(await page.locator('#quizQuestionTitle').textContent(),current.question);
   assert.equal(await page.locator('.quiz-option').count(),4);assert.equal(await page.locator('.quiz-explanation').count(),0);
   assert.equal(await page.locator('.quiz-option:not(:disabled)').count(),4);
   for(let j=0;j<4;j++)assert.equal(await page.locator('.quiz-option-text').nth(j).textContent(),current.options[j]);
   await page.locator(`[data-answer="${i===0?1:0}"]`).click();
   assert.equal(await page.locator('.quiz-option.is-correct').count(),1);assert.equal(await page.locator('.quiz-option.is-incorrect').count(),i===0?1:0);
   assert.deepEqual(await page.locator('.quiz-explanation p').allTextContents(),current.explanation);
   assert.equal(await page.locator('#quizPanel script').count(),0);
   assert.ok(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'Quiz mobile overflow: '+current.id);
   assert.equal(await page.locator('[role="progressbar"]').getAttribute('aria-valuenow'),String(i+1));
   if(i===0){const score=await page.evaluate(()=>QuizEngine.score(quizSession,quizQuestions));assert.equal(score.correct,0);await page.evaluate(()=>submitQuizAnswer(0));assert.equal(await page.evaluate(()=>QuizEngine.score(quizSession,quizQuestions).correct),0);}
   await page.locator('#quizNext').click();
   if((i+1)%50===0)console.log('Verified '+(i+1)+' quiz questions');
  }
  assert.equal(topics.size,100);assert.equal(ids.size,200);assert.equal(correctPositions.size,4);
  assert.equal(await page.locator('#quizResultTitle').textContent(),'199 out of 200 correct.');assert.equal(await page.locator('.quiz-result-item').count(),200);
  assert.equal(await page.locator('.quiz-result-item.is-wrong').count(),1);
  assert.equal(await page.evaluate(()=>QuizEngine.score(quizSession,quizQuestions).accuracy),99.5);
  const missed=await page.evaluate(()=>QuizEngine.score(quizSession,quizQuestions).missed[0]);
  await page.locator('.quiz-result-item').first().click();assert.ok(await page.locator('#quizResults').isVisible());await page.locator('#quizResults').click();
  await page.locator('#quizRetryMissed').click();assert.equal(await page.evaluate(()=>quizSession.items.length),1);assert.equal(await page.evaluate(()=>quizSession.items[0].id),missed);assert.equal(await page.evaluate(()=>Object.keys(quizSession.answers).length),0);
  await page.locator('[data-answer="0"]').click();await page.locator('#quizNext').click();assert.equal(await page.locator('#quizResultTitle').textContent(),'1 out of 1 correct.');assert.ok(await page.locator('#quizRetryMissed').isHidden());
  await page.locator('.quiz-result-item').click();assert.equal(await page.locator('.quiz-option:disabled').count(),4);await page.locator('#quizNext').click();
  await page.reload();assert.equal(await page.locator('#quizResultTitle').textContent(),'1 out of 1 correct.');
  await page.evaluate(()=>localStorage.setItem('dsa-quiz-session-v1','{broken'));await page.reload();assert.ok(await page.locator('.quiz-empty').isVisible());
  await page.locator('#quizStart').click();assert.equal(await page.locator('.quiz-option').count(),4);
  assert.equal(await page.locator('footer').textContent(),'Copyright - Saikat Mukherjee');assert.equal(await page.locator('.github').getAttribute('href'),'https://github.com/saikatmukherjeelinux');
  assert.deepEqual(errors,[]);
  const blocked=await browser.newPage();await blocked.addInitScript(()=>{Storage.prototype.getItem=function(){throw Error('Blocked')};Storage.prototype.setItem=function(){throw Error('Blocked')};});
  await blocked.goto(pathToFileURL(require('path').resolve(__dirname,'../index.html')).href);await blocked.locator('#quizTab').click();await blocked.locator('#quizStart').click();assert.equal(await blocked.locator('.quiz-option').count(),4);await blocked.close();
  console.log('All 200 questions across 100 topics pass: four choices, exact explanations, immediate grading, answer locks, shuffled positions, filters, score/results, retry missed, reload/corrupt/blocked storage, keyboard access, separate views, and mobile layout');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
