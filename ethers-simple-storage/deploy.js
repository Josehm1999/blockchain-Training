const ethers = require('ethers')
const fs = require('fs-extra')

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    'HTTP://172.19.32.1:7545'
  )
  const wallet = new ethers.Wallet(
    '48ee1ab46cda0f2a50a7807a2db51891fd47eb1d270ce52c2e00dd17b0cf9aba',
    provider
  )

  const abi = fs.readFileSync('./SimpleStorage_sol_SimpleStorage.abi', 'utf8')
  const binary = fs.readFileSync(
    './SimpleStorage_sol_SimpleStorage.bin',
    'utf8'
  )

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
  console.log('Deployig, please wait')
  const contract = await contractFactory.deploy()
  console.log(contract)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
