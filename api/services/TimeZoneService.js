
module.exports = {

  // Gets a Date object with the current date in a given timezone.
  // The timezone offset is used as a parameter in the options argument.
  getDate: function (options, next) {
    var localDate = new Date();
    var destDate = null;

    var localoffset = -(localDate.getTimezoneOffset());
    var destoffset = options.offset;
    var offset = destoffset - localoffset;

    if (options.timestamp) {
        destDate = new Date(options.timestamp + offset * 60 * 1000);
    } else {
        destDate = new Date(Date.now() + offset * 60 * 1000);
    }

    return destDate;
  },

  // Creates a string formated as YYYY-MM-DD hh:mm:ss with a date object argument.
  createFullDateFormat: function (options, next) {
    var date = options.dateObject;
    var dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    var timeStr = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

    return dateStr + ' ' + timeStr;
  },

  // Creates a string formated as YYYY-MMM-DD with a date object argument.
  createDateFormat: function (options, next) {
    var date = options.dateObject;
    var dateStr = date.getFullYear();
    dateStr += '-' + (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1);
    dateStr += '-' + (date.getDate() < 10 ? '0' : '') + date.getDate();

    return dateStr;
  }
}
