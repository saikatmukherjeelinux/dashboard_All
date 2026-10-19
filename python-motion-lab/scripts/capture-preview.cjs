// Optional: capture fresh-state screenshots with a locally installed Playwright.
const {chromium}=require(process.env.PML_PLAYWRIGHT_PATH||'playwright');
const path=require('node:path'),fs=require('node:fs'),{pathToFileURL}=require('node:url');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const browser=await chromium.launch({headless:true,...(process.platform==='win32'?{channel:'msedge'}:{})});
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await page.goto(process.env.PML_TEST_URL||pathToFileURL(path.join(root,'index.html')).href);
 await page.locator('#lessonTitle').waitFor();
 await page.screenshot({path:path.join(root,'docs/preview.png')});
 const out=path.join(root,'test-results');fs.mkdirSync(out,{recursive:true});
 await page.locator('[data-view="lab"]').click();await page.locator('[data-lab="0"]').click();await page.locator('#timeline').fill('3');await page.screenshot({path:path.join(out,'lab-desktop.png')});
 await page.locator('[data-view="quiz"]').click();await page.locator('#quizCategory').selectOption('Iteration');await page.locator('#startQuiz').click();await page.locator('[data-option="1"]').click();await page.screenshot({path:path.join(out,'quiz-desktop.png')});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(out,'quiz-mobile.png'),fullPage:true});
 await page.locator('[data-view="lab"]').click();await page.screenshot({path:path.join(out,'lab-mobile.png'),fullPage:true});
 await page.locator('[data-view="learn"]').click();await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(out,'mobile.png')});
 await page.setViewportSize({width:1440,height:1000});
 await page.locator('#topicFilter').selectOption('new');
 await page.locator('[data-lesson="112"]').click();
 await page.evaluate(()=>document.querySelector('.lesson-panel').scrollIntoView({behavior:'instant',block:'start'}));
 await page.screenshot({path:path.join(out,'new-concepts-desktop.png')});
 await page.locator('[data-lesson-jump="workedExamples"]').click();
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:path.join(out,'new-concepts-mobile.png')});
 await browser.close();console.log('Captured clean desktop, mobile, visual-lab, quiz, and new-concept previews.');
})().catch(e=>{console.error(e);process.exitCode=1;});
