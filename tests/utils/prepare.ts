import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { ethers } from "hardhat"

export async function prepareSigners(thisObject: Mocha.Context) {
    thisObject.signers = await ethers.getSigners()
    thisObject.owner = thisObject.signers[0]
    thisObject.alice = thisObject.signers[1]
    thisObject.bob = thisObject.signers[2]
    thisObject.carol = thisObject.signers[3]
    thisObject.tema = thisObject.signers[4]
    thisObject.misha = thisObject.signers[5]
}

export async function doDeploy(thisObject: Mocha.Context, signer: SignerWithAddress) {
    const Todo = await ethers.getContractFactory("Todo")

    const TodoInterface = await Todo.connect(signer).deploy()
    await TodoInterface.deployed()
    thisObject.TodoInterface = TodoInterface
}
