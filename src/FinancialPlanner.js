const fs = require('fs');
const path = require('path');

const utils = require('./utils');
const MonthPlanner = require('./MonthPlanner');

class FinancialPlanner {
    static startFinancialPlanner(statePath) {
        if (statePath == undefined) statePath = utils.getDefaultAppPath();
        let monthPlanners = new Map;
        if (utils.mkdirExists(statePath)) {
            for (const file of fs.readdirSync(statePath)) {
                monthPlanners.set(file, MonthPlanner.createMonthPlanner(statePath, file));
            }
        }
        return new FinancialPlanner(statePath, monthPlanners);
    }

    constructor(statePath, monthPlanners) {
        this.monthPlanners = monthPlanners;
        this.statePath = statePath;
    }

    createNewMonthPlanner(name) {
        if (this.monthPlanners.has(name)) {
            console.log('Name already exists')
            return false;
        }
        this.monthPlanners.set(name, MonthPlanner.createMonthPlanner(this.statePath, name));
        return true;
    }

    deleteMonthPlanner(name) {
        fs.rmSync(path.join(this.statePath, name), { recursive: true, force: true });
        this.monthPlanners.delete(name);
    }
}

module.exports = FinancialPlanner;