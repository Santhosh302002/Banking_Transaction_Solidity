const { assert } = require("chai")
const { network, ethers, getNamedAccounts, deployments } = require("hardhat")


if (network.config.chainId === 31337) {
    describe("FundMe Staging Tests", function () {
        let deployer
        let fundMe
        const sendValue = ethers.utils.parseEther("0.1")
        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer
            await deployments.fixture(["all"])
            fundMe = await ethers.getContract("BankingAmount", deployer)
        })

        it("allows people to fund and withdraw", async function () {
            const fundTxResponse = await fundMe.payment({ value: sendValue })
            await fundTxResponse.wait(1)
            const withdrawTxResponse = await fundMe.ViewAmount(deployer)
            // await withdrawTxResponse.wait(1)

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            console.log(sendValue)
            console.log(
                endingFundMeBalance.toString() +
                " should equal 0, running assert equal..."
            )
            assert.equal(withdrawTxResponse.toString(), "1138.49300000000002")
        })
    })

}