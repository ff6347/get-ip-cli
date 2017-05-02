#! /usr/bin/env node

/* eslint no-undefined: "off" */

const fs = require('fs');
const path = require('path');

const program = require('commander');
const clipboardy = require('clipboardy');
const ipRegex = require('ip-regex');

const pkg = require('./package.json');

let inPath = null;
let outPath = null;
let toStdout = false;
let fromClipboard = true;
let data = '';

function parseInPath (val) {
  if(fs.existsSync(path.resolve(process.cwd(), val))) {
    inPath = val;
  }else{
    console.log('the specified file path for the input file does not exist');
    // process.exit(1);
  }
}

function parseOutPath(val) {
  outPath = val;

}


program
  .version(pkg.version)
  .option('-i, --input <input>', 'path to the input file', parseInPath)
  .option('-o, --output <output>', 'path to the output file', parseOutPath)
  .option('-s --stdout', 'log line by line to stdout')
  .option('-j --jout', 'log a json string to stdout');


program.parse(process.argv);


if(program.input !== undefined) {
  data = fs.readFileSync(inPath, 'utf8');
  fromClipboard = false;
}else{
  data = clipboardy.readSync();
}


data = data.match(ipRegex());

if(program.stdout !== undefined) {
  if(data !== null) {
    if(Array.isArray(data)) {
      data.forEach((element) =>{
        console.log(element);
      });
    }
  }
}

data = JSON.stringify(data);

if(program.jout !== undefined) {
  if(data !== null) {
    console.log(data);
  }
}

if(program.output !== undefined) {
  fs.writeFile(outPath, data, 'utf8', (error, md) => {
    if(error) {
      throw error;
    }
    console.log(`wrote to ${outPath}`);
  });
}else{
  // console.log('Putting the follosing output also  into the clipboard:');
  // console.log(data);
  clipboardy.writeSync(data);
}
