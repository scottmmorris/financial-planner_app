import fs from 'fs';
import os from 'os';
import path from 'path';

import MonthPlanner from '../src/MonthPlanner';

describe('MonthPlanner Testing', () => {
    let dataDir;

    beforeEach(async () => {
        dataDir = await fs.promises.mkdtemp(
            path.join(os.tmpdir(), 'month-planner-test'),
        );
    });

    afterEach(async () => {
        await fs.promises.rm(dataDir, { recursive: true, force: true });
    });

    test('adding and getting an entry', async () => {
        const january = await MonthPlanner.createMonthPlanner(dataDir, 'January');
        expect(january.getEntry('Chips')).toBeUndefined();
        await january.addEntry('Chips', 1.00, 'Food');
        const chips = january.getEntry('Chips');
        expect(chips.name).toBe('Chips');
        expect(chips.value).toBe(1.00);
        expect(chips.category).toBe('Food');
    });

    test('deleting an entry', async () => {
        const january = await MonthPlanner.createMonthPlanner(dataDir, 'January');
        await january.addEntry('Chips', 1.00, 'Food');
        await january.deleteEntry('Chips');
        expect(january.getEntry('Chips')).toBeUndefined();
    });

    test('can have multiple entries', async () => {
        const january = await MonthPlanner.createMonthPlanner(dataDir, 'January');
        await january.addEntry('Chips', 2.00, 'Food');
        await january.addEntry('Coke', 1.00, 'Food');
        let list = january.listEntries();
        for (const elem in list) {
            expect(list[elem].name == 'Coke' || list[elem].name == 'Chips').toBeTruthy();
        };
    });

    test('can load from existing state', async () => {
        const fields = {
            'abc': {
                'name': 'Chips',
                'value': 2.00,
                'category': 'Food'
            }
        }
        await fs.promises.mkdir(path.join(dataDir, 'January'));
        await fs.promises.writeFile(path.join(dataDir, 'January', 'meta'), JSON.stringify(fields));
        const january = await MonthPlanner.createMonthPlanner(dataDir, 'January');
        const chips = january.getEntry('Chips');
        expect(chips.name).toBe('Chips');
        expect(chips.value).toBe(2.00);
        expect(chips.category).toBe('Food');
    });

    test('can manipulate state', async () => {
        const january = await MonthPlanner.createMonthPlanner(dataDir, 'January');
        await january.addEntry('Chips', 1.00, 'Food');
        const januaryReloaded = await MonthPlanner.createMonthPlanner(dataDir, 'January')
        let chips = januaryReloaded.getEntry('Chips');
        expect(chips.name).toBe('Chips');
        expect(chips.value).toBe(1.00);
        expect(chips.category).toBe('Food');
        await januaryReloaded.deleteEntry('Chips');
        const januaryReloadedReloaded = await MonthPlanner.createMonthPlanner(dataDir, 'January');
        chips = januaryReloadedReloaded.getEntry('Chips');
        expect(chips).toBeUndefined();
    });

    test('can load an empty planner state', async () => {
        await fs.promises.mkdir(path.join(dataDir, 'January'));
        const januaryReloaded = await MonthPlanner.createMonthPlanner(dataDir, 'January')
        let chips = januaryReloaded.getEntry('Chips');
        expect(chips).toBeUndefined();
        await januaryReloaded.addEntry('Chips', 1.00, 'Food');
        chips = januaryReloaded.getEntry('Chips');
        expect(chips.name).toBe('Chips');
        expect(chips.value).toBe(1.00);
        expect(chips.category).toBe('Food');
    });
});