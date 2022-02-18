const { ipcRenderer } = require('electron')

// on receiving a request to list the divisions
ipcRenderer.on('list-divisions', (_, divisions) => {
  const divisionList = document.getElementById('divisionList')

  // for each division we receive and it to the list along with a delete button and set this as the html list
  let htmlDivisionList = ' '
  for (const division of divisions.keys()) {
    htmlDivisionList += 
      `<li id="${division}">
        <div class="divisionName" contenteditable="true" id="${division}Rename">${division}</div>
        <div class="division">
          <button class="view" id="${division}View">View</button>
        </div>
        <div class="division">
          <button class="delete" id="${division}Delete">X</button>
        </div>
      </li>`
  }
  divisionList.innerHTML = htmlDivisionList

  for (const division of divisions.keys()) {
    // make the division name editable to rename divisions
    document.getElementById(`${division}Rename`).addEventListener("blur", (e) => {
      ipcRenderer.send('rename-division', division, e.target.outerText)
    }, false)
    // add a click handler for each division which will launch the division window
    document.getElementById(`${division}View`).addEventListener('click', (e) => {
        ipcRenderer.send('view-division', division)
    }, false)
    // add a click handler for the delete button of each division which will delete the division
    document.getElementById(`${division}Delete`).addEventListener('click', (e) => {
      ipcRenderer.send('delete-division', division)
    })
  }
})

// add a listener for adding a new division through the form 
document.getElementById('divisionForm').addEventListener('submit', (event) => {
  // prevent default refresh functionality of forms
  event.preventDefault()

  // send the division name to be added
  const divisionName = event.target[0].value
  ipcRenderer.send('add-division', divisionName)

  // reset the form
  event.target[0].value = ''
})