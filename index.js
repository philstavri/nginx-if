let argv = require("yargs")
            .array("on")
            .array("off")
            .argv;
let fs = require("fs");
let path = require("path");

const FILENAME = argv.filename || "nginx-if.json";
const ON = argv.on;
const OFF = argv.off; 

function resolvePath(filename) {
    let cwdPath = path.join(process.cwd(), filename);
    let dirPath = path.join(__dirname, filename);

    if(fs.existsSync(cwdPath)){
        return cwdPath;
    } else if (fs.existsSync(dirPath)){
        return dirPath;
    }

    throw new Error(`File ${filename} was not found locally or in cwd`);
}

const REGEX = /(#ngx\-if start\s*)([\s\S]*?)(\s*#ngx\-if end)/gm;


let configPath = resolvePath(FILENAME);
let config = require(configPath);
let nginxConfFilename = config.options.nginxConfFilename || "nginx.conf";
let nginxConfPath = resolvePath(nginxConfFilename);

console.log("config", config);
console.log("nginxConfPath", nginxConfPath);

let nginxConf = fs.readFileSync(nginxConfPath, "utf8");
console.log("nginxConf", nginxConf);
console.log("ON", ON);
console.log("OFF", OFF);

if(REGEX.test(nginxConf)){

    let statements = config.conditions.map(function(condition) {

        if(ON && ON.includes(condition.name)) {
            condition.isOn = true;
        } else if(OFF && OFF.includes(condition.name)){
            condition.isOn = false;
        }

        return condition.isOn ? condition.on : condition.off;
    }).join("\n");

    console.log("statements", statements);

    nginxConf = nginxConf.replace(REGEX, function(match, openComment, previousStatements, closeComment){
        return openComment + statements +closeComment;
    });

    fs.writeFileSync(nginxConfPath, nginxConf, 'utf8');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
}


