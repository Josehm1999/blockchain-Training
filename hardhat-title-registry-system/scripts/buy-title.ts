import { ethers, network } from "hardhat"
import { moveBlocks } from "../utils/move-blocks"

const TOKEN_ID = 1

async function buyTitle() {
    const titleRegistry = await ethers.getContract("TitleRegistry")
    const basicTitle = await ethers.getContract("BasicNft")
    const listing = await titleRegistry.getListing(basicTitle.address, TOKEN_ID)
    const price = listing.price.toString()
    const tx = await titleRegistry.buyTitle(basicTitle.address, TOKEN_ID, {
        value: price,
    })
    await tx.wait(1)
    console.log("Transaccion completada")

    if ((network.config.chainId = 1337)) {
        await moveBlocks(2, 1000)
    }
}

buyTitle()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
