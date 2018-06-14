const socketPortHelper = require('../lib/socket-port-helpers');

describe('find-free-port', function () {
  it(`basic`, (done) => {
    socketPortHelper.findFreePort({ log: true, portMax: -50 })
      .then((port) => {
        console.log(`find port ${port}`);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it(`advanced - test connection`, (done) => {
    socketPortHelper.findFreePort({ testConnection: true, log: true, portMax: -50 })
      .then((port) => {
        console.log(`find port ${port}`);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it(`advanced - test data`, (done) => {
    socketPortHelper.findFreePort({ testData: true, log: true, portMax: -50 })
      .then((port) => {
        console.log(`find port ${port}`);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});


