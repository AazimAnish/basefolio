import { expect } from "chai";
import { ethers } from "hardhat";
import { YourContract } from "../typechain-types";

describe("YourContract", function () {
  let yourContract: YourContract;
  let owner: any;
  let addr1: any;

  before(async () => {
    [owner, addr1] = await ethers.getSigners();
    const contractFactory = await ethers.getContractFactory("YourContract");
    yourContract = (await contractFactory.deploy(owner.address)) as YourContract;
    await yourContract.waitForDeployment();
  });

  describe("Portfolio Minting", function () {
    it("Should mint a new portfolio NFT", async function () {
      const tx = await yourContract.mintPortfolio(
        addr1.address,
        "John Doe",
        "john@example.com",
        "johndoe",
        "johnd_coder",
        "linkedin.com/in/johndoe"
      );
      
      await tx.wait();

      const portfolio = await yourContract.getPortfolio(1);
      expect(portfolio.name).to.equal("John Doe");
      expect(portfolio.email).to.equal("john@example.com");
    });

    it("Should prevent non-owner from minting", async function () {
      await expect(
        yourContract.connect(addr1).mintPortfolio(
          addr1.address,
          "John Doe",
          "john@example.com",
          "johndoe",
          "johnd_coder",
          "linkedin.com/in/johndoe"
        )
      ).to.be.revertedWith("Not the Owner");
    });
  });
});