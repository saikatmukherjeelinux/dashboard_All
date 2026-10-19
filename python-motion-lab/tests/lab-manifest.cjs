const fs=require('node:fs'),path=require('node:path'),{labs}=require('./load-labs.cjs');
const out=path.join(__dirname,'../test-results');fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'lab-examples.json'),JSON.stringify(labs.filter(l=>l.output).map(l=>({title:l.title,lesson:l.lessons[0],code:l.code(),output:l.output()}))));
console.log('Exported 94 visual-lab Python snippets for output verification.');
