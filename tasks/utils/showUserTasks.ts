import { task } from "hardhat/config"
const ContractAddress = "0x7fA471e05f5C1b91Db6226a1Db7c1B64fEaaA56C" //for localhost

task("showUserTasks", "Shows all user tasks")
    .addParam("address", "User address tasks you want to see")
    .setAction(async (taskArgs, hre) => {
        const TodoInterface = await hre.ethers.getContractAt("Todo", ContractAddress)
        console.log(await TodoInterface.showUserTasks(taskArgs.address))
    })
