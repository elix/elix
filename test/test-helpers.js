// use this file to split when run in the browser vs. run on node

let assert;
let sinon;
if (typeof window === "undefined") {
    assert = require("chai").assert;
    sinon = require("sinon");
} else {
    // @ts-ignore
    assert = window.assert;
    // @ts-ignore
    sinon = window.sinon;
}

export { assert, sinon };