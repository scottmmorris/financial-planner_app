const { ipcRenderer } = require('electron')

// on receive entries
ipcRenderer.on('listEntries', (_, entries, segmentName) => {
  // get the todoList ul
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
      ipcRenderer.send('edit-field', segmentName, entry, 'name', e.target.outerText);
    }, false)
    document.getElementById(`${entry}CategoryEditor`).addEventListener("blur", (e) => {
      ipcRenderer.send('edit-field', segmentName, entry, 'category', e.target.outerText);
    }, false)
    document.getElementById(`${entry}ValueEditor`).addEventListener("blur", (e) => {
      ipcRenderer.send('edit-field', segmentName, entry, 'value', e.target.outerText);
    }, false)
    document.getElementById(`${entry}DelButton`).addEventListener('click', (e) => {
      ipcRenderer.send('delete-entry', segmentName, entry);
    }, false)
  }
  document.getElementById(`newEntryName`).addEventListener("blur", (e) => {
    ipcRenderer.send('add-entry', segmentName, 'name', e.target.outerText)
  }, false)
  document.getElementById(`newEntryCategory`).addEventListener("blur", (e) => {
    ipcRenderer.send('add-entry', segmentName, 'category', e.target.outerText)
  }, false)
  document.getElementById(`newEntryValue`).addEventListener("blur", (e) => {
    ipcRenderer.send('add-entry', segmentName, 'value', e.target.outerText)
  }, false)
})