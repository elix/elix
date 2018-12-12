import * as calendar from '../../src/calendar.js';


describe("calendar helpers", () => {

  it("can determine facts about a date", async () => {
    const date = new Date('10 March 2015');
    assert.deepEqual(calendar.firstDateOfMonth(date), new Date('1 March 2015'));
    assert.deepEqual(calendar.lastDateOfMonth(date), new Date('31 March 2015'));
    assert(calendar.sameMonthAndYear(date, new Date('12 March 2015')));
    assert(!calendar.sameMonthAndYear(date, new Date('1 April 2015')));
  });

  it("can parse numeric en-US dates", () => {
    const dateTimeFormatOptions = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    };
    const text = '1/2/2019'; // 2019 Jan 2
    const actual = calendar.parse(text, 'en-US', dateTimeFormatOptions);
    const expected = new Date(2019, 0, 2); // 2019 Jan 2
    assert.equal(actual.getTime(), expected.getTime());
  });

  it("can parse short numeric en-US dates", () => {
    const dateTimeFormatOptions = {
      day: 'numeric',
      month: 'numeric'
    };
    const text = '1/2'; // Jan 2
    const actual = calendar.parse(text, 'en-US', dateTimeFormatOptions);
    const expected = new Date();
    expected.setDate(2);
    expected.setMonth(0); // January
    expected.setHours(0);
    expected.setMinutes(0);
    expected.setSeconds(0);
    expected.setMilliseconds(0);
    assert.equal(actual.getTime(), expected.getTime());
  });

  it("can parse numeric en-GB dates", () => {
    const dateTimeFormatOptions = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    };
    const text = '1/2/2019'; // 2019 Feb 1
    const actual = calendar.parse(text, 'en-GB', dateTimeFormatOptions);
    const expected = new Date(2019, 1, 1); // 2019 Feb 1
    assert.equal(actual.getTime(), expected.getTime());
  });

  it("can parse short numeric en-GB dates", () => {
    const dateTimeFormatOptions = {
      day: 'numeric',
      month: 'numeric'
    };
    const text = '1/2'; // Feb 1
    const actual = calendar.parse(text, 'en-GB', dateTimeFormatOptions);
    const expected = new Date();
    expected.setDate(1);
    expected.setMonth(1); // February
    expected.setHours(0);
    expected.setMinutes(0);
    expected.setSeconds(0);
    expected.setMilliseconds(0);
    assert.equal(actual.getTime(), expected.getTime());
  });

});
