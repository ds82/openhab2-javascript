'use strict';
var OPENHAB_CONF = Java.type('java.lang.System').getenv('OPENHAB_CONF');

load(OPENHAB_CONF + '/automation/jsr223/lib/helper.js');
load(OPENHAB_CONF + '/automation/jsr223/lib/moment.js');
load(OPENHAB_CONF + '/automation/jsr223/lib/ramda.js');

load(OPENHAB_CONF + '/automation/jsr223/lib/datetime.js');
load(OPENHAB_CONF + '/automation/jsr223/lib/rhino.js');

scriptExtension.importPreset('RuleSupport');
scriptExtension.importPreset('Rule');
scriptExtension.importPreset('RuleSimple');
scriptExtension.importPreset('RuleFactories');
scriptExtension.importPreset('default');
scriptExtension.importPreset('media');

(function(context) {
  context.timeTrigger = timeTrigger;
  context.changeStateTrigger = changeStateTrigger;
  context.channelTrigger = channelTrigger;
  context.addRule = addRule;
  context.is = is;
  context.isGroup = isGroup;
  context.isOn = isOn;
  context.isOff = isOff;
  context.isOpen = isOpen;
  context.isClosed = isClosed;
  context.getState = getState;
  context.exists = exists;
  context.getItem = getItem;
  context.on = on;
  context.off = off;
  context.momentFromItem = momentFromItem;

  //
  // Trigger
  //
  function timeTrigger(cronExpression) {
    return TriggerBuilder.create()
      .withId(uuid.randomUUID())
      .withTypeUID('timer.GenericCronTrigger')
      .withConfiguration(
        new Configuration({
          cronExpression: cronExpression
        })
      )
      .build();
  }

  function changeStateTrigger(itemName, newState, oldState) {
    return TriggerBuilder.create()
      .withId(uuid.randomUUID())
      .withTypeUID('core.ItemStateChangeTrigger')
      .withConfiguration(
        new Configuration({
          itemName: itemName,
          state: !!newState ? newState.toString() : newState,
          oldState: !!oldState ? oldState.toString() : oldState
        })
      )
      .build();
  }

  function channelTrigger(channel, event, triggerName) {
    return TriggerBuilder.create()
      .withId(triggerName || uuid.randomUUID())
      .withTypeUID('core.ChannelEventTrigger')
      .withConfiguration(
        new Configuration({
          channelUID: channel,
          event: event
        })
      )
      .build();
  }

  //
  // rule helper
  //
  function addRule(name, fn, trigger, opts) {
    opts = opts || {};

    var rule = simpleRule(name, fn, name + '-' + uuid.randomUUID());
    rule.setName(name);

    rule.setTriggers(trigger);
    automationManager.addRule(rule);
  }

  //
  // util functions
  //
  function is(item, typeValue) {
    // logger.info('is ' + item + ' ' + getState(item) + ' ' + typeValue)
    return getState(item) === typeValue;
  }

  function isGroup(item) {
    return ir.getItem(item).type === 'Group';
  }

  function isOn(item) {
    return is(item, ON);
  }

  function isOff(item) {
    return is(item, OFF) || is(item, undefined);
  }

  function isOpen(item) {
    return is(item, OPEN);
  }
  function isClosed(item) {
    return is(item, CLOSED);
  }

  function getState(item) {
    return exists(item) ? getItem(item).state : null;
  }

  function exists(item) {
    var items = ir.getItems(item);
    return !!items && items.length > 0;
  }

  function getItem(item) {
    return typeof item === 'string' ? ir.getItem(item) : item;
  }

  function on(item) {
    // logger.info('on ' + item + ' ' + isOff(item))
    if (isOff(item) || isGroup(item)) {
      sendCommand(item, ON);
      return true;
    }
    return false;
  }

  function off(item) {
    if (isOn(item) || isGroup(item)) {
      sendCommand(item, OFF);
      return true;
    }
    return false;
  }

  //
  // time/date helper
  //

  function momentFromItem(item) {
    return moment(getItem(item).state.toString());
  }
})(module.exports || this);
