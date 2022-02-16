const { ipcRenderer } = require('electron')

// on receiving a request to list the divisions
ipcRenderer.on('list-divisions', (_, divisions) => {
  const divisionList = document.getElementById('divisionList')

  // for each division we receive and it to the list along with a delete button and set this as the html list
  let htmlDivisionList = ' '
  for (const division of divisions.keys()) {
    htmlDivisionList += `<li class="division" id="${division}"><div contenteditable="true" id="${division}Rename">${division}</div></li><button class="viewButton" id="${division}">View</button><button class="deleteButton" id="${division}">Delete</button>`
  }
  divisionList.innerHTML = htmlDivisionList

  // add a click handler for each division which will launch the division window
  divisionList.querySelectorAll('.viewButton').forEach(viewButton => {
    viewButton.addEventListener('click', (e) => {
      ipcRenderer.send('view-division', e.target.id)
    })
  })

  for (const division of divisions.keys()) {
    document.getElementById(`${division}Rename`).addEventListener("blur", (e) => {
      ipcRenderer.send('rename-division', division, e.target.outerText)
    }, false)
  }

  // add a click handler for the delete button of each division which will delete the division
  divisionList.querySelectorAll(".deleteButton").forEach(deleteButton => {
    deleteButton.addEventListener('click', (e) => {
      ipcRenderer.send('delete-division', e.target.id)
    })
  })
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