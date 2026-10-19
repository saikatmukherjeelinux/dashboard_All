const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url');
const {chromium}=require(process.env.PML_PLAYWRIGHT_PATH||'playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.platform==='win32'?{channel:'msedge'}:{})});
 try {
  const root=path.resolve(__dirname,'..'),page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const url=process.env.PML_TEST_URL||pathToFileURL(path.join(root,'index.html')).href;
  await page.goto(url+'#lab');await page.locator('#labSelect').waitFor();
  assert.equal(await page.locator('#labSelect option').count(),100);assert.equal(await page.locator('[data-lab]').count(),100);assert.equal(await page.locator('#labCountBadge').textContent(),'100');
  await page.locator('#labCollection').selectOption('latest-44');assert.equal(await page.locator('[data-lab]').count(),44);assert.deepEqual(await page.locator('[data-lab]').evaluateAll(items=>items.map(x=>+x.dataset.lab).sort((a,b)=>a-b)),Array.from({length:44},(_,i)=>56+i));
  await page.locator('#labCollection').selectOption('first-50');assert.equal(await page.locator('[data-lab]').count(),50);
  await page.locator('#labCollection').selectOption('original');assert.equal(await page.locator('[data-lab]').count(),6);
  await page.locator('#labCollection').selectOption('all');
  let frameCount=0;const styles=new Set();
  for(let i=0;i<100;i++){
   await page.locator('#labSelect').selectOption(String(i));
   const meta=await page.evaluate(i=>({id:LABS[i].id,count:LABS[i].build().length,style:LABS[i].style}),i);styles.add(meta.style);
   assert.equal(await page.locator('#timeline').inputValue(),'0');
   for(let frame=0;frame<meta.count;frame++){
    await page.locator('#timeline').fill(String(frame));frameCount++;
    assert.equal(await page.locator('#stepCount').textContent(),`${frame+1} / ${meta.count}`);
    assert((await page.locator('#labStatus').textContent()).length>5);
    if(i>=6){assert.equal(await page.locator('svg.scene-svg').count(),1);assert((await page.locator('#labOutput').textContent()).length>0);assert(!/\s(?:cx|cy|x|y|width|height|r|transform|d)="[^"]*(?:NaN|Infinity)/.test(await page.locator('svg.scene-svg').innerHTML()));}
   }
   await page.locator('#labReset').click();assert.equal(await page.locator('#timeline').inputValue(),'0');
   await page.locator('#labNext').click();assert.equal(await page.locator('#timeline').inputValue(),'1');await page.locator('#labBack').click();assert.equal(await page.locator('#timeline').inputValue(),'0');
  }
  assert(styles.size>=30);
  await page.locator('#labSearch').fill('no-such-experiment');assert.equal(await page.locator('[data-lab]').count(),0);await page.locator('#labSearch').fill('Counter');assert((await page.locator('[data-lab]').count())>=2);await page.locator('#labSearch').fill('');
  await page.locator('#labCategory').selectOption('Concurrency');assert((await page.locator('[data-lab]').count())>=6);await page.locator('#labCategory').selectOption('all');
  await page.locator('#labStyleFilter').selectOption('venn');assert.equal(await page.locator('[data-lab]').count(),1);await page.locator('#labStyleFilter').selectOption('all');
  await page.locator('#labSelect').selectOption('6');const before=await page.locator('#labSelect').inputValue();await page.locator('#labSurprise').click();assert.notEqual(await page.locator('#labSelect').inputValue(),before);
  await page.locator('#labSelect').selectOption('33');await page.locator('#speed').fill('5');await page.locator('#labPlay').click();await page.waitForFunction(()=>+document.getElementById('timeline').value>0);await page.locator('#labPlay').click();assert.equal(await page.locator('#labPlay').textContent(),'▶ Play experiment');
  await page.locator('[data-view="learn"]').click();await page.goto(url+'#lab/set-venn');assert.equal(await page.locator('#labTitle').textContent(),'Set-operation Venn stage');await page.reload();assert.equal(await page.locator('#labTitle').textContent(),'Set-operation Venn stage');
  await page.locator('#labLessonLink').click();assert((await page.locator('#lessonTitle').textContent()).includes('frozen sets'));
  await page.locator('#relatedLab').click();assert.equal(await page.locator('#labTitle').textContent(),'Set-operation Venn stage');
  // Every added layout must fit a phone, including its final state.
  await page.setViewportSize({width:390,height:844});
  for(let i=6;i<100;i++){
   await page.locator('#labSelect').selectOption(String(i));const max=await page.locator('#timeline').getAttribute('max');await page.locator('#timeline').fill(max);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`Page overflow at lab ${i}`);
   const bad=await page.locator('svg.scene-svg').evaluate(svg=>[...svg.querySelectorAll('g[data-key]')].some(g=>{const b=g.getBBox(),m=g.transform.baseVal.consolidate()?.matrix;return !m||!Number.isFinite(b.width)||!Number.isFinite(m.e);}));assert(!bad,`Invalid mobile geometry at lab ${i}`);
  }
  // Verify motion actually exists on a normal-motion page, not just changing labels.
  await page.emulateMedia({reducedMotion:'no-preference'});await page.setViewportSize({width:1440,height:1000});
  await page.locator('#labSelect').selectOption(String(await page.evaluate(()=>LABS.findIndex(l=>l.id==='stable-sort'))));await page.locator('#timeline').fill('2');assert(await page.locator('svg.scene-svg').evaluate(svg=>svg.getAnimations({subtree:true}).some(a=>a.effect.getKeyframes().some(f=>f.transform))));
  await page.emulateMedia({reducedMotion:'reduce'});
  const out=path.join(root,'test-results');fs.mkdirSync(out,{recursive:true});
  for(const id of ['scope-radar','heap-tree','set-venn','semaphore-pool','event-wave','stable-sort','wraps-passport','utf8-bridge','observer-broadcast','relative-import','protocol-runtime','taskgroup-cleanup']){
   const index=await page.evaluate(id=>LABS.findIndex(l=>l.id===id),id);await page.locator('#labSelect').selectOption(String(index));await page.locator('#timeline').fill('2');await page.locator('#labLibrary').evaluate(el=>el.open=false);await page.locator('#labStage').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,`lab-${id}.png`)});
  }
  await page.setViewportSize({width:390,height:844});await page.waitForFunction(()=>document.querySelector('svg.scene-svg').viewBox.baseVal.width<400);await page.locator('#labStage').scrollIntoViewIfNeeded();assert((await page.locator('svg.scene-svg').evaluate(svg=>svg.getScreenCTM().a))>.8);await page.screenshot({path:path.join(out,'lab-expanded-mobile.png')});
  assert.deepEqual(errors,[]);console.log(`PASS: 100 experiments, ${frameCount} frame renders, ${styles.size} presentation styles, filters, motion, playback, scrubbing, deep links, lesson routing, and all 94 added mobile layouts. No browser errors.`);
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
