const DEST_TIMEZONE = -300;

module.exports = {

  // Gets a Date object with the current date in a given timezone.
  // The timezone offset is used as a parameter in the options argument.
  getDate: function (options, next) {
    var offset = 0;
    var destDate = null;

    if (options.offset) {
      offset = options.offset;
    }

    if (options.timestamp) {
      destDate = new Date(options.timestamp + (offset * 60 * 1000));
    }
    else {
      destDate = new Date(Date.now() + (DEST_TIMEZONE * 60 * 1000));
    }

    return destDate;
  },

  // Creates a string formated as YYYY-MM-DD hh:mm:ss with a date object argument.
  createFullDateFormat: function (options, next) {
    var date = options.dateObject;
    var dateStr = date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate();
    var timeStr = date.getUTCHours() + ':' + date.getUTCMinutes() + ':' + date.getUTCSeconds();

    return dateStr + ' ' + timeStr;
  },

  // Creates a string formated as YYYY-MMM-DD with a date object argument.
  createDateFormat: function (options, next) {
    var date = options.dateObject;
    var dateStr = date.getFullYear();
    dateStr += '-' + (date.getUTCMonth() + 1 < 10 ? '0' : '') + (date.getUTCMonth() + 1);
    dateStr += '-' + (date.getUTCDate() < 10 ? '0' : '') + date.getUTCDate();

    return dateStr;
  }
}
