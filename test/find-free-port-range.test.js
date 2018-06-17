const socketPortHelper = require('../lib/socket-port-helpers');

describe('find-free-port-range', () => {
  it(`basic - search 20 free ports in range '7000-8000'`, (done) => {
    socketPortHelper.findFreePortRange(20, { portRange:'7000-8000', log: false, portMax: -50 })
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
    socketPortHelper.findFreePortRange(20, { testConnection: true, log: false, portMax: -50 })
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
    socketPortHelper.findFreePortRange(20, { testDataTransfer: true, log: false, portMax: -50 })
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


