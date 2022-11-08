import { ethers, network } from "hardhat"
import { moveBlocks } from "../utils/move-blocks"

const TOKEN_ID = 0

async function cancelListing() {
    const titleRegistry = await ethers.getContract("TitleRegistry")
    const basicTitle = await ethers.getContract("BasicNft")
    const tx = await titleRegistry.cancelListing(basicTitle.address, TOKEN_ID)
    await tx.wait(1)
    console.log("Listado del titulo cancelado")
    if ((network.config.chainId = 31337)) {
        await moveBlocks(2, 1000)
    }
}

cancelListing()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
