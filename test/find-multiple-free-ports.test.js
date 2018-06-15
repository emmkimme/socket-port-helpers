const socketPortHelper = require('../lib/socket-port-helpers');

describe('find-mutiple-free-ports', () => {
  it(`basic`, (done) => {
    socketPortHelper.findMultipleFreePorts(20, { log: false, portMax: -50 })
      .then((ports) => {
        for (let i = 0, l = ports.length ; i < l; ++i) {
          console.log(`${i} - find port ${ports[i]}`);
        }
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it(`advanced - test connection`, (done) => {
    socketPortHelper.findMultipleFreePorts(20, { testConnection: true, log: false, portMax: -50 })
      .then((ports) => {
        for (let i = 0, l = ports.length; i < l; ++i) {
          console.log(`${i} - find port ${ports[i]}`);
        }
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it(`advanced - test data`, (done) => {
    socketPortHelper.findMultipleFreePorts(20, { testData: true, log: false, portMax: -50 })
      .then((ports) => {
        for (let i = 0, l = ports.length; i < l; ++i) {
          console.log(`${i} - find port ${ports[i]}`);
        }
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});


