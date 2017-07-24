
module.exports = {

  // Gets a Date object with the current date in a given timezone.
  // The timezone offset is used as a parameter in the options argument.
  getDateNow: function (options, next) {
    var localDate = new Date();
    var destDate = null;

    var localoffset = -(localDate.getTimezoneOffset());
    var destoffset = options.offset;
    var offset = destoffset - localoffset;

    if (options.timeStamp) {
        destDate = new Date(options.timeStamp + offset * 60 * 1000);
    } else {
        destDate = new Date(Date.now() + offset * 60 * 1000);
    }

    return destDate;
  },

  // Creates a string formated as YYYY-MM-DD with a date object argument.
  createDateFormat: function (options, next) {
    var date = options.dateObject;
    var dateStr = date.getFullYear();
    if (date.getMonth() + 1 < 10) {
      dateStr += '-' + '0' + (date.getMonth() + 1);
    } else {
      dateStr += '-' + date.getMonth() + 1;
    }
    if (date.getDate() < 10) {
      dateStr += '-' + '0' + date.getDate();
    } else {
      dateStr += '-' + date.getDate();
    }
    return dateStr
  }
}
