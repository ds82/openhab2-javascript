'use strict';
var OPENHAB_CONF = Java.type('java.lang.System').getenv('OPENHAB_CONF');

function require(relativePath) {
  load(OPENHAB_CONF + '/automation/jsr223/' + relativePath);
}
