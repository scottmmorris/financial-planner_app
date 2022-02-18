const { ipcRenderer } = require('electron')

// on receiving a request to list entries
ipcRenderer.on('list-entries', (_, entries, divisionName) => {
  // change the titles of the window to the division name
  document.getElementById('windowTitle').innerHTML = divisionName
  document.getElementById('divisionTitle').innerHTML = divisionName

  // for each entry we add a row to the table along with a delete button
  // all entry fields are editable as well
  const entryTable = document.getElementById('entryTable')
  let htmlEntryTable = ' '
  for (const entry in entries) {
    const color = (entries[entry].value < 0) ? '#FF3333' : '#28D29'
    console.log(color, entries[entry].value)
    htmlEntryTable += 
    `<tr>
      <th class="entry" style="background-color:${color};">
        <div contenteditable="true" id="${entry}NameEditor">${entries[entry].name}</div>
      </th>
      <th class="entry" style="background-color:${color};">
        <div contenteditable="true" id="${entry}CategoryEditor">${entries[entry].category}</div>
      </th>
      <th class="entry" style="background-color:${color};">
        <div contenteditable="true" id="${entry}ValueEditor">${entries[entry].value}</div>
      </th>
      <th>
        <button class="delete" id="${entry}DelButton">X</button>
      </th>
    </tr>`
  }

  // also append fields to add a new entry
  htmlEntryTable += 
    `<tr>
      <th class="add-entry">
        <div contenteditable="true" id="newEntryName">Name</div>
      </th>
      <th class="add-entry">
        <div contenteditable="true" id="newEntryCategory">Category</div>
      </th>
      <th class="add-entry">
        <div contenteditable="true" id="newEntryValue">Value</div>
      </th>
    </tr>`
  entryTable.innerHTML = htmlEntryTable

  for (const entry in entries) {
    // make the name, category and value of each entry editable
    document.getElementById(`${entry}NameEditor`).addEventListener("blur", (e) => {
      ipcRenderer.send('edit-entry', divisionName, entry, 'name', e.target.outerText)
    }, false)
    document.getElementById(`${entry}CategoryEditor`).addEventListener("blur", (e) => {
      ipcRenderer.send('edit-entry', divisionName, entry, 'category', e.target.outerText)
    }, false)
    document.getElementById(`${entry}ValueEditor`).addEventListener("blur", (e) => {
      ipcRenderer.send('edit-entry', divisionName, entry, 'value', e.target.outerText)
    }, false)
    // set the delete button for each entry
    document.getElementById(`${entry}DelButton`).addEventListener('click', (e) => {
      ipcRenderer.send('delete-entry', divisionName, entry)
    }, false)
  }

  // make a new element based on the input to either name, category or value
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