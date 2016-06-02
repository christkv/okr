class Store {
  constructor(url) {
  }

  connect() {
    return new Promise(function(resolve, reject) {
      reject(new Error('failed 2'));
    });
  }
}

module.exports = Store;
