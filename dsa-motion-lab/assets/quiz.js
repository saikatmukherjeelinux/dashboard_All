const quizQuestions=QuizEngine.build(lessons,QuizChoices,InterviewBank);
const quizById=new Map(quizQuestions.map(q=>[q.id,q]));
let quizSession=null,quizView='learn',quizInterruptedRegex=false;
try{quizSession=QuizEngine.restore(localStorage.getItem('dsa-quiz-session-v1'),quizQuestions);}catch{}
const quizCategories=[...new Set(lessons.map(l=>l.group))];
$('quizPanel').innerHTML=`<div class="quiz-hero"><div class="eyebrow">PRACTICE / QUIZ ARENA</div><h1>Think it through.<br><span>Choose your answer.</span></h1><p>200 questions across all 100 topics. Four choices, instant feedback, and the reasoning behind every answer.</p><div class="quiz-hero-tags"><span>100 topics</span><span>Intermediate + Advanced</span><span>Progress saved locally</span></div></div><section class="quiz-setup" aria-labelledby="quizSetupTitle"><div class="quiz-setup-head"><div><h2 id="quizSetupTitle">Build your quiz</h2><p>Mix topics or focus on one algorithm.</p></div><span id="quizPoolCount" class="quiz-count"></span></div><div class="quiz-filters"><label>Category<select id="quizCategory"><option value="all">All categories</option>${quizCategories.map(g=>`<option value="${esc(g)}">${esc(g)}</option>`).join('')}</select></label><label>Topic<select id="quizTopic"></select></label><label>Difficulty<select id="quizLevel"><option value="all">Mixed levels</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label><label>Questions<select id="quizCount"><option value="10">10 questions</option><option value="20">20 questions</option><option value="50">50 questions</option><option value="0">All matching questions</option></select></label></div><div class="quiz-start-row"><button id="quizStart" class="primary">Start quiz →</button><p id="quizSetupHint">Choose an option to reveal the answer. Your first choice counts.</p></div></section><div id="quizAttempt"></div>`;
const quizSide=document.createElement('div');quizSide.id='quizSidebar';quizSide.className='quiz-sidebar';quizSide.hidden=true;
quizSide.innerHTML='<div class="eyebrow">QUIZ MODE</div><h2>Practice with purpose.</h2><p>Pick one of four options, then explore the full explanation.</p><div class="quiz-side-number">200<span>questions · 100 topics</span></div><p>Answer choices shuffle each attempt. Scores and lesson completion are tracked separately.</p><button id="quizBackToLearn" class="secondary">← Back to lessons</button>';
document.querySelector('.sidebar').append(quizSide);
function saveQuiz(){try{localStorage.setItem('dsa-quiz-session-v1',JSON.stringify(quizSession));}catch{}}
function focusQuizStep(){const heading=$('quizQuestionTitle')||$('quizResultTitle');heading?.focus({preventScroll:true});$('quizAttempt').scrollIntoView({block:'start'});}
function updateQuizTopics(){
 const category=$('quizCategory').value,old=$('quizTopic').value;
 $('quizTopic').innerHTML='<option value="all">All topics</option>'+lessons.filter(l=>category==='all'||l.group===category).map(l=>`<option value="${esc(l.id)}">${esc(l.title)}</option>`).join('');
 if([...$('quizTopic').options].some(option=>option.value===old))$('quizTopic').value=old;
 updateQuizPool();
}
function quizSettings(){return {category:$('quizCategory').value,topic:$('quizTopic').value,level:$('quizLevel').value,count:Number($('quizCount').value)};}
function updateQuizPool(){
 const available=QuizEngine.pool(quizQuestions,quizSettings()).length;
 $('quizPoolCount').textContent=`${available} available`;$('quizStart').disabled=available===0;
 const count=Number($('quizCount').value),size=count?Math.min(count,available):available;
 $('quizSetupHint').textContent=available?`${size} question${size===1?'':'s'} in the next attempt. Your first answer counts; starting a new quiz replaces the saved attempt.`:'No questions match. Change a filter.';
}
function switchQuizView(mode,remember=true){
 quizView=mode;const isQuiz=mode==='quiz';pause();
 if(isQuiz&&regexWorker){quizInterruptedRegex=true;cancelRegex();}
 $('learningContent').hidden=isQuiz;$('quizPanel').hidden=!isQuiz;$('nav').hidden=isQuiz;$('lessonSearch').hidden=isQuiz;
 document.querySelector('.sidebar > .side-label').hidden=isQuiz;$('quizSidebar').hidden=!isQuiz;
 for(const [id,active]of [['learnTab',!isQuiz],['quizTab',isQuiz]]){$(id).setAttribute('aria-selected',String(active));$(id).tabIndex=active?0:-1;$(id).classList.toggle('active',active);}
 document.querySelector('.breadcrumb').firstChild.nodeValue=isQuiz?'PRACTICE / ':'LEARN / ';$('crumb').textContent=isQuiz?'Quiz Arena':selected.group;
 if(!isQuiz&&quizInterruptedRegex){quizInterruptedRegex=false;rebuild();}
 if(isQuiz)renderQuiz();
 if(remember)try{localStorage.setItem('dsa-view-v1',mode);}catch{}
}
function renderQuiz(){
 const host=$('quizAttempt');
 if(!quizSession){host.innerHTML='<div class="quiz-empty"><span aria-hidden="true">✦</span><h2>Your next challenge starts here.</h2><p>Choose your topics above and start a quiz. Read each explanation after answering; there is no timer.</p></div>';return;}
 const score=QuizEngine.score(quizSession,quizQuestions);
 const stats=`<div class="quiz-scoreboard" aria-label="Quiz score"><div><strong>${score.answered}<small> / ${score.total}</small></strong><span>Answered</span></div><div><strong>${score.correct}</strong><span>Correct</span></div><div><strong>${score.answered?score.accuracy+'%':'—'}</strong><span>Accuracy so far</span></div><div class="quiz-progress" role="progressbar" aria-label="Questions answered" aria-valuemin="0" aria-valuemax="${score.total}" aria-valuenow="${score.answered}"><span style="width:${score.answered/score.total*100}%"></span></div></div>`;
 if(quizSession.finished){
  host.innerHTML=`${stats}<section class="quiz-results" aria-labelledby="quizResultTitle"><div class="eyebrow">ATTEMPT COMPLETE</div><h2 id="quizResultTitle" tabindex="-1">${score.correct} out of ${score.total} correct.</h2><p>${score.missed.length?'Review the reasoning, then give the missed questions another try.':'Every answer was correct. Try another topic or a different difficulty.'}</p><div class="quiz-result-actions"><button id="quizRetryMissed" class="primary" ${score.missed.length?'':'hidden'}>Retry ${score.missed.length} missed</button><button id="quizNewAttempt" class="secondary">Build another quiz ↑</button></div><h3>Review your answers</h3><div class="quiz-result-list">${quizSession.items.map((item,i)=>{const q=quizById.get(item.id),correct=quizSession.answers[item.id]===q.correctIndex;return `<button type="button" class="quiz-result-item ${correct?'is-right':'is-wrong'}" data-review-index="${i}"><span>${correct?'✓ Correct':'✕ Incorrect'}</span><strong>${i+1}. ${esc(q.topic)}</strong><small>${esc(q.question)}</small></button>`;}).join('')}</div></section>`;
  $('quizRetryMissed').onclick=()=>{const missed=quizQuestions.filter(q=>score.missed.includes(q.id));quizSession=QuizEngine.start(missed,{count:0});saveQuiz();renderQuiz();focusQuizStep();};
  $('quizNewAttempt').onclick=()=>{$('quizSetupTitle').scrollIntoView({block:'start'});$('quizStart').focus({preventScroll:true});};
  host.querySelectorAll('[data-review-index]').forEach(button=>button.onclick=()=>{quizSession={...quizSession,finished:false,index:Number(button.dataset.reviewIndex)};saveQuiz();renderQuiz();focusQuizStep();});
  return;
 }
 const item=quizSession.items[quizSession.index],q=quizById.get(item.id),answered=Object.prototype.hasOwnProperty.call(quizSession.answers,q.id),choice=quizSession.answers[q.id],correct=choice===q.correctIndex;
 host.innerHTML=`${stats}<section class="quiz-card" aria-labelledby="quizQuestionTitle"><div class="quiz-question-meta"><span class="quiz-question-number">Question ${quizSession.index+1} / ${score.total}</span><span class="interview-level ${q.level}">${q.level==='advanced'?'Advanced':'Intermediate'}</span></div><p class="quiz-topic">${esc(q.category)} / ${esc(q.topic)}</p><h2 id="quizQuestionTitle" tabindex="-1">${esc(q.question)}</h2><p class="quiz-keyboard">Choose one answer. Keyboard: 1–4, or Tab and Enter.</p><div class="quiz-options" role="group" aria-label="Four answer choices">${item.order.map((original,display)=>{const chosen=answered&&choice===original,right=answered&&original===q.correctIndex;return `<button type="button" class="quiz-option ${right?'is-correct':''} ${chosen&&!right?'is-incorrect':''}" data-answer="${original}" aria-pressed="${chosen}" ${answered?'disabled':''}><span class="quiz-option-letter">${'ABCD'[display]}</span><span class="quiz-option-text">${esc(q.options[original])}${answered&&(chosen||right)?`<small>${chosen?(right?'✓ Your choice · Correct':'✕ Your choice · Incorrect'):'✓ Correct answer'}</small>`:''}</span></button>`;}).join('')}</div>${answered?`<div id="quizFeedback" class="quiz-feedback ${correct?'is-right':'is-wrong'}" role="status" tabindex="-1"><strong>${correct?'Correct!':'Not quite.'}</strong><p>Correct answer: ${esc(q.options[q.correctIndex])}</p></div><section class="quiz-explanation" aria-labelledby="quizExplanationTitle"><div class="eyebrow">UNDERSTAND THE ANSWER</div><h3 id="quizExplanationTitle">Explanation</h3><p>${esc(q.explanation[0])}</p><div class="quiz-example"><h4>Worked example</h4><p>${esc(q.explanation[1])}</p></div><h4>Complexity and interview traps</h4><p>${esc(q.explanation[2])}</p><button id="quizReviewLesson" class="quiz-lesson-link">Explore ${esc(q.topic)} →</button></section>`:''}<div class="quiz-question-actions"><button id="quizPrev" class="secondary" ${quizSession.index?'':'disabled'}>← Previous</button>${score.answered===score.total&&quizSession.index<score.total-1?'<button id="quizResults" class="secondary">Results</button>':''}<button id="quizNext" class="primary" ${answered?'':'disabled'}>${quizSession.index===score.total-1?'See results →':'Next question →'}</button></div></section>`;
 host.querySelectorAll('[data-answer]').forEach(button=>button.onclick=()=>submitQuizAnswer(Number(button.dataset.answer)));
 $('quizPrev').onclick=()=>{quizSession={...quizSession,index:quizSession.index-1};saveQuiz();renderQuiz();focusQuizStep();};
 $('quizNext').onclick=()=>{if(!answered)return;quizSession=quizSession.index===score.total-1?{...quizSession,finished:true}:{...quizSession,index:quizSession.index+1};saveQuiz();renderQuiz();focusQuizStep();};
 if($('quizResults'))$('quizResults').onclick=()=>{quizSession={...quizSession,finished:true};saveQuiz();renderQuiz();focusQuizStep();};
 if(answered)$('quizReviewLesson').onclick=()=>{switchQuizView('learn');choose(q.lessonId);document.querySelector('.workspace').scrollIntoView({block:'start'});};
}
function submitQuizAnswer(option){
 if(!quizSession||quizSession.finished)return;
 const next=QuizEngine.answer(quizSession,option);if(next===quizSession)return;
 quizSession=next;saveQuiz();renderQuiz();$('quizFeedback')?.focus({preventScroll:true});
}
$('quizCategory').onchange=updateQuizTopics;
for(const id of ['quizTopic','quizLevel','quizCount'])$(id).onchange=updateQuizPool;
$('quizStart').onclick=()=>{try{quizSession=QuizEngine.start(quizQuestions,quizSettings());saveQuiz();renderQuiz();focusQuizStep();}catch(error){$('quizSetupHint').textContent=error.message;}};
$('learnTab').onclick=()=>switchQuizView('learn');$('quizTab').onclick=()=>switchQuizView('quiz');$('quizBackToLearn').onclick=()=>switchQuizView('learn');
document.querySelector('.mode-tabs').addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();const mode=event.key==='Home'?'learn':event.key==='End'?'quiz':quizView==='quiz'?'learn':'quiz';switchQuizView(mode);$(mode==='quiz'?'quizTab':'learnTab').focus();}});
document.addEventListener('keydown',event=>{if(quizView!=='quiz'||!quizSession||quizSession.finished||event.ctrlKey||event.metaKey||event.altKey||/^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)||! /^[1-4]$/.test(event.key))return;event.preventDefault();submitQuizAnswer(quizSession.items[quizSession.index].order[Number(event.key)-1]);});
updateQuizTopics();
if(quizSession){const s=quizSession.settings;if(quizCategories.includes(s.category))$('quizCategory').value=s.category;updateQuizTopics();if([...$('quizTopic').options].some(o=>o.value===s.topic))$('quizTopic').value=s.topic;if(['all','intermediate','advanced'].includes(s.level))$('quizLevel').value=s.level;if([0,10,20,50].includes(s.count))$('quizCount').value=String(s.count);updateQuizPool();}
let initialQuizView='learn';try{if(localStorage.getItem('dsa-view-v1')==='quiz')initialQuizView='quiz';}catch{}
switchQuizView(initialQuizView,false);
