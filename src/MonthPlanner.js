import fs from 'fs';
import path from 'path';
import * as utils from './utils';

class MonthPlanner {
    static async createMonthPlanner(basePath, identity) {
        const identityPath = path.join(basePath, identity);
        if(await utils.mkdirExists(identityPath)) {
            if(await fs.promises.access(path.join(identityPath, 'meta')));
            const fieldMetadata = await fs.promises.readFile(this.metaPath, { encoding: 'utf-8' });
            this.fields = JSON.parse(fieldMetadata);
        }
        return new MonthPlanner(identityPath, identity)
    }
    constructor(
        identityPath,
        identity,
    ) {
        this.identityPath = identityPath
        this.metaPath = path.join(this.identityPath, 'meta');
        this.identity = identity;
        this.fields = {};
    }

    async addEntry(name, value, category) {
        const id = this.generateRandomId();
        this.fields[id] = {
            'name': name,
            'value': value,
            'category': category,
        }
        await this.#writeMetadata();
        return id;
    }

    getEntry(name) {
        const id = this.getId(name);
        return this.fields[id];
    }

    async deleteEntry(name) {
        const id = this.getId(name);
        delete this.fields[id];
        await this.#writeMetadata();
    }

    #getId(name) {
        for (const id in this.fields) {
            if (this.fields[id].name == name) return id;
        }
    }

    #generateRandomId() {
        return Date.now();
    }

    async #writeMetadata() {
        await fs.promises.writeFile(this.metaPath, JSON.stringify(this.fields));
    }
}

export default MonthPlanner;