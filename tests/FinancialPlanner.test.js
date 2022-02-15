const fs = require('fs');
const os = require('os');
const path = require('path');

const FinancialPlanner = require('../src/FinancialPlanner');

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
        const fp = new FinancialPlanner(dataDir);
    });

    test('constructing and removing a new planner month', async () => {
        const fp = new FinancialPlanner(dataDir);
        fp.createDivision('January');
        await expect(fs.promises.readdir(dataDir)).resolves.toEqual(['January']);
        fp.deleteDivision('January');
        await expect(fs.promises.readdir(dataDir)).resolves.toEqual([]);
    });
});