const fs = require('fs')
const os = require('os')
const path = require('path')

const FinancialPlanner = require('../src/FinancialPlanner')

describe('FinancialPlanner Testing', () => {
    let dataDir

    beforeEach(async () => {
        dataDir = await fs.promises.mkdtemp(
            path.join(os.tmpdir(), 'financial-planner-test'),
        )
    })

    afterEach(async () => {
        await fs.promises.rm(dataDir, { recursive: true, force: true })
    })

    test('construction with existing state', async () => {
        await fs.promises.mkdir(path.join(dataDir, 'jan'))
        await fs.promises.mkdir(path.join(dataDir, 'feb'))
        await fs.promises.mkdir(path.join(dataDir, 'mar'))
        const fp = new FinancialPlanner(dataDir)
    })

    test('constructing and removing a new division', async () => {
        const fp = new FinancialPlanner(dataDir)
        expect(fp.createDivision('January')).toBeTruthy()
        await expect(fs.promises.readdir(dataDir)).resolves.toEqual(['January'])
        expect(fp.divisions.get('January')).not.toBeUndefined()
        fp.deleteDivision('January')
        await expect(fs.promises.readdir(dataDir)).resolves.toEqual([])
        expect(fp.divisions.get('January')).toBeUndefined()
    })

    test('constructing a division with the same name', async () => {
        const fp = new FinancialPlanner(dataDir)
        fp.createDivision('January')
        expect(fp.createDivision('January')).toBeFalsy()
        await expect(fs.promises.readdir(dataDir)).resolves.toEqual(['January'])
    })

    test('renaming a division', async () => {
        const fp = new FinancialPlanner(dataDir)
        fp.createDivision('January')
        fp.renameDivision('January', 'February')
        await expect(fs.promises.readdir(dataDir)).resolves.toEqual(['February'])
        expect(fp.divisions.get('January')).toBeUndefined()
        expect(fp.divisions.get('February')).not.toBeUndefined()
    })
})