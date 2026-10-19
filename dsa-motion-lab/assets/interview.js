// The selected lesson owns its Q&A; there are no extra navigation entries.
const interviewChooseBefore=choose;
function renderInterview(id){
 const questions=InterviewBank[id];
 if(!questions||questions.length!==2)throw Error('Missing interview questions for '+id);
 $('interviewQuestions').innerHTML=`<div class="eyebrow">INTERVIEW PRACTICE</div><h2 id="interviewTitle">${esc(selected.title)} · Interview Q&amp;A</h2><p class="interview-intro">Try answering before opening each explanation. Both questions belong to this lesson.</p>${questions.map(([question,answer,example,tradeoff],i)=>`<details class="interview-question"><summary><span class="interview-level ${i?'advanced':'intermediate'}">${i?'Advanced':'Intermediate'}</span><span class="interview-question-title">${esc(question)}</span><span class="interview-toggle" aria-hidden="true">+</span></summary><div class="interview-answer"><h3>Answer and reasoning</h3><p>${esc(answer)}</p><div class="interview-example"><h3>Worked example</h3><p>${esc(example)}</p></div><h3>Complexity, trade-offs, and interview traps</h3><p>${esc(tradeoff)}</p></div></details>`).join('')}`;
}
choose=function(id){interviewChooseBefore(id);renderInterview(id);};
renderInterview(selected.id);
