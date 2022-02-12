const { ipcRenderer } = require('electron')

// on receive todos
ipcRenderer.on('listSegments', (event, segments) => {
  // get the todoList ul
  const segmentList = document.getElementById('segmentList')

  let htmlSegmentList = ' '
  for (const key of segments.keys()) {
    htmlSegmentList += `<li class="segment" id="${key}">${key}<button class="btn" id="${key}">Delete</button></li>`
  }

  // set list html to the todo items
  segmentList.innerHTML = htmlSegmentList

  // add click handlers to delete the clicked todo
  segmentList.querySelectorAll('.segment').forEach(segment => {
    // program fails here because it registers clicking the delete button as also wanting to
    // view the segment as well
    segment.querySelectorAll(".btn").forEach(button => {
      button.addEventListener('click', (e) => {
        console.log(e.target.id)
      })
    })
    segment.addEventListener('click', (e) => {
      ipcRenderer.send('view-segment-window', e.target.textContent)
    })
  })
})

document.getElementById('segmentForm').addEventListener('submit', (evt) => {
  // prevent default refresh functionality of forms
  evt.preventDefault()

  // input on the form
  const input = evt.target[0]

  // send segment name to main process
  ipcRenderer.send('add-segment', input.value)

  // reset input
  input.value = ''
})