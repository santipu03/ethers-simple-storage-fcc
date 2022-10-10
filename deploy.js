const ethers = require("ethers")
const fs = require("fs")
require("dotenv").config()

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    const abi = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.abi",
        "utf-8"
    )
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf-8"
    )
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying, please wait...")
    const contract = await contractFactory.deploy()
    await contract.deployTransaction.wait(1)

    console.log(`Contract address: ${contract.address}`)

    let favoriteNum = await contract.retrieve()
    console.log(`The favorite number is: ${favoriteNum}`)
    console.log("Updating favorite number...")
    let transactionResponse = await contract.store(8)
    let transactionReceipt = await transactionResponse.wait(1)
    favoriteNum = await contract.retrieve()
    console.log(`The new favorite number is: ${favoriteNum}`)
}

main()
    .then(() => process.exit(0))
    .catch((e) => {
        console.log(e)
        process.exit(1)
    })
