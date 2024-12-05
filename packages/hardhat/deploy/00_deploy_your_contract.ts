import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("YourContract", {
    from: deployer,
    args: [deployer],
    log: true,
    autoMine: true,
  });

  const yourContract = await hre.ethers.getContract<Contract>("YourContract", deployer);
  console.log("Contract deployed at:", await yourContract.getAddress());
};

export default deployYourContract;
deployYourContract.tags = ["YourContract"];