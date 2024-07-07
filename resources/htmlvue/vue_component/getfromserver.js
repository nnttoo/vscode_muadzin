"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrayTimes = getPrayTimes;
function getFullUrl(relative) {
    var add = window.myserveradd;
    if (add.endsWith("/")) {
        add = add.substring(0, add.length - 1);
    }
    if (!relative.startsWith("/")) {
        relative = "/" + relative;
    }
    return add + relative;
}
async function getPrayTimes() {
    try {
        let res = await fetch(getFullUrl("/gettimes"));
        let tst = await res.text();
        let obj = JSON.parse(tst);
        return obj;
    }
    catch (error) {
    }
    return null;
}
//# sourceMappingURL=getfromserver.js.map