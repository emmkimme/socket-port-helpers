const socketPortHelper = require('../lib/socket-port-helpers');

describe('test-range-port', () => {
  function testPortRange(portRange) {
    it(`test ports from '${portRange}'`, (done) => {
      socketPortHelper.testPortRange(portRange, { log: true, testData: true })
        .then((results) => {
          console.log(JSON.stringify(results, null, 4));
          done();
        });
    });
  }

  testPortRange('7000-7100');
});

