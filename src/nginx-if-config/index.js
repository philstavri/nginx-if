import fs from "fs";
import { argv } from "yargs";
import { resolvePath } from "../utils";

export default class NginxIf {
    constructor() {

        this.configFilename = argv.filename || "nginx-if.json";
        this.configFilePath = resolvePath(this.configFilename);
        
        let config = require(this.configFilePath);
        
        if( !config ){
            process.exit(0)
        }

        this.config = config;
        this.nginxConf = fs.readFileSync(this.nginxConfFilePath, "utf8");
    }

    get conditions() {
        return this.config.conditions;
    }

    get options() {
        return this.config.options;
    }

    get nginxConfFilename() {
        return this.options.nginxConfFilename || "nginx.conf";
    }

    get nginxConfFilePath() {
        return resolvePath(this.nginxConfFilename);
    }

    write() {
        fs.writeFileSync(this.configFilePath, JSON.stringify(this.config, null, 2), 'utf8');
    }
}