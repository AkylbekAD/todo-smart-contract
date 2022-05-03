import { task } from "hardhat/config"
const ContractAddress = "0x7fA471e05f5C1b91Db6226a1Db7c1B64fEaaA56C" //for localhost

task("completeTask", "Completes task")
    .addParam("name", "Task name you want to complete")
    .setAction(async (taskArgs, hre) => {
        const TodoInterface = await hre.ethers.getContractAt("Todo", ContractAddress)
        await TodoInterface.completeTask(taskArgs.name)
        console.log(`'${taskArgs.name}' task has been completed`)
    })
