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
        await fs.promises.rmdir(dataDir, { recursive: true, force: true });
    });

    test('adding and getting an entry', () => {
        const january = await createMonthPlanner(dataDir, 'January');
        expect(january.getEntry('Chips')).toBeUndefined();
        january.addEntry('Chips', 1.00, 'Food');
        const chips = january.getEntry('Chips');
        expect(chips.name).toBe('Chips');
        expect(chips.value).toBe(1.00);
        expect(chips.category).toBe('Food');
    });

    test('deleting an entry', () => {
        const january = await createMonthPlanner(dataDir, 'January');
        january.addEntry('Chips', 1.00, 'Food');
        january.deleteEntry('Chips');
        expect(january.getEntry('Chips')).toBeUndefined();
    });

    test('can load from existing state', async () => {
        const january = new MonthPlanner(dataDir, 'January');
        let chips = january.getEntry('Chips');
        expect(chips).toBeUndefined();
        const fields = {
            'abc': {
                'name': 'Chips',
                'value': 2.00,
                'category': 'Food'
            }
        }
        await fs.promises.mkdir(path.join(dataDir, 'January'));
        await fs.promises.writeFile(path.join(dataDir, 'January', 'meta'), JSON.stringify(fields));
        await january.loadFromDatabase();
        chips = january.getEntry('Chips');
        expect(chips.name).toBe('Chips');
        expect(chips.value).toBe(2.00);
        expect(chips.category).toBe('Food');
    });

    test('can manipulate state', async () => {
        const january = new MonthPlanner(dataDir, 'January');
        chips = january.getEntry('Chips');
        expect(chips.name).toBe('Chips');
        expect(chips.value).toBe(2.00);
        expect(chips.category).toBe('Food');
    });
});