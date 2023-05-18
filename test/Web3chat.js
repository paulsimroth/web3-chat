const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Web3chat", function () {

  let web3chat;

  beforeEach(async () => {
    //Deploy Contract
    const Web3chat = await ethers.getContractFactory("Web3chat")
    web3chat = await Web3chat.deploy("Web3chat", "W3C")
  })

  describe("Deployment", function () {

    it("Sets name", async () => {
      // Fetch and Check name
      let result = await web3chat.name()
      expect(result).to.equal("Web3chat")
    })

    it("Sets symbol", async () => {
      // Fetch and Check symbol
      let result = await web3chat.symbol()
      expect(result).to.equal("W3C")
    })
  })
})
