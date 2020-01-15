import { assert } from '../chai.js';
import * as internal from "../../src/internal.js";
import LanguageDirectionMixin from "../../src/LanguageDirectionMixin.js";
import ReactiveElement from "../../src/ReactiveElement.js";

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
    container.appendChild(fixture);
    assert(fixture[internal.state].rightToLeft === false);
  });

  it("sets state.rightToLeft to true in right-to-left context", () => {
    const fixture = new LanguageDirectionTest();
    const div = document.createElement("div");
    div.setAttribute("dir", "rtl");
    div.appendChild(fixture);
    container.appendChild(div);
    assert(fixture[internal.state].rightToLeft);
  });
});
