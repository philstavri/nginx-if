let argv = require("yargs").argv;
let fs = require("fs");
let path = require("path");

const FILENAME = argv.filename || "nginx-if.json";

let cwdPath = path.join(process.cwd(), FILENAME);
let dirPath = path.join(__dirname, FILENAME);
let config;

if(fs.existsSync(cwdPath)){
    console.log("found at cwd");
    config = require(cwdPath);
} else if (fs.existsSync(dirPath)){
    console.log("found at dir");
    config = require(dirPath);
}

console.log("config", config);


