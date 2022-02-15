const fs = require('fs')
const os = require('os')
const path = require('path')

const utils = require('../src/utils')

describe('utils testing', () => {
    let dataDir

    beforeEach(async () => {
        dataDir = await fs.promises.mkdtemp(
            path.join(os.tmpdir(), 'utils-test'),
        )
    })

    afterEach(async () => {
        await fs.promises.rm(dataDir, { recursive: true, force: true })
    })

    test('mkdirExists returns false if no file and true if there is a file', async () => {
        const filePath = path.join(dataDir, 'false')
        let exists = utils.mkdirExists(filePath)
        expect(exists).toBeFalsy()
        await expect(fs.promises.access(filePath)).resolves.toBeUndefined()
        exists = utils.mkdirExists(filePath)
        expect(exists).toBeTruthy()
    })
})