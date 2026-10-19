/* Match-level regex traces. Run untrusted patterns in a terminable Web Worker. */
(function(root){
 function solve(config,text,pattern,flags='',replacement=''){
  if(!['matches','validate','split','replace'].includes(config.mode))throw Error('Unknown regex operation');
  if(Array.from(text).length>256)throw Error('Use at most 256 text characters.');
  if(Array.from(pattern).length>160)throw Error('Use at most 160 pattern characters.');
  if(replacement.length>80)throw Error('Use at most 80 replacement characters.');
  if(Array.from(flags).some(flag=>!'ims'.includes(flag))||new Set(flags).size!==flags.length)throw Error('Flags may contain i, m, and s once each. Global search and Unicode mode are automatic.');
  const frames=[],matches=[],characters=Array.from(text),offset=value=>Array.from(text.slice(0,value)).length;
  function emit(msg,active=[],extra={}){frames.push({a:[],active:[],done:[],msg,text:[...characters],highlight:[...active],matches:matches.map(m=>({...m,groups:[...m.groups]})),...extra});}
  const compileFlags='gu'+flags;
  let expression;
  try{expression=new RegExp(pattern,compileFlags);}catch(error){throw Error('Invalid JavaScript regex: '+error.message);}
  emit(`Compile /${pattern}/${compileFlags}. Positions count Unicode code points.`);
  let result;
  if(config.mode==='validate'){
   // Sticky starts at index 0; the final assertion requires the true text end,
   // even with multiline mode or a final newline. Wrapping allows alternatives
   // to backtrack to a longer full match rather than accepting a short prefix.
   const entire=new RegExp('(?:'+pattern+')(?![\\s\\S])','uy'+flags),match=entire.exec(text);
   result=Boolean(match);
   if(match)matches.push({match:match[0],start:0,end:characters.length,groups:match.slice(1).map(v=>v??null)});
   emit(result?'The complete text satisfies the pattern.':'The complete text does not satisfy the pattern.',result?characters.map((_,i)=>i):[]);
  }else{
   const parts=[];let cursor=0,match;
   while((match=expression.exec(text))!==null){
    const start=offset(match.index),end=offset(match.index+match[0].length),record={match:match[0],start,end,groups:match.slice(1).map(v=>v??null)};
    matches.push(record);
    if(config.mode==='split'){parts.push(text.slice(cursor,match.index));cursor=match.index+match[0].length;}
    if(config.mode==='replace'){
     const expanded=replacement.replace(/\$(\$|[1-9])/g,(_,key)=>key==='$'?'$':Number(key)<match.length?(match[Number(key)]??''):'$'+key);
     parts.push(text.slice(cursor,match.index),expanded);cursor=match.index+match[0].length;
    }
    emit(`${match[0].length?'Match':'Zero-width match'} ${matches.length}: [${start}, ${end}) = ${JSON.stringify(match[0])}`,Array.from({length:end-start},(_,i)=>start+i),{boundary:match[0].length?null:start});
    if(!match[0].length){
     // RegExp.exec does not advance after an empty match. Advance by a whole
     // code point in Unicode mode, or past the end to stop safely.
     const char=Array.from(text.slice(expression.lastIndex))[0];expression.lastIndex+=char?char.length:1;
    }
   }
   if(config.mode==='split'||config.mode==='replace'){parts.push(text.slice(cursor));result=config.mode==='split'?parts:parts.join('');}
   else result=matches.map(m=>({...m,groups:[...m.groups]}));
  }
  const summary=config.mode==='validate'?String(result):config.mode==='split'?`${result.length} pieces`:config.mode==='replace'?'replacement complete':`${matches.length} matches`;
  emit(`Result: ${summary}`,[],{result});
  return {frames,result,matches};
 }
 root.RegexAlgorithms={solve};
 if(typeof module!=='undefined')module.exports={solve};
})(globalThis);
