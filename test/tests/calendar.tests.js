import * as calendar from '../../src/calendar.js';


describe("calendar helpers", () => {

  it("can determine facts about a date", async () => {
    const date = new Date('10 March 2015');
    assert.deepEqual(calendar.firstDateOfMonth(date), new Date('1 March 2015'));
    assert.deepEqual(calendar.lastDateOfMonth(date), new Date('31 March 2015'));
    assert(calendar.monthContainsDate(date, new Date('12 March 2015')));
    assert(!calendar.monthContainsDate(date, new Date('1 April 2015')));
  });

});

