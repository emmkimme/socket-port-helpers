const socketPortHelper = require('../lib/socket-port-helpers');

describe('test-range-port', () => {
  function testPortRange(portRange) {
    it(`test ports from '${portRange}'`, (done) => {
      socketPortHelper.testPortRange(portRange, { log: false, testDataTransfer: true })
        .then((results) => {
          console.log(JSON.stringify(results, null, 4));
          done();
        });
    });
  }

  testPortRange('49152-49170');
});

