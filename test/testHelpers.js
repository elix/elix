// This module supplies consistent references to test helpers regardless of
// whether tests are being run in the browser vs. in node.

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
