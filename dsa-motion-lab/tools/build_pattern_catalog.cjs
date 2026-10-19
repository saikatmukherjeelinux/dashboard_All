// Run before build_pattern_samples.py after editing the catalogue.
const fs=require('fs'),path=require('path');
fs.writeFileSync(path.resolve(__dirname,'../python_examples/pattern_recipes.json'),JSON.stringify(require('../assets/interview-pattern-catalog.js'),null,2)+'\n');
