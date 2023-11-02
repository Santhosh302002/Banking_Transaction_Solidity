const { frontEndContractsFile, frontEndAbiFile } = require("../helpher-hardhat-config")
const fs = require("fs")
const { network } = require("hardhat")
const { ethers } = require("hardhat")
const { json } = require("hardhat/internal/core/params/argumentTypes")


module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end written!")
    }
}

async function updateAbi() {
    const BankingAmount = await ethers.getContract("BankingAmount")
    // console.log(BankingAmount.interface.format(ethers.utils.FormatTypes.json))
    // const jsonAbi = JSON.stringify(BankingAmount.interface.format());
    fs.writeFileSync(frontEndAbiFile, BankingAmount.interface.format(ethers.utils.FormatTypes.json))
}

async function updateContractAddresses() {
    const BankingAmount = await ethers.getContract("BankingAmount")
    const contractAddresses = (BankingAmount.address)
    // console.log(contractAddresses)
    // if (network.config.chainId.toString() in contractAddresses) {
    //     if (!contractAddresses[network.config.chainId.toString()].includes(BankingAmount.address)) {
    //         contractAddresses[network.config.chainId.toString()].push(BankingAmount.address)
    //     }
    // } else {
    //     contractAddresses[network.config.chainId.toString()] = [BankingAmount.address]
    // }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}
module.exports.tags = ["all", "BankingAmount"]