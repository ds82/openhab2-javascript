# openHAB 2.x: JSR223 JavaScript  Code

This is a repository of very experimental JavaScript code that can be used with the SmartHome platform and openHAB 2.x.

## Applications

The JSR223 scripting extensions can be used for general scripting purposes, including defining rules like in openHAB 1.x. So openHAB 1.x JavaScript Code can be migrated from openHAB 1 JSR223 binding to openHAB 2 automation.

## Defining Rules

One the primary use cases for the JSR223 scripting is to define rules for the [Eclipse SmartHome (ESH) rule engine](http://www.eclipse.org/smarthome/documentation/features/rules.html).

### Defining Rules using a simplified API

```JavaScript
'use strict';

// init sets up everything you need to write rules
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
```