const hre = require ('hardhat');
const ethers = hre.ethers;

async function main() {
    const [owner] = await ethers.getSigners();

    const Todo = await ethers.getContractFactory('Todo', owner)
    const todo = await Todo.deploy()
    await todo.deployed()
    console.log(`Smart-contract have been deployed succesfully! Contract address: ${todo.address}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });