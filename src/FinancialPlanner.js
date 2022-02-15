const fs = require('fs')
const path = require('path')

const utils = require('./utils')
const Division = require('./Division')

class FinancialPlanner {
    constructor(statePath) {
        // if the state path isnt specified, use the platform dependent default path
        this.statePath = statePath
        if (this.statePath == undefined) this.statePath = utils.getDefaultAppPath()

        this.divisions = new Map;
        // if existing data exists at the state path, load it in
        if (utils.mkdirExists(this.statePath)) {
            for (const file of fs.readdirSync(this.statePath)) {
                this.divisions.set(file, new Division(this.statePath, file))
            }
        }
    }

    // creates a new division in the financial planner with the given name
    createDivision(name) {
        if (this.divisions.has(name)) {
            return false
        }
        this.divisions.set(name, new Division(this.statePath, name))
        return true
    }

    // deletes a division in the financial planner with the given name
    deleteDivision(name) {
        fs.rmSync(path.join(this.statePath, name), { recursive: true, force: true })
        this.divisions.delete(name)
    }

    // assigns a new name to the specified division
    renameDivision(oldName, newName) {
        fs.renameSync(path.join(this.statePath, oldName), path.join(this.statePath, newName))
        this.divisions.delete(oldName)
        this.divisions.set(newName, new Division(this.statePath, newName))
    }
}

module.exports = FinancialPlanner