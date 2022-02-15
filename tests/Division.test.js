const fs = require('fs');
const os = require('os');
const path = require('path');

const Division = require('../src/Division');

describe('Division Testing', () => {
    let dataDir;

    beforeEach(async () => {
        dataDir = await fs.promises.mkdtemp(
            path.join(os.tmpdir(), 'division-test'),
        );
    });

    afterEach(async () => {
        await fs.promises.rm(dataDir, { recursive: true, force: true });
    });

    test('adding and getting an entry', () => {
        const january = new Division(dataDir, 'January');
        expect(january.getEntry('Chips')).toBeUndefined();
        january.addEntry('Chips', 'Food', 1.00);
        const chips = january.getEntry('Chips');
        expect(chips.name).toBe('Chips');
        expect(chips.value).toBe(1.00);
        expect(chips.category).toBe('Food');
    });

    test('deleting an entry', () => {
        const january = new Division(dataDir, 'January');
        const entryId = january.addEntry('Chips', 'Food', 1.00);
        january.deleteEntry(entryId);
        expect(january.entries[entryId]).toBeUndefined();
    });

    test('can have multiple entries', () => {
        const january = new Division(dataDir, 'January');
        january.addEntry('Chips', 'Food', 2.00);
        january.addEntry('Coke', 'Food', 1.00);
        const entryList = january.entries;
        for (const entry in entryList) {
            expect(entryList[entry].name == 'Coke' || entryList[entry].name == 'Chips').toBeTruthy();
        };
    });

    test('can load from existing state', async () => {
        const entries = {
            'abc': {
                'name': 'Chips',
                'value': 2.00,
                'category': 'Food'
            }
        }
        await fs.promises.mkdir(path.join(dataDir, 'January'));
        await fs.promises.writeFile(path.join(dataDir, 'January', 'meta'), JSON.stringify(entries));
        const january = new Division(dataDir, 'January');
        const chips = january.getEntry('Chips');
        expect(chips.name).toBe('Chips');
        expect(chips.value).toBe(2.00);
        expect(chips.category).toBe('Food');
    });

    test('can manipulate state', () => {
        const january = new Division(dataDir, 'January');
        const entryId = january.addEntry('Chips', 'Food', 1.00);
        const januaryReloaded = new Division(dataDir, 'January')
        let chips = januaryReloaded.getEntry('Chips');
        expect(chips.name).toBe('Chips');
        expect(chips.value).toBe(1.00);
        expect(chips.category).toBe('Food');
        januaryReloaded.deleteEntry(entryId);
        const januaryReloadedReloaded = new Division(dataDir, 'January');
        chips = januaryReloadedReloaded.getEntry('Chips');
        expect(chips).toBeUndefined();
    });

    test('can load an empty planner state', async () => {
        await fs.promises.mkdir(path.join(dataDir, 'January'));
        const januaryReloaded = new Division(dataDir, 'January')
        let chips = januaryReloaded.getEntry('Chips');
        expect(chips).toBeUndefined();
        januaryReloaded.addEntry('Chips', 'Food', 1.00);
        chips = januaryReloaded.getEntry('Chips');
        expect(chips.name).toBe('Chips');
        expect(chips.value).toBe(1.00);
        expect(chips.category).toBe('Food');
    });
});