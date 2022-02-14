const { ipcRenderer } = require('electron')

// on receive todos
ipcRenderer.on('listSegments', (event, segments) => {
  // get the todoList ul
  const segmentList = document.getElementById('segmentList')

  let htmlSegmentList = ' '
  for (const key of segments.keys()) {
    htmlSegmentList += `<li class="segment" id="${key}">${key}</li><button class="btn" id="${key}">Delete</button>`
  }

  // set list html to the todo items
  segmentList.innerHTML = htmlSegmentList

  // add click handlers to view the segment in more detail and delete the segment
  segmentList.querySelectorAll('.segment').forEach(segment => {
    segment.addEventListener('click', (e) => {
      ipcRenderer.send('view-segment-window', e.target.id)
    })
  })
  segmentList.querySelectorAll(".btn").forEach(button => {
    button.addEventListener('click', (e) => {
      ipcRenderer.send('delete-segment', e.target.id)
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