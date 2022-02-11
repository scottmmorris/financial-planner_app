const { ipcRenderer } = require('electron')

// on receive entries
ipcRenderer.on('listEntries', (event, entries) => {
  // get the todoList ul
  const entryTable = document.getElementById('entryTable')

  let htmlEntryTable = entryTable.innerHTML
  for (const entry in entries) {
    htmlEntryTable += `<tr class="entry"><th>${entries[entry].name}</th><th>${entries[entry].category}</th><th>${entries[entry].value}</th></tr>`
  }

  // set list html to the todo items
  entryTable.innerHTML = htmlEntryTable
})