import { assert } from "../testHelpers.js";
import * as calendar from "../../src/base/calendar.js";
import DateComboBox from "../../define/DateComboBox.js";

describe("DateComboBox", () => {
  let container;

  before(() => {
    container = document.getElementById("container");
  });

  afterEach(() => {
    container.innerHTML = "";
  });

  it("parses value according to locale", () => {
    const fixture = new DateComboBox();
    fixture.locale = "en-US";
    fixture.value = "1/2/2019"; // 2 Jan 2019
    const expectedDate1 = new Date(2019, 0, 2); // 2 Jan 2019
    assert(calendar.datesEqual(fixture.date, expectedDate1));
    assert.equal(fixture.value, "1/2/2019"); // Unchanged
    // Reparse value with new locale.
    fixture.locale = "en-GB";
    const expectedDate2 = new Date(2019, 1, 1); // 1 Feb 2019
    assert(calendar.datesEqual(fixture.date, expectedDate2));
    assert.equal(fixture.value, "01/02/2019"); // en-GB prefers leading zero
  });

  it("parses date according to locale", () => {
    const fixture = new DateComboBox();
    fixture.locale = "en-US";
    fixture.date = new Date(2019, 0, 2); // 2 Jan 2019
    assert.equal(fixture.value, "1/2/2019");
    // Reformate date with new locale.
    fixture.locale = "en-GB";
    assert.equal(fixture.value, "02/01/2019"); // en-GB prefers leading zero
  });
});
