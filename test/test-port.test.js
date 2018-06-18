const socketPortHelper = require('../lib/socket-port-helpers');

const portMin = 49152;
const portMax = 49170;

describe('test-port', () => {
  it(`test ports from  `, (done) => {
    let pendingResults = (portMax - portMin);
    let portResults = new Array(pendingResults);
    new Promise((resolve, reject) => {
      for (let port = portMin; port < portMax; ++port) {
        let index = port - portMin;
        socketPortHelper.testPort(port, { log: false, testDataTransfer: true })
        .then((portResult) => {
          let msg = `=> Test port ${portResult.port} : ${portResult.err ? portResult.err.message : 'available'}`;
          portResults[index] = msg;
          if (--pendingResults === 0) {
            resolve();
          }
        })
        .catch((err) => {
          let msg = `=> Test port ${port} : failed ${err}`;
          portResults[index] = msg;
          if (--pendingResults === 0) {
            resolve();
          }
        });
      }
    })
    .then(() => {
      for (let port = portMin; port < portMax; ++port) {
        let index = port - portMin;
        console.log(portResults[index]);
      }
      done();
    });
  });
});

