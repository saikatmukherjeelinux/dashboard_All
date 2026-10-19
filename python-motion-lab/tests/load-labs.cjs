const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const context={window:{}};vm.createContext(context);
for(const file of ['lessons.js','labs.js','lab-scenes.js','lab-experiments.js','lab-experiments-more.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../assets',file),'utf8'),context,{filename:file});
module.exports={labs:context.window.LABS,scenes:context.window.LabScenes,lessons:context.window.LESSONS};
