const { network, run } = require("hardhat")
require("dotenv").config()

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments
    const chainId = network.config.chainId
    if (chainId === 5 && process.env.GOERLI_PRICEFEED_URL) {
        const BankingTransaction = await deploy("BankingAmount", {
            from: deployer,
            log: true,
            args: [process.env.GOERLI_PRICEFEED_URL]
        }
        )
        await verify(BankingTransaction.address, [process.env.GOERLI_PRICEFEED_URL])
    }
    // if (chainId === 5) {
    //     await verify(BankingTransaction.address, [])
    // }
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

