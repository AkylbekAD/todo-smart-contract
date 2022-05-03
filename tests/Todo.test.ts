import { expect, use } from "chai"
import { ethers, waffle } from "hardhat"
import { doDeploy, prepareSigners } from "./utils/prepare"
import { duration, increase } from "./utils/time"

use(waffle.solidity)

describe("Todo contract", function () {
    beforeEach(async function () {
        await prepareSigners(this)
        await doDeploy(this, this.bob)
    })

    describe("Deployment", function () {
        it("Should return Bob`s address as a creator", async function () {
            expect(await this.TodoInterface.creator()).to.equal(this.bob.address)
        })

        it("Should return contract address", async function () {
            expect(await this.TodoInterface.contractAddress()).to.equal(ethers.Contract.getContractAddress({ from: this.bob.address, nonce: 1 }))
        })
    })

    describe("addTask function", function () {
        it("Anyone can add new tasks", async function () {
            const testTask = ["Buy a milk", 1, "Dont forget to buy a milk"]

            await this.TodoInterface.connect(this.bob).addTask(...testTask) //adding test task to contract
            const gettingTask = await this.TodoInterface.showTask(testTask[0]) //getting test task info from contract
            const formatedTask = [+ethers.utils.formatUnits(gettingTask[0], 0), gettingTask[1], gettingTask[2]] //formating info [0: hours_todo, 1: task_name, 2: owner.address]
            expect(formatedTask).to.deep.equal([testTask[1], testTask[2], this.bob.address])
        })

        it("Should revert if hours to do is less then 1", async function () {
            expect(this.TodoInterface.connect(this.bob).addTask("TaskName", 0, "Description")).to.be.revertedWith(
                "You have to input atleast 1 hour to do task"
            )
        })
    })

    describe("deleteTask function", function () {
        it("Only owner of task can delete task", async function () {
            this.TodoInterface.connect(this.bob).addTask("TaskName", 1, "Description")
            expect(this.TodoInterface.connect(this.alice).deleteTask("TaskName")).to.be.revertedWith("You are not an owner!")
        })

        it("Owner of task can delete his task", async function () {
            this.TodoInterface.connect(this.bob).addTask("TaskName", 1, "Description")
            const deletingTask = this.TodoInterface.connect(this.bob).deleteTask("TaskName")
            expect(deletingTask).to.emit(this.TodoInterface, "TaskRemoved").withArgs(this.bob.address, "TaskName")
        })
    })

    describe("editTask function", function () {
        it("Only owner of task can edit task", async function () {
            this.TodoInterface.connect(this.bob).addTask("TaskName", 1, "Description")
            expect(this.TodoInterface.connect(this.alice).editTask("TaskName", "NewTaskName", 2, "NewDescription")).to.be.revertedWith(
                "You are not an owner!"
            )
        })

        it("Owner of task cannot edit task if deadline is passed", async function () {
            this.TodoInterface.connect(this.bob).addTask("TaskName", 1, "Description")
            increase(duration.hours("2")) // passing 2 hours
            expect(this.TodoInterface.connect(this.bob).editTask("TaskName", "NewTaskName", 2, "NewDescription")).to.be.revertedWith(
                "Deadline for this task already have passed"
            )
        })

        it("Owner of task cannot edit task if its already completed", async function () {
            this.TodoInterface.connect(this.bob).addTask("TaskName", 1, "Description")
            this.TodoInterface.connect(this.bob).completeTask("TaskName") //completing task
            expect(this.TodoInterface.connect(this.bob).editTask("TaskName", "NewTaskName", 2, "NewDescription")).to.be.revertedWith(
                "This task already had been completed!"
            )
        })

        it("In proper conditions owner of task can edit his task", async function () {
            this.TodoInterface.connect(this.bob).addTask("TaskName", 1, "Description")
            const editingTask = this.TodoInterface.connect(this.bob).editTask("TaskName", "NewTaskName", 2, "NewDescription")
            expect(editingTask).to.emit(this.TodoInterface, "TaskEdited").withArgs(this.bob.address, "NewTaskName")
        })
    })

    describe("completeTask function", function () {
        it("Only owner of task can complete task", async function () {
            this.TodoInterface.connect(this.bob).addTask("TaskName", 1, "Description")
            expect(this.TodoInterface.connect(this.alice).completeTask("TaskName", "NewTaskName", 2, "NewDescription")).to.be.revertedWith(
                "You are not an owner!"
            )
        })

        it("Owner of task cannot complete task if it already completed", async function () {
            this.TodoInterface.connect(this.bob).addTask("TaskName", 1, "Description")
            this.TodoInterface.connect(this.bob).completeTask("TaskName") //completing task
            expect(this.TodoInterface.connect(this.bob).completeTask("TaskName")).to.be.revertedWith("This task already had been completed!")
        })

        it("If owner completes task before deadline, he gets 'true' at completedInTime", async function () {
            this.TodoInterface.connect(this.bob).addTask("TaskName", 1, "Description")
            const completingTask = this.TodoInterface.connect(this.bob).completeTask("TaskName")
            expect(completingTask).to.emit(this.TodoInterface, "TaskCompleted").withArgs(this.bob.address, "TaskName", true)
        })

        it("If owner completes task after deadline, he gets 'false' at completedInTime", async function () {
            this.TodoInterface.connect(this.bob).addTask("TaskName", 1, "Description")
            increase(duration.hours("2")) // passing 2 hours
            const completingTask = this.TodoInterface.connect(this.bob).completeTask("TaskName")
            expect(completingTask).to.emit(this.TodoInterface, "TaskCompleted").withArgs(this.bob.address, "TaskName", false)
        })
    })

    describe("showProductivity function", function () {
        it("Anyone can see productivity of user", async function () {
            await this.TodoInterface.connect(this.bob).addTask("TaskName", 1, "Description")
            await this.TodoInterface.connect(this.bob).addTask("TaskName1", 1, "Description1")
            expect(await this.TodoInterface.showProductivity(this.bob.address)).to.be.equal("0")

            await this.TodoInterface.connect(this.bob).completeTask("TaskName")
            expect(await this.TodoInterface.showProductivity(this.bob.address)).to.be.equal("50")
        })

        it("You cannot see productivity of user who didnt add any tasks to do", async function () {
            expect(this.TodoInterface.showProductivity(this.alice.address)).to.be.revertedWith("User doesnt have any tasks to do")
        })
    })

    describe("showUserTasks function", function () {
        it("Anyone can see all tasks of user", async function () {
            await this.TodoInterface.connect(this.bob).addTask("TaskName", 1, "Description")
            await this.TodoInterface.connect(this.bob).addTask("TaskName1", 2, "Description1")

            expect(await this.TodoInterface.showUserTasks(this.bob.address)).to.deep.equal(["TaskName", "TaskName1"])
        })
    })
})
