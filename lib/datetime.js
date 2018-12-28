var OPENHAB_CONF = Java.type('java.lang.System').getenv('OPENHAB_CONF');
load(OPENHAB_CONF + '/automation/jsr223/lib/moment.js');

moment.locale('de');

function momentFromItem(item) {
  return moment(ir.getItem(item).state, moment.ISO_8601);
}

function isSameDay(day1, day2) {
  day2 = day2 || moment();
  return moment(day1).isSame(day2, 'day');
}

function isWorkDay(day) {
  day = day || DateTime.now();
  var weekday = moment(day).weekday();
  return weekday > 0 && weekday <= 5;
}

function isBeforeSunrise(when) {
  when = !!when ? moment(when) : moment();
  return when.isBefore(momentFromItem('Astro_SunriseTime'));
}

function isBeforeSunset(when) {
  when = !!when ? moment(when) : moment();
  return when.isBefore(momentFromItem('Astro_SunsetTime'));
}

function isAfterSunrise(when) {
  when = !!when ? moment(when) : moment();
  return when.isAfter(momentFromItem('Astro_SunriseTime'));
}

function isAfterSunset(when) {
  when = !!when ? moment(when) : moment();
  return when.isAfter(momentFromItem('Astro_SunsetTime'));
}

function isBefore(pointInTime, anytimeBefore) {
  pointInTime = moment.isMoment(pointInTime)
    ? pointInTime
    : moment(pointInTime);
  anytimeBefore = !!anytimeBefore ? moment(anytimeBefore) : moment();
  return anytimeBefore.isBefore(pointInTime);
}

function isOlderThanSeconds(d1, d2, secs) {
  var m1 = moment(d1);
  var m2 = moment(d2);
  return m1.diff(m2, 'seconds') > secs;
}

function isBetweenHourOfDay(hour1, hour2) {
  var hourNow = moment().get('hour');
  return hour1 <= hourNow && hourNow <= hour2;
}

function isTomorrow(dateTimeItem) {
  var d = momentFromItem(dateTimeItem);
  var tomorrow = moment(DateTime.now()).add(1, 'days');

  return d.isSame(tomorrow, 'days');
}

function diffSeconds(d1, d2) {
  return Math.abs(moment(d1).diff(d2, 'seconds'));
}
