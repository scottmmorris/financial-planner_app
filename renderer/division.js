const { ipcRenderer } = require('electron')

// on receiving a request to list entries
ipcRenderer.on('list-entries', (_, entries, divisionName) => {
  const entryTable = document.getElementById('entryTable')

  let htmlEntryTable = '<tbody><tr><th>Name</th><th>Category</th><th>Value</th></tr></tbody>'
  for (const entry in entries) {
    htmlEntryTable += `<tr class="entry"><th><div contenteditable="true" id="${entry}NameEditor">${entries[entry].name}</div></th><th><div contenteditable="true" id="${entry}CategoryEditor">${entries[entry].category}</div></th><th><div contenteditable="true" id="${entry}ValueEditor">${entries[entry].value}</div></th><th><button class="btn" id="${entry}DelButton">Delete</button></th></tr>`
  }
  htmlEntryTable += `<tr class="entry"><th><div contenteditable="true" id="newEntryName">name</div></th><th><div contenteditable="true" id="newEntryCategory">category</div></th><th><div contenteditable="true" id="newEntryValue">value</div></th></tr>`

  // set list html to the todo items
  entryTable.innerHTML = htmlEntryTable

  for (const entry in entries) {
    document.getElementById(`${entry}NameEditor`).addEventListener("blur", (e) => {
      ipcRenderer.send('edit-field', divisionName, entry, 'name', e.target.outerText);
    }, false)
    document.getElementById(`${entry}CategoryEditor`).addEventListener("blur", (e) => {
      ipcRenderer.send('edit-field', divisionName, entry, 'category', e.target.outerText);
    }, false)
    document.getElementById(`${entry}ValueEditor`).addEventListener("blur", (e) => {
      ipcRenderer.send('edit-field', divisionName, entry, 'value', e.target.outerText);
    }, false)
    document.getElementById(`${entry}DelButton`).addEventListener('click', (e) => {
      ipcRenderer.send('delete-entry', divisionName, entry);
    }, false)
  }
  document.getElementById(`newEntryName`).addEventListener("blur", (e) => {
    ipcRenderer.send('add-entry', divisionName, 'name', e.target.outerText)
  }, false)
  document.getElementById(`newEntryCategory`).addEventListener("blur", (e) => {
    ipcRenderer.send('add-entry', divisionName, 'category', e.target.outerText)
  }, false)
  document.getElementById(`newEntryValue`).addEventListener("blur", (e) => {
    ipcRenderer.send('add-entry', divisionName, 'value', e.target.outerText)
  }, false)
})