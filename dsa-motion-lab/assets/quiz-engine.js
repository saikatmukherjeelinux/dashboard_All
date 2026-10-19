/* Pure quiz state: a first answer is final for its attempt; content is separate. */
(function(root){
 function build(lessons,choices,interviews){
  const questions=[];
  for(const lesson of lessons){
   const options=choices[lesson.id],answers=interviews[lesson.id];
   if(!options||options.length!==2||!answers||answers.length!==2)throw Error('Incomplete quiz coverage for '+lesson.id);
   for(let i=0;i<2;i++){
    if(options[i].length!==4||new Set(options[i]).size!==4||options[i].some(v=>typeof v!=='string'||!v.trim()))throw Error('A quiz question needs four distinct choices: '+lesson.id);
    const level=i?'advanced':'intermediate';
    questions.push({id:lesson.id+':'+level,lessonId:lesson.id,topic:lesson.title,category:lesson.group,level,question:answers[i][0],options:[...options[i]],correctIndex:0,explanation:answers[i].slice(1)});
   }
  }
  if(new Set(questions.map(q=>q.id)).size!==questions.length)throw Error('Duplicate quiz question ID');
  return questions;
 }
 function shuffled(values,random=Math.random){const out=[...values];for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
 function pool(questions,settings={}){return questions.filter(q=>(!settings.category||settings.category==='all'||q.category===settings.category)&&(!settings.topic||settings.topic==='all'||q.lessonId===settings.topic)&&(!settings.level||settings.level==='all'||q.level===settings.level));}
 function start(questions,settings={},random=Math.random){
  const eligible=pool(questions,settings),count=Number(settings.count??10);
  if(!Number.isInteger(count)||count<0||count>200)throw Error('Choose a valid quiz size.');
  if(!eligible.length)throw Error('No questions match these filters.');
  const selected=shuffled(eligible,random).slice(0,count||eligible.length);
  return {version:1,items:selected.map(q=>({id:q.id,order:shuffled([0,1,2,3],random)})),answers:{},index:0,finished:false,settings:{category:settings.category||'all',topic:settings.topic||'all',level:settings.level||'all',count}};
 }
 function answer(state,option){
  const id=state.items[state.index].id;
  if(Object.prototype.hasOwnProperty.call(state.answers,id))return state;
  if(!Number.isInteger(option)||option<0||option>3)throw Error('Select one of the four options.');
  return {...state,answers:{...state.answers,[id]:option}};
 }
 function score(state,questions){
  const byId=new Map(questions.map(q=>[q.id,q]));let answered=0,correct=0;const missed=[];
  for(const item of state.items)if(Object.prototype.hasOwnProperty.call(state.answers,item.id)){answered++;if(state.answers[item.id]===byId.get(item.id).correctIndex)correct++;else missed.push(item.id);}
  return {answered,correct,total:state.items.length,accuracy:answered?Math.round(correct/answered*1000)/10:0,missed};
 }
 function restore(value,questions){
  try{
   if(typeof value!=='string'||value.length>100000)return null;
   const s=JSON.parse(value),ids=new Set(questions.map(q=>q.id));
   if(!s||s.version!==1||!Array.isArray(s.items)||!s.items.length||s.items.length>questions.length||!s.answers||typeof s.answers!=='object'||Array.isArray(s.answers))return null;
   if(new Set(s.items.map(x=>x?.id)).size!==s.items.length)return null;
   for(const item of s.items)if(!item||!ids.has(item.id)||!Array.isArray(item.order)||item.order.length!==4||item.order.some(x=>!Number.isInteger(x))||[...item.order].sort().join(',')!=='0,1,2,3')return null;
   const included=new Set(s.items.map(x=>x.id));
   for(const [id,option]of Object.entries(s.answers))if(!included.has(id)||!Number.isInteger(option)||option<0||option>3)return null;
   if(!Number.isInteger(s.index)||s.index<0||s.index>=s.items.length)return null;
   const answered=Object.keys(s.answers).length;
   if(!s.items.slice(0,answered).every(item=>Object.prototype.hasOwnProperty.call(s.answers,item.id))||s.index>answered)return null;
   if(s.finished&&score(s,questions).answered!==s.items.length)return null;
   return {version:1,items:s.items.map(x=>({id:x.id,order:[...x.order]})),answers:{...s.answers},index:s.index,finished:Boolean(s.finished),settings:{category:'all',topic:'all',level:'all',count:10,...(s.settings&&typeof s.settings==='object'?s.settings:{})}};
  }catch{return null;}
 }
 root.QuizEngine={build,shuffled,pool,start,answer,score,restore};if(typeof module!=='undefined')module.exports=root.QuizEngine;
})(globalThis);
