import { ethers, network } from "hardhat"
import { moveBlocks } from "../utils/move-blocks"

const PRICE = ethers.utils.parseEther("0.1")

async function mintAndList() {
    const titleRegistry = await ethers.getContract("TitleRegistry")
    const basicNft = await ethers.getContract("BasicNft")
    console.log("Minting....")
    const mintTx = await basicNft.mintNft()
    const mintTxReceipt = await mintTx.wait(1)
    const tokenId = mintTxReceipt.events[0].args.tokenId
    console.log("Aprovando Titulo...")
    const approvalTx = await basicNft.approve(titleRegistry.address, tokenId)
    await approvalTx.wait(1)
    console.log("Listando Titulo...")
    const tx = await titleRegistry.listTitle(basicNft.address, tokenId, PRICE)
    await tx.wait(1)
    console.log("Listado!")

    if (network.config.chainId == 31337) {
        await moveBlocks(1, 1000)
    }
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
