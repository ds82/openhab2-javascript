'use strict';

load('./../conf/automation/jsr223/jslib/init.js');

addRule(
  'test-rule-01',
  function(module, input) {
    logger.info(['~~~@>', 'test-rule', module, input.event].join('; '));
  },
  [changeStateTrigger('TestSwitch', ON)]
);

addRule(
  'astro-test-rule-rise',
  function(module, input) {
    logger.info(
      ['astro-test-rule', 'astro event triggered', module, input.event].join(
        '; '
      )
    );
  },
  [
    channelTrigger('astro:sun:home:rise#event', 'START'),
    channelTrigger('astro:sun:home:rise#start', 'START'),
    channelTrigger('astro:sun:home:rise#end', 'START'),
    channelTrigger('astro:sun:home:rise#event', 'START'),
    channelTrigger('astro:sun:home:set#event', 'START'),
    channelTrigger('astro:sun:home:set#start', 'START')
  ]
);

addRule(
  'test-rule-02',
  function(module, input) {
    logger.info(['is before sunrise?', isBeforeSunrise()].join(' '));
    logger.info(['is before sunset?', isBeforeSunset()].join(' '));
    logger.info(['is after sunrise?', isAfterSunrise()].join(' '));
    logger.info(['is after sunset?', isAfterSunset()].join(' '));
  },
  [timeTrigger('0/10 * * * * ?')]
);
