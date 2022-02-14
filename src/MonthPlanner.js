const fs = require('fs');
const path = require('path');

const utils = require('./utils');

class MonthPlanner {
    static createMonthPlanner(basePath, identity) {
        const identityPath = path.join(basePath, identity);
        const metaPath = path.join(identityPath, 'meta');
        let fields = {};
        if(utils.mkdirExists(identityPath)) {
            try {
                const fieldMetadata = fs.readFileSync(metaPath, { encoding: 'utf-8' });
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

    addEntry(name, value, category) {
        const id = this.#generateRandomId();
        this.fields[id] = {
            'name': name,
            'value': value,
            'category': category,
        }
        this.#writeMetadata();
        return id;
    }

    getEntry(name) {
        const id = this.#getId(name);
        return this.fields[id];
    }

    listEntries() {
        return this.fields;
    }

    deleteEntry(id) {
        delete this.fields[id];
        this.#writeMetadata();
    }

    editEntry(name, field, content) {
        this.fields[name][field] = content
        this.#writeMetadata()
    }

    #getId(name) {
        for (const id in this.fields) {
            if (this.fields[id].name == name) return id;
        }
    }

    #generateRandomId() {
        return Date.now();
    }

    #writeMetadata() {
        fs.writeFileSync(this.metaPath, JSON.stringify(this.fields));
    }
}

module.exports = MonthPlanner;