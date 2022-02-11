// Modules to control application life and create native browser window
const path = require('path')
const { app, ipcMain } = require('electron')

const Window = require('./Window')
const FinancialPlanner = require('./src/FinancialPlanner')

const financialPlanner = FinancialPlanner.startFinancialPlanner();

function main () {
  // segment list window
  let mainWindow = new Window({
    file: path.join('renderer', 'index.html')
  })

  // detailed segment window
  let segmentDetailWindow

  // initialize with todos
  mainWindow.once('show', () => {
    mainWindow.webContents.send('listSegments', financialPlanner.monthPlanners)
  })

  // create detailed segment window viewer
  ipcMain.on('add-segment-window', (_, segment) => {
    // if segmentDetailWindow does not already exist
    if (!segmentDetailWindow) {
      // create a new segment detail window
      segmentDetailWindow = new Window({
        file: path.join('renderer', 'segment.html'),
        // close with the main window
        parent: mainWindow
      })
      segmentDetailWindow.once('show', () => {
        segmentDetailWindow.send('listEntries', financialPlanner.monthPlanners.get(segment).fields)
      })

      // cleanup
      segmentDetailWindow.on('closed', () => {
        segmentDetailWindow = null
      })
    }
  })

}

app.on('ready', main)

app.on('window-all-closed', function () {
  app.quit()
})
