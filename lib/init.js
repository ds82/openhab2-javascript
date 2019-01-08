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

  /**
   * @param  {string} name
   * @param  {function} fn
   * @param  {Trigger} trigger
   * @param  {Object} opts
   */
  function addRule(name, fn, trigger, opts) {
    opts = opts || {};

    var rule = simpleRule(name, fn, name + '-' + uuid.randomUUID());
    rule.setName(name);

    rule.setTriggers(trigger);
    automationManager.addRule(rule);
  }

  /**
   * Every rule needs a trigger. The trigger decides when the rule is executed.
   * @name Trigger
   */

  /**
   * Creates a trigger of a cron-expression. Use this trigger to
   * run rules regulary in fixed time intervalls
   * @name timeTrigger
   * @param {string} cronExpression
   * @returns {Trigger}
   *
   */
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

  /**
   *
   * @param {string} itemName
   * @param {State} [newState]
   * @param {State} [oldState]
   */
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

  /**
   *
   * @param {string} channel
   * @param {string} event
   * @param {string} [triggerName]
   */
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

  /**
   * hasValue checks if the state of the given item has the given value
   * @param {string} itemName
   * @param {*} value
   * @returns {boolean}
   * @example
   * hasValue('someContactItem', OPEN) // -> returns TRUE if someContactItem's state is OPEN
   */
  function hasValue(itemName, value) {
    return getState(item) === typeValue;
  }

  function is(item, typeValue) {
    return has(item, typeValue);
  }

  /**
   * Checks if the given item is a group
   * @param {string} itemName
   */
  function isGroup(itemName) {
    return ir.getItem(itemName).type === 'Group';
  }

  /**
   * Returns TRUE if the given Switch Item is in the ON state
   * @param {string} itemName
   * @returns {boolean}
   */
  function isOn(itemName) {
    return is(itemName, ON);
  }

  /**
   * Returns TRUE if the given Switch Item is in the OFF state or has no state
   * @param {string} itemName
   * @returns {boolean}
   */
  function isOff(item) {
    return is(item, OFF) || is(item, undefined);
  }

  /**
   * Returns TRUE if the given Contact Item is in the OPEN state
   * @param {string} itemName
   * @returns {boolean}
   */
  function isOpen(itemName) {
    return is(item, OPEN);
  }

  /**
   * Returns TRUE if the given Contact Item is in the CLOSED state
   * @param {string} itemName
   * @returns {boolean}
   */
  function isClosed(itemName) {
    return is(item, CLOSED);
  }

  /**
   * Get the state of the item
   * @param {string} itemName
   * @returns {*} - State of the item
   */
  function getState(itemName) {
    return exists(itemName) ? getItem(itemName).state : null;
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
