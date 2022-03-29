// const ethers = require("hardhat").ethers;
// deploy to : 0x8D5CCED0BBc8e420846d130523E1Caa586Fbdd86
// Transaction Hash: 
//          0x7ca5ca9b4f0ec0c2ff4dd6945c6593a9e61ebf7768e8bf0ab3fccc9dffc12d13
//          0x0144a8b8e21fbe2ff3e1617b0d40d99fc3993946bdc8a8346aabaef8a6284c06

// root CID: bafybeihslhol5draa26unhhe7j2crwedr4tyfrvmba5qt3kyxbvb5olk4i
// output: images.car
// root CID: bafybeia7sa733jo36r2e25yqiql467qb7i4lnt5rmqva43fbpaid3nw7zi
// output: metadata.car
const { task } = require("hardhat/config");
const { getAccount } = require("./helpers");


task("check-balance", "Prints out the balance of your account").setAction(async function (taskArguments, hre) {
    const account = getAccount();
    console.log(`Account balance for ${account.address}: ${await account.getBalance()}`);
});

task("deploy", "Deploys the NFT.sol contract").setAction(async function (taskArguments, hre) {
    const nftContractFactory = await hre.ethers.getContractFactory("NFT", getAccount());
    const nft = await nftContractFactory.deploy();
    console.log(`Contract deployed to address: ${nft.address}`);
});