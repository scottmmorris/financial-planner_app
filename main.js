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
  ipcMain.on('view-segment-window', (_, segment) => {
    // if segmentDetailWindow does not already exist
    if (!segmentDetailWindow) {
      // create a new segment detail window
      segmentDetailWindow = new Window({
        file: path.join('renderer', 'segment.html'),
        // close with the main window
        parent: mainWindow
      })
      segmentDetailWindow.once('show', () => {
        segmentDetailWindow.send('listEntries', financialPlanner.monthPlanners.get(segment).fields, segment)
      })

      // cleanup
      segmentDetailWindow.on('closed', () => {
        segmentDetailWindow = null
      })
    }
  })

  ipcMain.on('add-segment', (_, segmentName) => {
    financialPlanner.createNewMonthPlanner(segmentName)
    mainWindow.webContents.send('listSegments', financialPlanner.monthPlanners)
  })

  ipcMain.on('delete-segment', (_, segmentName) => {
    financialPlanner.deleteMonthPlanner(segmentName)
    mainWindow.webContents.send('listSegments', financialPlanner.monthPlanners)
  })

  ipcMain.on('edit-field', (_, segmentName, entryId, newField, newContent) => {
    financialPlanner.monthPlanners.get(segmentName).editEntry(entryId, newField, newContent)
    segmentDetailWindow.send('listEntries', financialPlanner.monthPlanners.get(segmentName).fields, segmentName)
  })

  ipcMain.on('add-entry', (_, segmentName, field, content) => {
    if (field == 'name') financialPlanner.monthPlanners.get(segmentName).addEntry(content, 0, '')
    if (field == 'category') financialPlanner.monthPlanners.get(segmentName).addEntry('', 0, content)
    if (field == 'value') financialPlanner.monthPlanners.get(segmentName).addEntry('', content, '')
    segmentDetailWindow.send('listEntries', financialPlanner.monthPlanners.get(segmentName).fields, segmentName)
  })

  ipcMain.on('delete-entry', (_, segmentName, entryId) => {
    financialPlanner.monthPlanners.get(segmentName).deleteEntry(entryId)
    segmentDetailWindow.send('listEntries', financialPlanner.monthPlanners.get(segmentName).fields, segmentName)
  })

}

app.on('ready', main)

app.on('window-all-closed', function () {
  app.quit()
})
