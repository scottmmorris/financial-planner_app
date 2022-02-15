const fs = require('fs')
const path = require('path')

const utils = require('./utils')

class Division {
    constructor(
        basePath,
        identity,
    ) {
        this.identityPath = path.join(basePath, identity)
        this.metaPath = path.join(this.identityPath, 'meta')
        this.identity = identity
        this.entries = {}

        // if the division already exists at the specified path, load in its existing meta
        if(utils.mkdirExists(this.identityPath)) {
            try {
                const fieldMetadata = fs.readFileSync(this.metaPath, { encoding: 'utf-8' })
                this.entries = JSON.parse(fieldMetadata)
            } catch (e) {
                if (e.code != 'ENOENT') throw e
            }
        }
    }

    // adds an entry to the division with a given name category and value
    addEntry(name, category, value) {
        const id = this.#generateRandomId()
        this.entries[id] = {
            'name': name,
            'category': category,
            'value': value,
        }
        this.#writeMetadata()
        return id
    }

    // deletes an entry from the division based on its id
    deleteEntry(id) {
        delete this.entries[id]
        this.#writeMetadata()
    }

    // edits a specified entry field based on the entry id
    editEntry(id, field, content) {
        this.entries[id][field] = content
        this.#writeMetadata()
    }

    // generates a unique id for each entry based on the time since epoch
    #generateRandomId() {
        return Date.now()
    }

    // writes the entry list to the disk
    #writeMetadata() {
        fs.writeFileSync(this.metaPath, JSON.stringify(this.entries))
    }
}

module.exports = Division