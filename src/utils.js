import fs from 'fs';

async function mkdirExists(path) {
    try {
        await fs.promises.mkdir(path);
    } catch (e) {
        if (e.code == 'EEXIST') return true;
        throw e;
    }
    return false;
}

export {
    mkdirExists,
}