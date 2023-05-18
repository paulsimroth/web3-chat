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
    [deployer, user] = await ethers.getSigners()

    //Deploy Contract
    const Web3chat = await ethers.getContractFactory("Web3chat")
    web3chat = await Web3chat.deploy(NAME, SYMBOL)
  })

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
  })
})
