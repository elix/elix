import { assert } from "../testHelpers.js";
import * as calendar from "../../src/calendar.js";
import * as internal from "../../src/internal.js";
import CalendarDays from "../../define/CalendarDays.js";

describe("CalendarDays", () => {
  it("returns day elements inside the calendar's range", async () => {
    const fixture = new CalendarDays();
    fixture.startDate = new Date("1 January 2019");
    fixture.dayCount = 31;
    await fixture[internal.renderChanges]();
    assert.equal(31, fixture.days.length);
    const lastDay = fixture.days[30];
    assert(calendar.datesEqual(lastDay["date"], new Date("31 Jan 2019")));
    const dateInRange = new Date("15 January 2019");
    const dayElementInRange = fixture.dayElementForDate(dateInRange);
    assert.equal(fixture.days[14], dayElementInRange);
    const dateOutOfRange = new Date("1 Jan 2016");
    assert.isUndefined(fixture.dayElementForDate(dateOutOfRange));
  });

  it("positions days with respect to the locale's preferred week start day", async () => {
    const fixture = new CalendarDays();
    fixture.locale = "en-US"; // Weeks start on Sunday
    fixture.startDate = new Date("10 March 2015"); // A Tuesday
    await fixture[internal.renderChanges]();
    assert.equal(fixture.days[0]["style"].gridColumnStart, "3");
    fixture.locale = "en-GB"; // Weeks start on Monday
    await fixture[internal.renderChanges]();
    assert.equal(fixture.days[0]["style"].gridColumnStart, "2");
  });
});
