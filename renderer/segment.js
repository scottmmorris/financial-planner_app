const { ipcRenderer } = require('electron')

// on receive entries
ipcRenderer.on('listEntries', (event, entries) => {
  // get the todoList ul
  const entryTable = document.getElementById('entryTable')

  let htmlEntryTable = entryTable.innerHTML
  for (const entry in entries) {
    htmlEntryTable += `<tr class="entry"><th><div contenteditable="true" id="${entries[entry].name}NameEditor">${entries[entry].name}</div></th><th>${entries[entry].category}</th><th>${entries[entry].value}</th></tr>`
  }

  // set list html to the todo items
  entryTable.innerHTML = htmlEntryTable

  for (const entry in entries) {
    document.getElementById(`${entries[entry].name}NameEditor`).addEventListener("blur", (e) => {
      console.log("input event fired ", e.target.outerText);
    }, false);
  }
})