import { state } from "../../src/base/internal.js";
import LanguageDirectionMixin from "../../src/base/LanguageDirectionMixin.js";
import ReactiveElement from "../../src/core/ReactiveElement.js";
import { assert } from "../testHelpers.js";

class LanguageDirectionTest extends LanguageDirectionMixin(ReactiveElement) {}
customElements.define("language-direction-test", LanguageDirectionTest);

describe("LanguageDirectionMixin", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("sets state.rightToLeft to false in left-to-right context", () => {
    const fixture = new LanguageDirectionTest();
    container.append(fixture);
    assert(fixture[state].rightToLeft === false);
  });

  it("sets state.rightToLeft to true in right-to-left context", () => {
    const fixture = new LanguageDirectionTest();
    const div = document.createElement("div");
    div.setAttribute("dir", "rtl");
    div.append(fixture);
    container.append(div);
    assert(fixture[state].rightToLeft);
  });
});
