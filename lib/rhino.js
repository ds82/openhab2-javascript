/*
  This file contains rhino specific syntax/code
*/

(function(context) {

  context.simpleRule = simpleRule;

  function simpleRule(name, execute, uid) {
    return new SimpleRule() {
      name: name,
      execute: execute,
      uid: uid
    };
  }

})(module.exports || this);