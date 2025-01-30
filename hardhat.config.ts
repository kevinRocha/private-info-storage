import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/B0oewvUgpiudBGU6SBNZQn2FmrkwqCH2", // URL de Alchemy o Infura
      accounts: ["e0332ba128f40c1b63c4da566e3dfabf9e94df903ab1fbbe7ec6213cae1bb396"], // Clave privada de tu billetera
    },
  },
};


export default config;
