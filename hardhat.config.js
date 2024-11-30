require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: { }, // Rede interna padrão do Hardhat
    localhost: {
      url: "http://127.0.0.1:8545", // Rede local para conexão com MetaMask
    },
  },
};