const assert=require('assert/strict');
for(const file of ['interview-core','interview-strings','interview-regex','interview-pattern-questions','quiz-core','quiz-strings','quiz-regex','quiz-patterns'])require('../assets/'+file+'.js');
const engine=require('../assets/quiz-engine.js');
const lessons=Object.keys(InterviewBank).map((id,i)=>({id,title:id,group:i%2?'Odd':'Even'}));
const questions=engine.build(lessons,QuizChoices,InterviewBank);
assert.equal(questions.length,200);assert.equal(new Set(questions.map(q=>q.lessonId)).size,100);
assert.equal(questions.filter(q=>q.level==='advanced').length,100);
assert.equal(new Set(questions.map(q=>q.question)).size,200);
for(const q of questions){
 assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);
 assert.ok(q.explanation.length===3&&q.explanation[0].length>180&&q.explanation[1].length>80&&q.explanation[2].length>100);
 for(const text of [q.question,...q.options,...q.explanation])assert.ok(!/[\x00-\x1f]/.test(text),'Unintended control character in '+q.id);
}
let seed=123456;const random=()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;};
let session=engine.start(questions,{count:0},random);
assert.equal(session.items.length,200);assert.equal(new Set(session.items.map(i=>i.id)).size,200);
assert.equal(new Set(session.items.map(item=>item.order.indexOf(0))).size,4,'Correct choices must use all display positions');
for(const item of session.items)assert.deepEqual([...item.order].sort(),[0,1,2,3]);
const before=JSON.stringify(session);
const first=engine.answer(session,1);assert.equal(JSON.stringify(session),before,'Answers must not mutate prior state');
assert.strictEqual(engine.answer(first,0),first,'A second selection must not change the first grade');
assert.equal(engine.score(first,questions).correct,0);assert.equal(engine.score(first,questions).answered,1);
assert.throws(()=>engine.answer(session,4),/four options/);
session=first;
for(let i=1;i<session.items.length;i++){session={...session,index:i};session=engine.answer(session,0);}
assert.deepEqual(engine.score(session,questions),{answered:200,correct:199,total:200,accuracy:99.5,missed:[session.items[0].id]});
assert.deepEqual(engine.restore(JSON.stringify(session),questions),session);
const finished={...session,finished:true};assert.deepEqual(engine.restore(JSON.stringify(finished),questions),finished);
const retry=engine.start(questions.filter(q=>engine.score(session,questions).missed.includes(q.id)),{count:0},random);assert.equal(retry.items.length,1);assert.equal(engine.score(retry,questions).answered,0);
for(const topic of lessons){
 const focused=engine.start(questions,{topic:topic.id,count:10},random);assert.equal(focused.items.length,2);
 const advanced=engine.start(questions,{topic:topic.id,level:'advanced',count:10},random);assert.equal(advanced.items.length,1);assert.equal(advanced.items[0].id,topic.id+':advanced');
}
assert.equal(engine.pool(questions,{category:'Odd',level:'advanced'}).length,50);
assert.throws(()=>engine.start(questions,{topic:'missing'}),/No questions/);
assert.throws(()=>engine.start(questions,{count:-1}),/valid quiz size/);
for(const bad of [null,'broken','null','{}',JSON.stringify({...first,version:2}),JSON.stringify({...first,index:201}),JSON.stringify({...first,finished:true}),JSON.stringify({...first,items:[first.items[0],first.items[0]]}),JSON.stringify({...first,items:[{id:'unknown',order:[0,1,2,3]}]}),JSON.stringify({...first,answers:{[first.items[1].id]:0}}),JSON.stringify({...first,answers:{[first.items[0].id]:9}}),JSON.stringify({...first,items:[{id:first.items[0].id,order:['0','1','2','3']}]}),JSON.stringify({...first,items:[{id:first.items[0].id,order:[0,0,1,2]}]})])assert.equal(engine.restore(bad,questions),null);
const broken={...QuizChoices,bubble:[['same','same','b','c'],QuizChoices.bubble[1]]};assert.throws(()=>engine.build(lessons,broken,InterviewBank),/four distinct/);
console.log('200 quiz questions cover all 100 topics with four distinct choices, complete explanations, shuffled orders, correct first-answer scoring, filters, retries, and validated persistence');
