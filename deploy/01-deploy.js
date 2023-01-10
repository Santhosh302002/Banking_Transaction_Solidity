const { network, run } = require("hardhat")

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments
    const chainId = network.config.chainId
    const BankingTransaction = await deploy("BankingAmount", {
        from: deployer,
        log: true,
        args: []
    }
    )
    if (chainId === 5) {
        await verify(BankingTransaction.address, [])
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

