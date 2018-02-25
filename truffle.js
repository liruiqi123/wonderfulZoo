module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  //host: "127.0.0.1",
  //    port: 7545,


  networks: {
    development: {
      host: "192.169.243.240",
      port: 8545,
      network_id: "*" // Match any network id
    }
  }
};
