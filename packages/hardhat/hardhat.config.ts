import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: ["0d9c8a76fc8f20a0f00e17ac7c9d9ed7c8b41a8f33a7fc1cead548173753aa13"],
      chainId: 44787
    }
  }
};

export default config;
