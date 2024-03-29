// const { getContractAddress } = require("ethers/lib/utils")
const { network, run } = require("hardhat")
require("dotenv").config()

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments
    const chainId = network.config.chainId
    // console.log(chainId);

    let priceFeedAddress, interval;
    if (chainId === 31337) {
        const hardhat = await deployments.get("MockV3Aggregator");
        priceFeedAddress = hardhat.address;
    }
    else {
        // if (chainId === 11155111) {
        priceFeedAddress = process.env.SEPOLIA_PRICEFEED_URL
        // }
        // if (chainId === 5) {
        //     priceFeedAddress = process.env.GOERLI_PRICEFEED_URL
        // }
    }
    interval = 600;
    const BankingTransaction = await deploy("BankingAmount", {
        from: deployer,
        log: true,
        args: [interval]
    }
    )
    if (chainId === 5 && process.env.GOERLI_PRICEFEED_URL) {
        await verify(BankingTransaction.address, [process.env.GOERLI_PRICEFEED_URL, interval])
    }
    if (chainId === 11155111 && process.env.SEPOLIR_PRICEFEED_URL) {
        await verify(BankingTransaction.address, [process.env.SEPOLIA_PRICEFEED_URL, interval])
    }
}

const verify = async (contractAddress, args) => {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!")
        } else {
            console.log(e)
        }
    }
}

module.exports.tags = ['all', 'BankingAmount'];