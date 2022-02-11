import fs from 'fs';
import os from 'os';
import path from 'path';

import * as utils from '../src/utils';

describe('utils testing', () => {
    let dataDir;

    beforeEach(async () => {
        dataDir = await fs.promises.mkdtemp(
            path.join(os.tmpdir(), 'utils-test'),
        );
    });

    afterEach(async () => {
        await fs.promises.rm(dataDir, { recursive: true, force: true });
    });

    test('mkdirExists returns false if no file', async () => {
        const filePath = path.join(dataDir, 'false');
        const exists = await utils.mkdirExists(filePath);
        expect(exists).toBeFalsy();
        await expect(fs.promises.access(filePath)).resolves.toBeUndefined();
    });
});