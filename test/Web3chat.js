const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Web3chat", function () {

  let deployer, user;
  let web3chat;
  const NAME = "Web3chat";
  const SYMBOL = "W3C";

  beforeEach(async () => {
    //Deployer address
    [deployer, user] = await ethers.getSigners();

    //Deploy Contract
    const Web3chat = await ethers.getContractFactory("Web3chat");
    web3chat = await Web3chat.deploy(NAME, SYMBOL);

    //Create Channel
    const tx = await web3chat.connect(deployer).createChannel("general", tokens(1));
    await tx.wait();
  });

  describe("Deployment", function () {

    it("Sets name", async () => {
      // Fetch and Check name
      let result = await web3chat.name()
      expect(result).to.equal(NAME)
    })

    it("Sets symbol", async () => {
      // Fetch and Check symbol
      let result = await web3chat.symbol()
      expect(result).to.equal(SYMBOL)
    })

    it("Sets owner", async () => {
      let result = await web3chat.owner()
      expect(result).to.equal(deployer.address)
    })

  });

  describe("Creating Channels", function () {
    it("Returns all channels", async () => {
      let result = await web3chat.totalChannels();
      expect(result).to.be.equal(1);
    });

    it("Returns channel attributes", async () => {
      const channel = await web3chat.getChannel(1);
      expect(channel.id).to.be.equal(1);
      expect(channel.name).to.be.equal("general");
      expect(channel.cost).to.be.equal(tokens(1));
    });

  });

  describe("Joining Channels", () => {
    const ID = 1;
    const AMOUNT = ethers.utils.parseUnits("1", 'ether')

    beforeEach(async () => {
      const tx = await web3chat.connect(user).mint(ID, { value: AMOUNT });
      await tx.wait();
    });

    it("Joins the user", async () => {
      let result = await web3chat.hasJoined(ID, user.address);
      expect(result).to.be.equal(true);
    });

    it("Increases total supply", async () => {
      let result = await web3chat.totalSupply();
      expect(result).to.be.equal(ID);
    });

    it("Updates contract balance", async () => {
      let result = await ethers.provider.getBalance(web3chat.address);
      expect(result).to.be.equal(AMOUNT);
    });

  });

  describe("Withdrawing", () => {
    const ID = 1;
    const AMOUNT = ethers.utils.parseUnits("10", 'ether');
    let balanceBefore;

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address);

      let tx = await web3chat.connect(user).mint(ID, {value: AMOUNT});
      await tx.wait();

      tx = await web3chat.connect(deployer).withdraw();
      await tx.wait();
    });

    it("Updates owner balance", async () => {
      let balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    });

    it("Updates contract balance", async () => {
      let result = await ethers.provider.getBalance(web3chat.address);
      expect(result).to.be.equal(0);
    });

  });

});