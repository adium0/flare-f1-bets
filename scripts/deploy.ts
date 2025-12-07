// scripts/deploy.ts
import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  console.log("Deploying contracts to Coston2...\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);

  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", balance.toString());

  // Get constructor parameters from environment
  const oracleAddress = process.env.ORACLE_ADDRESS || deployer.address;
  const apiEndpoint =
    process.env.API_ENDPOINT || "https://api.jolpica.com/f1/results";

  console.log("\nConstructor parameters:");
  console.log("Oracle Address:", oracleAddress);
  console.log("API Endpoint:", apiEndpoint);

  // 1. Deploy FlareF1BetManager
  console.log("\n1. Deploying FlareF1BetManager...");
  const FlareF1BetManager = await ethers.getContractFactory("FlareF1BetManager");
  const betManager = await FlareF1BetManager.deploy(oracleAddress);
  await betManager.waitForDeployment();
  const betManagerAddress = await betManager.getAddress();
  console.log("✅ FlareF1BetManager deployed to:", betManagerAddress);

  // 2. Deploy F1DataConnector
  console.log("\n2. Deploying F1DataConnector...");
  const F1DataConnector = await ethers.getContractFactory("F1DataConnector");
  const dataConnector = await F1DataConnector.deploy(oracleAddress, apiEndpoint);
  await dataConnector.waitForDeployment();
  const dataConnectorAddress = await dataConnector.getAddress();
  console.log("✅ F1DataConnector deployed to:", dataConnectorAddress);

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Network: Coston2 (Chain ID: 114)");
  console.log("Deployer:", deployer.address);
  console.log("\nContract Addresses:");
  console.log("FlareF1BetManager:", betManagerAddress);
  console.log("F1DataConnector:", dataConnectorAddress);
  console.log("\nExplorer URLs:");
  console.log(
    "BetManager:",
    `https://coston2-explorer.flare.network/address/${betManagerAddress}`
  );
  console.log(
    "DataConnector:",
    `https://coston2-explorer.flare.network/address/${dataConnectorAddress}`
  );
  console.log("\n" + "=".repeat(60));

  // Save addresses to a file
  const addresses = {
    network: "coston2",
    chainId: 114,
    deployer: deployer.address,
    oracle: oracleAddress,
    contracts: {
      betManager: betManagerAddress,
      dataConnector: dataConnectorAddress,
    },
    deployedAt: new Date().toISOString(),
  };

  fs.writeFileSync("deployment-addresses.json", JSON.stringify(addresses, null, 2));
  console.log("\n✅ Addresses saved to deployment-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
