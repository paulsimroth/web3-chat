const hre = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  //Setting accounts and constructor variables
  const [deployer] = await ethers.getSigners();
  const NAME = "Web3chat";
  const SYMBOL = "W3C";

  //Deploying contract
  const Web3chat = await ethers.getContractFactory("Web3chat");
  const web3chat = await Web3chat.deploy(NAME, SYMBOL);
  await web3chat.deployed();

  console.log(`Contract deployed! ADDRESS: ${web3chat.address}\n`);

  //Create 3 Channels
  const CHANNEL_NAMES = ["general", "announcements", "intro"];
  const COSTS = [tokens(0), tokens(1), tokens(0.25)];

  for (let i = 0; i < 3; i++) {
    const tx = await web3chat.connect(deployer).createChannel(CHANNEL_NAMES[i], COSTS[i]);
    await tx.wait();

    console.log(`Created Channel #${CHANNEL_NAMES[i]}\n`);
  };
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});