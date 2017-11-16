'use strict';

load('./../conf/automation/jsr223/jslib/helper.js');
load('./../conf/automation/jsr223/jslib/moment.js');
load('./../conf/automation/jsr223/jslib/ramda.js');

load('./../conf/automation/jsr223/jslib/datetime.js');

scriptExtension.importPreset('RuleSupport');
scriptExtension.importPreset('Rule');
scriptExtension.importPreset('RuleSimple');
scriptExtension.importPreset('RuleFactories');
scriptExtension.importPreset('default');
scriptExtension.importPreset('media');

//
// Trigger
//
function timeTrigger(cronExpression) {
    return new Trigger(
      uuid.randomUUID(),
      'timer.GenericCronTrigger',
      new Configuration({
        cronExpression: cronExpression
      })
    );
}

function changeStateTrigger(itemName, newState, oldState) {
  return new Trigger(
    uuid.randomUUID(),
    'core.ItemStateChangeTrigger',
    new Configuration({
      itemName: itemName,
      state: !!newState ? newState.toString() : newState,
      oldState: !!oldState ? oldState.toString() : oldState
    })
  );
}

function channelTrigger(channel, event, triggerName) {
  return new Trigger(triggerName || uuid.randomUUID(), "core.ChannelEventTrigger", new Configuration({
    channelUID: channel,
    event: event
  }));
}


//
// rule helper
//
function addRule(name, fn, trigger, opts) {
  opts = opts || {};

  var rule = new SimpleRule() {
    name: name,
    execute: fn,
		uid: name + '-' + uuid.randomUUID(),
  };
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
  return typeof item === 'string' ?
    ir.getItem(item) : item;
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
