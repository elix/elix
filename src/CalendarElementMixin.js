export default function CalendarElementMixin(Base) {

  // The class prototype added by the mixin.
  class CalendarElement extends Base {

    get date() {
      return this.state.date;
    }
    set date(date) {
      this.setState({ date });
    }

    get defaultState() {
      return Object.assign({}, super.defaultState, {
        date: new Date,
        locale: navigator.language
      });
    }

    get locale() {
      return this.state.locale;
    }
    set locale(locale) {
      this.setState({ locale });
    }

  }

  return CalendarElement;
}
