const { ipcRenderer } = require('electron')

// on receive todos
ipcRenderer.on('listSegments', (event, segments) => {
  // get the todoList ul
  const segmentList = document.getElementById('segmentList')

  let htmlSegmentList = ' '
  for (const key of segments.keys()) {
    htmlSegmentList += `<li class="segment">${key}</li>`
  }

  // set list html to the todo items
  segmentList.innerHTML = htmlSegmentList

  // add click handlers to delete the clicked todo
  segmentList.querySelectorAll('.segment').forEach(item => {
    item.addEventListener('click', (e) => {
      ipcRenderer.send('add-segment-window', e.target.textContent)
    })
  })
})