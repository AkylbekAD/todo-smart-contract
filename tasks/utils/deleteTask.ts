import { task } from "hardhat/config"
const ContractAddress = "0x7fA471e05f5C1b91Db6226a1Db7c1B64fEaaA56C" //for localhost

task("deleteTask", "Deletes task from contract")
    .addParam("name", "Task name you want to delete")
    .setAction(async (taskArgs, hre) => {
        const TodoInterface = await hre.ethers.getContractAt("Todo", ContractAddress)
        await TodoInterface.deleteTask(taskArgs.name)
        console.log(`'${taskArgs.name}' task has been removed`)
    })
