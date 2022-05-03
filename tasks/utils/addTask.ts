import { task } from "hardhat/config"
const ContractAddress = "0x7fA471e05f5C1b91Db6226a1Db7c1B64fEaaA56C" //for localhost

task("addTask", "Adds new task to contract")
    .addParam("name", "Task name")
    .addParam("hours", "Hours to do task")
    .addParam("desc", "Description of task")
    .setAction(async (taskArgs, hre) => {
        const TodoInterface = await hre.ethers.getContractAt("Todo", ContractAddress)
        await TodoInterface.addTask(taskArgs.name, taskArgs.hours, taskArgs.desc)
        console.log(`'${taskArgs.name}' task with '${taskArgs.desc}' description and ${taskArgs.hours} hours to do, have been added`)
    })
