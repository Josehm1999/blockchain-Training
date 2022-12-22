import { ethers, network } from 'hardhat';
import { moveBlocks } from '../utils/move-blocks';

async function mint() {
	const basicNft = await ethers.getContract('BasicNft');
	console.log('Minting....');
	const mintTx = await basicNft.mintNft();
	const mintTxReceipt = await mintTx.wait(1);
	const tokenId = mintTxReceipt.events[0].args.tokenId;
	console.log(`Se tiene TokenID: ${tokenId}`);
	console.log(`Title Address: ${basicNft.address}`);

	if (network.config.chainId == 1337) {
		await moveBlocks(1, 1000);
	}
}

mint()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
