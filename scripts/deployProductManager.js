/**
 * @title deployProductManager
 * @author Jaume Campeny <jaume@campeny.net>
 * @notice deployProductManager is a script that enables the deployment of ProductManager smart contract.
 */

const path = require("path");

async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const ProductManager = await ethers.getContractFactory("ProductManager");
  const productManager = await ProductManager.deploy();
  await productManager.deployed();

  console.log("ProductManager address:", productManager.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(productManager);
}

function saveFrontendFiles(productManager) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address_productManager.json"),
    JSON.stringify({ ProductManager: productManager.address }, undefined, 2)
  );

  const ProductManagerArtifact = artifacts.readArtifactSync("ProductManager");

  fs.writeFileSync(
    path.join(contractsDir, "ProductManager.json"),
    JSON.stringify(ProductManagerArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
