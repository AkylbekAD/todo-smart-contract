import { task } from "hardhat/config"
const ContractAddress = "0x7fA471e05f5C1b91Db6226a1Db7c1B64fEaaA56C" //for localhost

task("showTask", "Shows task info")
    .addParam("name", "Task name you want see")
    .setAction(async (taskArgs, hre) => {
        const TodoInterface = await hre.ethers.getContractAt("Todo", ContractAddress)
        const result = await TodoInterface.showTask(taskArgs.name)
        console.log(`
            task_name: ${taskArgs.name}
            description: ${result[1]},
            hours_todo: ${hre.ethers.utils.formatUnits(result[0], 0)},
            owner: ${result[2]},
            completed: ${result[3]},
            completedInTime: ${result[4]}
            `)
    })
