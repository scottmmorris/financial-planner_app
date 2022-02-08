import fs from 'fs';
import path from 'path';
import * as utils from './utils';

import MonthPlanner from './MonthPlanner';

class FinancialPlanner {
    static async startFinancialPlanner(statePath) {
        if (statePath == undefined) statePath = utils.getDefaultAppPath();
        let monthPlanners = new Map;
        if (await utils.mkdirExists(statePath)) {
            for (const file of await fs.promises.readdir(statePath)) {
                monthPlanners.set(file, await MonthPlanner.createMonthPlanner(statePath, file));
            }
        }
        return new FinancialPlanner(statePath, monthPlanners);
    }

    constructor(statePath, monthPlanners) {
        this.monthPlanners = monthPlanners;
        this.statePath = statePath;
    }

    async createNewMonthPlanner(name) {
        if (this.monthPlanners.has(name)) {
            console.log('Name already exists')
            return false;
        }
        this.monthPlanners.set(name, await MonthPlanner.createMonthPlanner(this.statePath, name));
        return true;
    }

    async deleteMonthPlanner(name) {
        await fs.promises.rm(path.join(this.statePath, name), { recursive: true, force: true });
        this.monthPlanners.delete(name);
    }
}

export default FinancialPlanner;