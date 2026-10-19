const {e}=require('../examples/helpers.cjs');
exports.e=e;
exports.lesson=(id,title,label,category,answer,use,caution,summary,...examples)=>({id,title,label,category,source:'extension',body:`### Answer\n\n${answer}\n\n### When is this useful?\n\n${use}\n\n### Common mistake to avoid\n\n${caution}`,summary,examples});
