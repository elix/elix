import CalendarDayNamesHeader from "../../define/CalendarDayNamesHeader.js";
import { ids, renderChanges } from "../../src/base/internal.js";
import { trimMarks } from "../normalize.js";
import { assert } from "../testHelpers.js";

describe("CalendarDayNamesHeader", () => {
  it("renders short English US week days", async () => {
    const fixture = new CalendarDayNamesHeader();
    fixture.locale = "en-US";
    await fixture[renderChanges]();
    assert.equal(trimMarks(fixture[ids].day0.textContent), "Sun");
    assert.equal(trimMarks(fixture[ids].day1.textContent), "Mon");
    assert.equal(trimMarks(fixture[ids].day2.textContent), "Tue");
    assert.equal(trimMarks(fixture[ids].day3.textContent), "Wed");
    assert.equal(trimMarks(fixture[ids].day4.textContent), "Thu");
    assert.equal(trimMarks(fixture[ids].day5.textContent), "Fri");
    assert.equal(trimMarks(fixture[ids].day6.textContent), "Sat");
  });

  it("renders narrow English US week days", async () => {
    const fixture = new CalendarDayNamesHeader();
    fixture.locale = "en-US";
    fixture.format = "narrow";
    await fixture[renderChanges]();
    // Edge shows "Su", everyone else shows "S".
    const trimmed = trimMarks(fixture[ids].day0.textContent);
    assert(trimmed === "S" || trimmed === "Su");
  });

  it("renders short French week days", async () => {
    const fixture = new CalendarDayNamesHeader();
    fixture.locale = "fr-FR";
    await fixture[renderChanges]();
    assert.equal(trimMarks(fixture[ids].day0.textContent), "lun."); // A Monday
    assert.equal(trimMarks(fixture[ids].day1.textContent), "mar.");
    assert.equal(trimMarks(fixture[ids].day2.textContent), "mer.");
    assert.equal(trimMarks(fixture[ids].day3.textContent), "jeu.");
    assert.equal(trimMarks(fixture[ids].day4.textContent), "ven.");
    assert.equal(trimMarks(fixture[ids].day5.textContent), "sam.");
    assert.equal(trimMarks(fixture[ids].day6.textContent), "dim.");
  });
});
