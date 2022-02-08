import fs from 'fs';
import os from 'os';

async function mkdirExists(path) {
    try {
        await fs.promises.mkdir(path);
    } catch (e) {
        if (e.code == 'EEXIST') return true;
        throw e;
    }
    return false;
}

function getDefaultAppPath() {
    const prefix = 'scott-financial-planner';
    const platform = os.platform();
    let p;
    if (platform === 'linux') {
      const homeDir = os.homedir();
      const dataDir = process.env.XDG_DATA_HOME;
      if (dataDir != null) {
        p = `${dataDir}/${prefix}`;
      } else {
        p = `${homeDir}/.local/share/${prefix}`;
      }
    } else if (platform === 'darwin') {
      const homeDir = os.homedir();
      p = `${homeDir}/Library/Application Support/${prefix}`;
    } else if (platform === 'win32') {
      const homeDir = os.homedir();
      const appDataDir = process.env.LOCALAPPDATA;
      if (appDataDir != null) {
        p = `${appDataDir}/${prefix}`;
      } else {
        p = `${homeDir}/AppData/Local/${prefix}`;
      }
    } else {
      return;
    }
    return p;
  }

export {
    mkdirExists,
    getDefaultAppPath,
}