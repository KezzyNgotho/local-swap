import { ethers, artifacts } from "hardhat";
import { writeFileSync } from "fs";
import { join } from "path";
import { getAddress } from "ethers";

const SUPPORTED_TOKENS = {
  // Celo Stablecoins
  cUSD: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
  cEUR: "0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F",
  cREAL: "0xE4D517785D091D3c54818832dB6094bcc2744545",
  cNGN: "0x62C22B0497afD65e64A3e4791d0C1259d1C4f9B7",
  // Global Stablecoins
  USDT: "0x4cA2A3EE452CE28E64aE945E371A9f52105D82C5",
  USDC: "0x2F25deB3848C207fc8E0c8527cD1CDF4106EF15A",
  DAI: "0x7d91E51C8F218f7140188A155f5C75388630B6a8",
  BUSD: "0x4B21b980d0Dc7D3C0C6175B3A192acF80dBB32A1",
  // Wrapped Tokens
  WBTC: "0xF19A2a979B7cC001E8BE2A9d57D8cC7e7C5Ea2f9",
  WETH: "0x2D69B9830c2ABc29C1EBa9D47eB213DbBF50a9ed"
};

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy P2PEscrow
  const P2PEscrow = await ethers.getContractFactory("P2PEscrow");
  const p2pEscrow = await P2PEscrow.deploy();
  
  await p2pEscrow.waitForDeployment()

  const p2pEscrowAddress = await p2pEscrow.getAddress();
  console.log("P2PEscrow deployed to:", p2pEscrowAddress);

  // Add all supported tokens
  console.log("\nAdding supported tokens...");
  for (const [symbol, address] of Object.entries(SUPPORTED_TOKENS)) {
    try {
      const checksumAddress = getAddress(address);
      await p2pEscrow.addSupportedToken(checksumAddress);
      console.log(`Added ${symbol} token support: ${checksumAddress}`);
    } catch (error) {
      console.error(`Error adding ${symbol} token:`, error);
    }
  }

  // Add payment methods
  console.log("\nAdding payment methods...");
  const paymentMethods = [
    "MinPay",
    "Bank Transfer",
    "Mobile Money",
    "Crypto Wallet",
    "PayPal",
    "Wise Transfer",
    "Revolut",
    "Cash"
  ];

  for (const method of paymentMethods) {
    try {
      await p2pEscrow.addPaymentMethod(method);
      console.log(`Added payment method: ${method}`);
    } catch (error) {
      console.error(`Error adding payment method ${method}:`, error);
    }
  }

  // Save the contract addresses
  const addresses = {
    P2PEscrow: p2pEscrowAddress,
  };

  // Save addresses to the frontend
  const addressesPath = join(__dirname, "../../react-app/contracts/addresses.json");
  writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
  console.log("\nContract addresses saved to:", addressesPath);

  // Copy ABI to frontend
  const artifact = artifacts.readArtifactSync("P2PEscrow");
  const abiPath = join(__dirname, "../../react-app/contracts/P2PEscrow.json");
  writeFileSync(abiPath, JSON.stringify(artifact.abi, null, 2));
  console.log("Contract ABI saved to:", abiPath);

  console.log("\nDeployment complete! Please verify the contract on Celoscan.");
  console.log("Verification command:");
  console.log(`npx hardhat verify --network alfajores ${p2pEscrowAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 