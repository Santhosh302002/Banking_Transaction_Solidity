// const { getContractAddress } = require("ethers/lib/utils")
const { network, run } = require("hardhat")
require("dotenv").config()

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments
    const chainId = network.config.chainId

    let priceFeedAddress, interval;
    if (chainId === 31337) {
        const hardhat = await deployments.get("MockV3Aggregator");
        priceFeedAddress = hardhat.address;
    }
    else {
        priceFeedAddress = process.env.GOERLI_PRICEFEED_URL
    }
    interval = 10;
    const BankingTransaction = await deploy("BankingAmount", {
        from: deployer,
        log: true,
        args: [priceFeedAddress, interval]
    }
    )
    if (chainId === 5 && process.env.GOERLI_PRICEFEED_URL) {
        await verify(BankingTransaction.address, [process.env.GOERLI_PRICEFEED_URL, interval])
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