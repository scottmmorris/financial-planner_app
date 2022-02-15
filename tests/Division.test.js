const fs = require('fs')
const os = require('os')
const path = require('path')

const Division = require('../src/Division')

describe('Division Testing', () => {
    let dataDir

    beforeEach(async () => {
        dataDir = await fs.promises.mkdtemp(
            path.join(os.tmpdir(), 'division-test'),
        )
    })

    afterEach(async () => {
        await fs.promises.rm(dataDir, { recursive: true, force: true })
    })

    test('adding and getting an entry', async () => {
        const january = new Division(dataDir, 'January')
        expect(january.entries).toEqual({})
        const entryId = january.addEntry('Chips', 'Food', 1.00)
        const chips = january.entries[entryId]
        expect(chips.name).toBe('Chips')
        expect(chips.value).toBe(1.00)
        expect(chips.category).toBe('Food')
        const entries = JSON.parse(await fs.promises.readFile(january.metaPath))
        let entriesMatch = {}
        entriesMatch[entryId] = {
            name: 'Chips',
            category: 'Food',
            value: 1.00,
        }
        expect(entries).toEqual(entriesMatch)
    })

    test('deleting an entry', async () => {
        const january = new Division(dataDir, 'January')
        const entryId = january.addEntry('Chips', 'Food', 1.00)
        january.deleteEntry(entryId)
        expect(january.entries[entryId]).toBeUndefined()
        const entries = JSON.parse(await fs.promises.readFile(january.metaPath))
        expect(entries).toEqual({})
    })

    test('can have multiple entries', async () => {
        const january = new Division(dataDir, 'January')
        const entryId1 = january.addEntry('Chips', 'Food', 2.00)
        const entryId2 = january.addEntry('Coke', 'Food', 1.00)
        const entryList = january.entries
        for (const entry in entryList) {
            expect(entryList[entry].name == 'Coke' || entryList[entry].name == 'Chips').toBeTruthy();
        };
        const entries = JSON.parse(await fs.promises.readFile(january.metaPath))
        let entriesMatch = {}
        entriesMatch[entryId1] = {
            name: 'Chips',
            category: 'Food',
            value: 2.00,
        }
        entriesMatch[entryId2] = {
            name: 'Coke',
            category: 'Food',
            value: 1.00,
        }
        expect(entries).toEqual(entriesMatch)
    })

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
        const chips = january.entries['abc'];
        expect(chips.name).toBe('Chips');
        expect(chips.value).toBe(2.00);
        expect(chips.category).toBe('Food');
    })

    test('can manipulate state', () => {
        const january = new Division(dataDir, 'January')
        const entryId = january.addEntry('Chips', 'Food', 1.00)
        const januaryReloaded = new Division(dataDir, 'January')
        let chips = januaryReloaded.entries[entryId]
        expect(chips.name).toBe('Chips')
        expect(chips.value).toBe(1.00)
        expect(chips.category).toBe('Food')
        januaryReloaded.deleteEntry(entryId)
        const januaryReloadedReloaded = new Division(dataDir, 'January')
        chips = januaryReloadedReloaded.entries[entryId]
        expect(chips).toBeUndefined()
    })

    test('can load an empty planner state', async () => {
        await fs.promises.mkdir(path.join(dataDir, 'January'))
        const januaryReloaded = new Division(dataDir, 'January')
        let chips = januaryReloaded.entries
        expect(chips).toEqual({})
        const entryId = januaryReloaded.addEntry('Chips', 'Food', 1.00)
        chips = januaryReloaded.entries[entryId]
        expect(chips.name).toBe('Chips')
        expect(chips.value).toBe(1.00)
        expect(chips.category).toBe('Food')
    })
})