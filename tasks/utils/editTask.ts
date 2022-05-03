import { task } from "hardhat/config"
const ContractAddress = "0x7fA471e05f5C1b91Db6226a1Db7c1B64fEaaA56C" //for localhost

task("editTask", "Edits existing task")
    .addParam("old", "Old task name")
    .addParam("new", "New task name")
    .addParam("hours", "Hours to do task")
    .addParam("desc", "Description of task")
    .setAction(async (taskArgs, hre) => {
        const TodoInterface = await hre.ethers.getContractAt("Todo", ContractAddress)
        await TodoInterface.editTask(taskArgs.old, taskArgs.new, taskArgs.hours, taskArgs.desc)
        console.log(`'${taskArgs.old}' task now with '${taskArgs.new}' name, '${taskArgs.desc}' description and ${taskArgs.hours} hours to do`)
    })
