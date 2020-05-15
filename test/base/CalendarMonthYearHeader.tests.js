import CalendarMonthYearHeader from "../../define/CalendarMonthYearHeader.js";
import { ids, renderChanges } from "../../src/base/internal.js";
import { trimMarks } from "../normalize.js";
import { assert } from "../testHelpers.js";

describe("CalendarMonthYearHeader", () => {
  it("renders English US month header", async () => {
    const fixture = new CalendarMonthYearHeader();
    fixture.locale = "en-US";
    fixture.date = new Date("10 March 2015");
    await fixture[renderChanges]();
    assert.equal(trimMarks(fixture[ids].formatted.textContent), "March 2015");
  });

  it("renders Japanese month header", async () => {
    const fixture = new CalendarMonthYearHeader();
    fixture.locale = "ja-JP";
    fixture.date = new Date("10 March 2015");
    await fixture[renderChanges]();
    assert.equal(trimMarks(fixture[ids].formatted.textContent), "2015年3月");
  });
});
