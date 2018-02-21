import yargs from "yargs";
import fs from "fs";
import path from "path";
import NginxIf from "./nginx-if-config";
import { resolvePath } from "./utils";

export default function nginxSwitcher() {
    let argv = yargs
        .array("on")
        .array("off")
        .argv;

    const ON = argv.on;
    const OFF = argv.off;

    const REGEX = /(#ngx\-if start\s*)([\s\S]*?)(\s*#ngx\-if end)/gm;

    let nginxIf = new NginxIf();

    if (REGEX.test(nginxIf.nginxConf)) {

        let statements = nginxIf.conditions.map(function(condition) {

            if (ON && ON.includes(condition.name)) {
                condition.isOn = true;
            } else if (OFF && OFF.includes(condition.name)) {
                condition.isOn = false;
            }

            return condition.isOn ? condition.on : condition.off;
        }).join("\n");

        nginxIf.nginxConf = nginxIf.nginxConf.replace(REGEX, function(match, openComment, previousStatements, closeComment) {
            return openComment + statements + closeComment;
        });

        console.log(nginxIf.nginxConf);

        fs.writeFileSync(nginxIf.nginxConfFilePath, nginxIf.nginxConf, 'utf8');
        nginxIf.write();
    }
}


