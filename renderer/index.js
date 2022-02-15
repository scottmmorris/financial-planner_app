const { ipcRenderer } = require('electron')

// on receiving a request to list the divisions
ipcRenderer.on('list-divisions', (_, divisions) => {
  const divisionList = document.getElementById('divisionList')

  // for each division we receive and it to the list along with a delete button and set this as the html list
  let htmlDivisionList = ' '
  for (const division of divisions.keys()) {
    htmlDivisionList += `<li class="division" id="${division}">${division}</li><button class="btn" id="${division}">Delete</button>`
  }
  divisionList.innerHTML = htmlDivisionList

  // add a click handler for each division which will launch the division window
  divisionList.querySelectorAll('.division').forEach(division => {
    division.addEventListener('click', (e) => {
      ipcRenderer.send('view-division', e.target.id)
    })
  })

  // add a click handler for the delete button of each division which will delete the division
  divisionList.querySelectorAll(".btn").forEach(button => {
    button.addEventListener('click', (e) => {
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