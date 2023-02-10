const { network, run } = require("hardhat")

const DECIMALS = "8"
const INITIAL_PRICE = "200000000000" // 2000
module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments
    const chainId = network.config.chainId
    if (chainId === 31337) {
        const BankingTransaction = await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE]
        }
        )
        // await verify(BankingTransaction.address, [process.env.GOERLI_PRICEFEED_URL])
    }
}
module.exports.tags = ['all', 'mocks'];