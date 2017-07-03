
module.exports = {

  // Gets a Date object with the current date in a given timezone.
  // The timezone offset is used as a parameter in the options argument.
  getDateNow: function (options, next) {
    var destoffset = options.offset;

    var dateNow = new Date();
    var localoffset = -(dateNow.getTimezoneOffset()/60);

    var offset = destoffset - localoffset;
    var destDateNow = new Date( new Date().getTime() + offset * 3600 * 1000);

    return destDateNow;
  }
}
