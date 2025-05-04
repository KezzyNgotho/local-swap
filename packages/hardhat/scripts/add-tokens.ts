import { ethers } from "hardhat";
import contractAddresses from "../../react-app/contracts/addresses.json";
import { P2PEscrow } from "../typechain-types";

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

// ERC20 ABI for approval and balance
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function symbol() external view returns (string)"
];

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Check balance first
  const cUSD = new ethers.Contract(SUPPORTED_TOKENS.cUSD, ERC20_ABI, deployer);
  const balance = await cUSD.balanceOf(deployer.address);
  const symbol = await cUSD.symbol();
  console.log(`Balance: ${ethers.formatEther(balance)} ${symbol}`);

  if (balance < ethers.parseEther("1")) {
    console.error("Insufficient balance. Please get some test cUSD from the faucet first.");
    console.error("Visit: https://faucet.celo.org/alfajores");
    return;
  }

  // First approve tokens
  console.log("\nChecking approvals...");
  const approvalAmount = ethers.parseEther("100");
  
  try {
    const currentAllowance = await cUSD.allowance(deployer.address, contractAddresses.P2PEscrow);
    console.log("Current allowance:", ethers.formatEther(currentAllowance), "cUSD");

    if (currentAllowance < approvalAmount) {
      console.log("Approving P2P Escrow contract to spend cUSD...");
      const approveTx = await cUSD.approve(contractAddresses.P2PEscrow, approvalAmount);
      await approveTx.wait();
      console.log("Approval successful!");
    } else {
      console.log("Sufficient allowance already exists");
    }
  } catch (error: any) {
    console.error("Error approving tokens:", error.message);
    return;
  }

  // Get contract instance
  const P2PEscrowFactory = await ethers.getContractFactory("P2PEscrow");
  const p2pEscrow = P2PEscrowFactory.attach(contractAddresses.P2PEscrow) as P2PEscrow;

  // Create trade
  console.log("\nCreating new trade...");
  const tradeParams = {
    token: SUPPORTED_TOKENS.cUSD,
    amount: ethers.parseEther("1"), // 1 cUSD
    price: ethers.parseEther("1.5"), // 1.5 USD
    paymentMethod: "Bank Transfer",
    paymentDetails: "Bank: Example Bank\nAccount: 1234567890\nName: John Doe",
    isMinPay: false
  };

  try {
    const tx = await p2pEscrow.createTrade(
      tradeParams.token,
      tradeParams.amount,
      tradeParams.price,
      tradeParams.paymentMethod,
      tradeParams.paymentDetails,
      tradeParams.isMinPay
    );
    
    await tx.wait();
    console.log("Trade created successfully!");
    console.log("Transaction hash:", tx.hash);
  } catch (error: any) {
    console.error("Error creating trade:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 