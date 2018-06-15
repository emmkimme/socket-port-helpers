const socketPortHelper = require('../lib/socket-port-helpers');

describe('find-mutiple-free-ports', function () {
  it(`basic`, (done) => {
    socketPortHelper.findMultipleFreePorts(20, { log: true, portMax: -50 })
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

  it(`advanced - test connection`, (done) => {
    socketPortHelper.findFreePort({ testConnection: true, log: true, portMax: -50 })
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
    socketPortHelper.findFreePort({ testData: true, log: true, portMax: -50 })
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


