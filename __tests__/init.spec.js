global.OPEN = 'OPEN';

const mockJavaLangSystem = {
  getenv: jest.fn()
};

const testItemDB = {
  testContact: {
    name: 'testContact',
    type: 'Contact',
    state: global.OPEN
  }
};

const itemRegistryMock = {
  getItem: jest.fn().mockImplementation(item => testItemDB[item]),
  getItems: jest.fn().mockImplementation(() => Object.values(testItemDB))
};

global.Java = {
  type: jest.fn().mockImplementation(() => mockJavaLangSystem)
};

global.load = jest.fn();
global.scriptExtension = {
  importPreset: jest.fn()
};

global.ir = itemRegistryMock;

const helper = require('../lib/init');

describe('init', () => {
  describe('is', () => {
    //console.log('helper', helper.is);

    expect(helper.is('testContact', global.OPEN)).toBe(true);
  });
});
