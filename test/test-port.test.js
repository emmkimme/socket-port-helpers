const socketPortHelper = require('../lib/socket-port-helpers');

const portMin = 49152;
const portMax = portMin + 10;

describe('test-port', () => {
  it(`test ports from  `, (done) => {
    let pendingResults = (portMax - portMin);
    let portResults = new Array(pendingResults);
    new Promise((resolve, reject) => {
      for (let port = portMin; port < portMax; ++port) {
        let index = port - portMin;
        socketPortHelper.testPort(port, { log: true, testData: true })
        .then(() => {
          let msg = `=> Test port ${port} : Success`;
          portResults[index] = msg;
          if (--pendingResults === 0) {
            resolve();
          }
        })
        .catch((err) => {
          let msg = `=> Test port ${port} : ${err}`;
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

