import fs from 'fs';

async function mkdirExists(path) {
    try {
        await fs.promises.mkdir(path);
    } catch (e) {
        if (e.code == 'ENOENT') return false;
    }
    return true;
}

export {
    mkdirExists,
}