
import path from "path";
import fs from "fs";

export function resolvePath(filename) {
    let cwdPath = path.join(process.cwd(), filename);

    if (fs.existsSync(cwdPath)) {
        return cwdPath;
    } 

    throw new Error(`File ${filename} was not found locally or in cwd`);
}