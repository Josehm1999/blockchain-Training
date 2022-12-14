import { network, deployments, ethers } from "hardhat"
import { assert, expect } from "chai"
import { Signer } from "ethers"
import { developmentChains } from "../../helper-hardhat-config"
import { TitleRegistry, BasicNft } from "../../typechain-types"

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Title Registry Unit Tests", function () {
          let titleregistry: TitleRegistry,
              titleregistryContract: TitleRegistry,
              basicNft: BasicNft
          const PRICE = ethers.utils.parseEther("0.6")
          const TOKEN_ID = 0
          let deployer: Signer
          let user: Signer

          beforeEach(async () => {
              const accounts = await ethers.getSigners() // tambien se podria hacer con getNamedAccounts
              deployer = accounts[0]
              user = accounts[1]
              await deployments.fixture(["all"])
              titleregistryContract = await ethers.getContract("TitleRegistry")
              titleregistry = titleregistryContract.connect(deployer)
              basicNft = await ethers.getContract("BasicNft", deployer)
              await basicNft.mintNft()
              await basicNft.approve(titleregistryContract.address, TOKEN_ID)
          })

          describe("listTitle", function () {
              it("No se puede listar un titulo de propiedad con precio 0", async function () {
                  await expect(
                      titleregistry.listTitle(basicNft.address, TOKEN_ID, 0.0)
                  ).to.be.revertedWithCustomError(
                      titleregistry,
                      "PriceMustBeAboveZero"
                  )
              })
              it("Emite un evento despues de listar un titulo", async function () {
                  expect(
                      await titleregistry.listTitle(
                          basicNft.address,
                          TOKEN_ID,
                          PRICE
                      )
                  ).to.emit(titleregistry, "TitleListed")
              })

              it("Exclusivamente titulos que no han sido listados", async function () {
                  await titleregistry.listTitle(
                      basicNft.address,
                      TOKEN_ID,
                      PRICE
                  )
                  // const error = `AlreadyListed("${basicNft.address}", ${TOKEN_ID})`
                  await expect(
                      titleregistry.listTitle(basicNft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWithCustomError(
                      titleregistry,
                      "AlreadyListed"
                  )
              })

              it("Exclusivamente permite a due??os listar titulos", async function () {
                  titleregistry = titleregistryContract.connect(user)
                  await expect(
                      titleregistry.listTitle(basicNft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWithCustomError(titleregistry, "NotOwner")
              })

              it("Necesita aprobaci??n para listar titulo", async function () {
                  await basicNft.approve(ethers.constants.AddressZero, TOKEN_ID)
                  await expect(
                      titleregistry.listTitle(basicNft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWithCustomError(
                      titleregistry,
                      "NotApprovedForSystem"
                  )
              })

              it("Actualiza los listados de los titulos con el vendedor y el precio", async function () {
                  await titleregistry.listTitle(
                      basicNft.address,
                      TOKEN_ID,
                      PRICE
                  )
                  const listing = await titleregistry.getListing(
                      basicNft.address,
                      TOKEN_ID
                  )
                  assert(listing.price.toString() == PRICE.toString())
                  assert(
                      listing.seller.toString() == (await deployer.getAddress())
                  )
              })
          })
          describe("cancelListing", function () {
              it("Si no hay listado revierte la operaci??n (revert)", async function () {
                  // const error = `El titulo no esta listado ("${basicNft.address}", ${TOKEN_ID})`;
                  await expect(
                      titleregistry.cancelListing(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWithCustomError(titleregistry, "NotListed")
              })

              it("Si otro usuario que no es el due??o trata de listar un titulo revierte la operaci??n (revert)", async function () {
                  await titleregistry.listTitle(
                      basicNft.address,
                      TOKEN_ID,
                      PRICE
                  )
                  titleregistry = titleregistryContract.connect(user)
                  await basicNft.approve(await user.getAddress(), TOKEN_ID)
                  await expect(
                      titleregistry.cancelListing(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWithCustomError(titleregistry, "NotOwner")
              })

              it("Emite un evento y quita el titulo del listado", async function () {
                  await titleregistry.listTitle(
                      basicNft.address,
                      TOKEN_ID,
                      PRICE
                  )
                  expect(
                      await titleregistry.cancelListing(
                          basicNft.address,
                          TOKEN_ID
                      )
                  ).to.emit(titleregistry, "Listado del titulo cancelado")
                  const listing = await titleregistry.getListing(
                      basicNft.address,
                      TOKEN_ID
                  )
                  assert(listing.price.toString() == "0")
              })
          })
          describe("buyTitle", function () {
              it("Revierte la operaci??n si el titulo no esta listado.", async function () {
                  await expect(
                      titleregistry.buyTitle(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWithCustomError(titleregistry, "NotListed")
              })
              it("Revertir si el precio no se cumple", async function () {
                  await titleregistry.listTitle(
                      basicNft.address,
                      TOKEN_ID,
                      PRICE
                  )
                  await expect(
                      titleregistry.buyTitle(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWithCustomError(titleregistry, "PriceNotMet")
              })
              it("Transfiere el titulo al comprador y actualiza el registro interno de las transacciones", async function () {
                  await titleregistry.listTitle(
                      basicNft.address,
                      TOKEN_ID,
                      PRICE
                  )
                  titleregistry = titleregistryContract.connect(user)
                  expect(
                      await titleregistry.buyTitle(basicNft.address, TOKEN_ID, {
                          value: PRICE,
                      })
                  ).to.emit(titleregistry, "Titulo comprado")
                  const newOwner = await basicNft.ownerOf(TOKEN_ID)
                  const deployerProceeds = await titleregistry.getProceeds(
                      await deployer.getAddress()
                  )
                  assert(newOwner.toString() == (await user.getAddress()))
                  assert(deployerProceeds.toString() == PRICE.toString())
              })
          })
          describe("updateListings", function () {
              it("Debe de ser due??o del titulo y el titulo estar listado", async function () {
                  await expect(
                      titleregistry.updateListings(
                          basicNft.address,
                          TOKEN_ID,
                          PRICE
                      )
                  ).to.be.revertedWithCustomError(titleregistry, "NotListed")
                  await titleregistry.listTitle(
                      basicNft.address,
                      TOKEN_ID,
                      PRICE
                  )
                  titleregistry = titleregistryContract.connect(user)
                  await expect(
                      titleregistry.updateListings(
                          basicNft.address,
                          TOKEN_ID,
                          PRICE
                      )
                  ).to.be.revertedWithCustomError(titleregistry, "NotOwner")
              })
              it("Actualiza el precio de un titulo de propiedad", async function () {
                  const updatedPrice = ethers.utils.parseEther("0.2")
                  await titleregistry.listTitle(
                      basicNft.address,
                      TOKEN_ID,
                      PRICE
                  )
                  expect(
                      await titleregistry.updateListings(
                          basicNft.address,
                          TOKEN_ID,
                          updatedPrice
                      )
                  ).to.emit(titleregistry, "TitleListed")
                  const listing = await titleregistry.getListing(
                      basicNft.address,
                      TOKEN_ID
                  )
                  assert(listing.price.toString() == updatedPrice.toString())
              })
          })
          describe("withdrawProceeds", function () {
              it("No permite retiros al no tener fondos", async function () {
                  await expect(
                      titleregistry.withDrawProceeds()
                  ).to.be.revertedWithCustomError(titleregistry, "NoProceeds")
              })
              it("Retirar balance", async function () {
                  await titleregistry.listTitle(
                      basicNft.address,
                      TOKEN_ID,
                      PRICE
                  )
                  titleregistry = titleregistryContract.connect(user)
                  await titleregistry.buyTitle(basicNft.address, TOKEN_ID, {
                      value: PRICE,
                  })
                  titleregistry = titleregistryContract.connect(deployer)

                  const deployerProceedsBefore =
                      await titleregistry.getProceeds(
                          await deployer.getAddress()
                      )
                  const deployerBalanceBefore = await deployer.getBalance()
                  const txResponse = await titleregistry.withDrawProceeds()
                  const transactionReceipt = await txResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const deployerBalanceAfter = await deployer.getBalance()

                  assert(
                      deployerBalanceAfter.add(gasCost).toString() ==
                          deployerProceedsBefore
                              .add(deployerBalanceBefore)
                              .toString()
                  )
              })
          })
      })
