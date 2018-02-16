require("babel-register");
let nginxSwitcher = require("./src/main.js").default;
console.log("nginxSwitch", nginxSwitcher);
nginxSwitcher();