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
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    const text = '1/2/2019'; // 2019 Jan 2
    const actual = calendar.parse(text, dateTimeFormat);
    const expected = new Date(2019, 0, 2); // 2019 Jan 2
    assert.equal(actual.getTime(), expected.getTime());
  });

  it("can parse short numeric en-US dates", () => {
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'numeric'
    });
    const text = '1/2'; // Jan 2
    const actual = calendar.parse(text, dateTimeFormat);
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
    const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    const text = '1/2/2019'; // 2019 Feb 1
    const actual = calendar.parse(text, dateTimeFormat);
    const expected = new Date(2019, 1, 1); // 2019 Feb 1
    assert.equal(actual.getTime(), expected.getTime());
  });

  it("can parse short numeric en-GB dates", () => {
    const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'numeric'
    });
    const text = '1/2'; // Feb 1
    const actual = calendar.parse(text, dateTimeFormat);
    const expected = new Date();
    expected.setDate(1);
    expected.setMonth(1); // February
    expected.setHours(0);
    expected.setMinutes(0);
    expected.setSeconds(0);
    expected.setMilliseconds(0);
    assert.equal(actual.getTime(), expected.getTime());
  });

  it("can parse short dates with future or past bias", () => {
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();
    
    // NOTE: This test will pass on December 31, but will not exercise the past
    // bias, because the function considers today to be a date in the past.
    const todayIsDec31 = month === 11 && day === 31;
    const expectedPast = todayIsDec31 ?
      new Date(year, 11, 31) :
      new Date(year - 1, 11, 31);
    const actualPast = calendar.parseWithOptionalYear('12/31', dateTimeFormat, 'past');
    assert.equal(actualPast.getTime(), expectedPast.getTime());
    
    // NOTE: This test will pass on January 1, but will not exercise the future
    // bias, because the function considers today to be a date in the future.
    const todayIsJan1 = month === 0 && day === 1;
    const expectedFuture = todayIsJan1 ?
      new Date(year, 0, 1) :
      new Date(year + 1, 0, 1);
    const actualFuture = calendar.parseWithOptionalYear('1/1', dateTimeFormat, 'future');
    assert.equal(actualFuture.getTime(), expectedFuture.getTime());
  });

});
