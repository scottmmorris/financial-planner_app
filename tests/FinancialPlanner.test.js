import fs from 'fs';
import os from 'os';
import path from 'path';

import FinancialPlanner from '../src/FinancialPlanner';

describe('FinancialPlanner Testing', () => {
    let dataDir;

    beforeEach(async () => {
        dataDir = await fs.promises.mkdtemp(
            path.join(os.tmpdir(), 'financial-planner-test'),
        );
    });

    afterEach(async () => {
        await fs.promises.rm(dataDir, { recursive: true, force: true });
    });

    test('construction with existing state', async () => {
        await fs.promises.mkdir(path.join(dataDir, 'jan'));
        await fs.promises.mkdir(path.join(dataDir, 'feb'));
        await fs.promises.mkdir(path.join(dataDir, 'mar'));
        const fp = await FinancialPlanner.startFinancialPlanner(dataDir);
    });

    test('constructing and removing a new planner month', async () => {
        const fp = await FinancialPlanner.startFinancialPlanner(dataDir);
        await fp.createNewMonthPlanner('January');
        await expect(fs.promises.readdir(dataDir)).resolves.toEqual(['January']);
        await fp.deleteMonthPlanner('January');
        await expect(fs.promises.readdir(dataDir)).resolves.toEqual([]);
    });
});