import { assert } from '../chai.js';
import * as internal from "../../src/internal.js";
import AutoSizeTextarea from "../../define/AutoSizeTextarea.js";

describe("AutoSizeTextarea", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("sets initial value from initial innerHTML", async () => {
    container.innerHTML =
      "<elix-auto-size-textarea>aardvark</elix-auto-size-textarea>";
    const fixture = container.querySelector("elix-auto-size-textarea");
    // Wait for slotchange event.
    await new Promise(resolve => setTimeout(resolve));
    assert.equal(fixture.value, "aardvark");
  });

  it("applies its value to the inner textarea", () => {
    const fixture = new AutoSizeTextarea();
    fixture.value = "beaver";
    fixture[internal.renderChanges]();
    assert(fixture.inner.value, "beaver");
  });

  it("updates value when innerHTML changes", async () => {
    const fixture = new AutoSizeTextarea();
    container.appendChild(fixture);
    fixture.innerHTML = "chihuahua";
    // Give content time to change.
    await Promise.resolve();
    assert.equal(fixture.value, "chihuahua");
  });

  it("value property tracks content until value is directly set", async () => {
    const fixture = new AutoSizeTextarea();
    fixture.textContent = "dingo";
    container.appendChild(fixture);
    // Give content time to change.
    await Promise.resolve();
    assert(fixture[internal.state].valueTracksContent);
    assert.equal(fixture.value, "dingo");
    fixture.value = "echidna";
    // Give content time to change. Value should track content.
    assert(!fixture[internal.state].valueTracksContent);
    assert.equal(fixture.value, "echidna");
    fixture.textContent = "fox";
    // Give content time to change. Value should remain unchanged.
    await Promise.resolve();
    assert(!fixture[internal.state].valueTracksContent);
    assert.equal(fixture.value, "echidna");
  });

  it("sets minimumRows to 1 by default", () => {
    const fixture = new AutoSizeTextarea();
    assert.equal(fixture.minimumRows, 1);
  });

  it("marshalls the minimum-rows attribute to the minimumRows property", () => {
    container.innerHTML =
      '<elix-auto-size-textarea minimum-rows="10"></elix-auto-size-textarea>';
    const fixture = container.querySelector("elix-auto-size-textarea");
    assert.equal(fixture.minimumRows, 10);
  });

  it("autosizes to fit its contents", async () => {
    const fixture = new AutoSizeTextarea();
    container.appendChild(fixture);
    const originalHeight = fixture.clientHeight;
    fixture.value = "One\nTwo\nThree";
    // Height with three lines of text should be over twice as big.
    await Promise.resolve();
    assert(fixture.clientHeight > originalHeight * 2);
  });

  it("applies minimumRows when text isn't tall enough", async () => {
    const fixture = new AutoSizeTextarea();
    container.appendChild(fixture);
    // Original height should be sufficient to hold single line of text.
    const originalHeight = fixture.clientHeight;
    fixture.minimumRows = 3;
    await Promise.resolve();
    // Height with minimumRows=3 should be over twice as big.
    assert(fixture.clientHeight > originalHeight * 2);
  });

  it("autosizes works when its text content is HTML", async () => {
    const fixture = new AutoSizeTextarea();
    container.appendChild(fixture);
    const originalHeight = fixture.clientHeight;
    fixture.value = `<html>\n<body>\n<p>\nThis is a test\n</p>\n<div>\nSome more tests\n</div>\n</body>\n</html>`;
    await Promise.resolve();
    assert(fixture.clientHeight > originalHeight * 2);
  });

  it("autosizes works with text wrapping", async () => {
    const fixture = new AutoSizeTextarea();
    fixture.style.width = "400px";
    container.appendChild(fixture);
    const originalHeight = fixture.clientHeight;
    fixture.value =
      "Lots of words to force wrapping. Lots of words to force wrapping. Lots of words to force wrapping. Lots of words to force wrapping. Lots of words to force wrapping. Lots of words to force wrapping. Lots of words to force wrapping. Lots of words to force wrapping. Lots of words to force wrapping.";
    await Promise.resolve();
    assert(fixture.clientHeight > originalHeight * 2);
  });

  it("autosizes works with long string with no whitespace", async () => {
    const fixture = new AutoSizeTextarea();
    fixture.style.width = "400px";
    container.appendChild(fixture);
    const originalHeight = fixture.clientHeight;
    fixture.value =
      "abcdefghijklmnopqrstuvwxyz.,;:+-abcdefghijklmnopqrstuvwxyz.,;:+-abcdefghijklmnopqrstuvwxyz.,;:+-abcdefghijklmnopqrstuvwxyz.,;:+-abcdefghijklmnopqrstuvwxyz.,;:+-abcdefghijklmnopqrstuvwxyz.,;:+-abcdefghijklmnopqrstuvwxyz.,;:+-abcdefghijklmnopqrstuvwxyz.,;:+-";
    await Promise.resolve();
    assert(fixture.clientHeight > originalHeight * 2);
  });

  it("applies its placeholder property to the inner textarea", async () => {
    const fixture = new AutoSizeTextarea();
    container.appendChild(fixture);
    fixture.placeholder = "Placeholder";
    await Promise.resolve();
    assert.equal(fixture.inner.placeholder, "Placeholder");
    assert.notEqual(fixture.value, "Placeholder");
  });
});
