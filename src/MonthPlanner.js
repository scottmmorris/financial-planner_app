import fs from 'fs';
import path from 'path';
import * as utils from './utils';

class MonthPlanner {
    static async createMonthPlanner(basePath, identity) {
        const identityPath = path.join(basePath, identity);
        const metaPath = path.join(identityPath, 'meta');
        let fields = {};
        if(await utils.mkdirExists(identityPath)) {
            try {
                const fieldMetadata = await fs.promises.readFile(metaPath, { encoding: 'utf-8' });
                fields = JSON.parse(fieldMetadata);
            } catch (e) {
                if (e.code != 'ENOENT') throw e;
            }
        }
        return new MonthPlanner(identityPath, metaPath, identity, fields)
    }
    constructor(
        identityPath,
        metaPath,
        identity,
        fields,
    ) {
        this.identityPath = identityPath
        this.metaPath = metaPath;
        this.identity = identity;
        this.fields = fields;
    }

    async addEntry(name, value, category) {
        const id = this.#generateRandomId();
        this.fields[id] = {
            'name': name,
            'value': value,
            'category': category,
        }
        await this.#writeMetadata();
        return id;
    }

    getEntry(name) {
        const id = this.#getId(name);
        return this.fields[id];
    }

    listEntries() {
        return this.fields;
    }

    async deleteEntry(name) {
        const id = this.#getId(name);
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