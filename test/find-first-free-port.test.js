const socketPortHelper = require('../lib/socket-port-helpers');

describe('find-fist-free-port', () => {
  it(`basic - search free por in range '7000-8000'`, (done) => {
    socketPortHelper.findFirstFreePort({ portRange: '7000-8000', log: false })
      .then((port) => {
        console.log(`first free port ${port}`);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it(`advanced - test connection`, (done) => {
    socketPortHelper.findFirstFreePort({ testConnection: true, log: false })
      .then((port) => {
        console.log(`first free port ${port}`);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it(`advanced - test data`, (done) => {
    socketPortHelper.findFirstFreePort({ testDataTransfer: true, log: false })
      .then((port) => {
        console.log(`first free port ${port}`);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});


