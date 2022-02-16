// Modules to control application life and create native browser window
const path = require('path')
const { app, ipcMain } = require('electron')

const Window = require('./Window')
const FinancialPlanner = require('./src/FinancialPlanner')

const financialPlanner = new FinancialPlanner()

function main () {
  // open the main window of the financial app
  let financialPlannerWindow = new Window({
    file: path.join('renderer', 'index.html')
  })

  // load the divisions onto the main window
  financialPlannerWindow.once('show', () => {
    financialPlannerWindow.send('list-divisions', financialPlanner.divisions)
  })

  // create a window to view the dentries of a division
  let divisionWindow
  ipcMain.on('view-division', (_, divisionName) => {
    // do not open another division window if one already exists
    if (!divisionWindow) {
      divisionWindow = new Window({
        file: path.join('renderer', 'division.html'),
        // close with the financial planner window
        parent: financialPlannerWindow
      })

      // show all the entries in the division once the window is ready
      divisionWindow.once('show', () => {
        divisionWindow.send('list-entries', financialPlanner.divisions.get(divisionName).entries, divisionName)
      })

      // cleanup the division window
      divisionWindow.on('closed', () => {
        divisionWindow = null
      })
    }
  })

  // handle a call to create a new division and reload the division list
  ipcMain.on('add-division', (_, divisionName) => {
    financialPlanner.createDivision(divisionName)
    financialPlannerWindow.send('list-divisions', financialPlanner.divisions)
  })

  // handle a call to delete a division and reload the division list
  ipcMain.on('delete-division', (_, divisionName) => {
    financialPlanner.deleteDivision(divisionName)
    financialPlannerWindow.send('list-divisions', financialPlanner.divisions)
  })

  // handle a call to rename a division
  ipcMain.on('rename-division', (_, oldDivisionName, newDivisionName) => {
    financialPlanner.renameDivision(oldDivisionName, newDivisionName)
    financialPlannerWindow.send('list-divisions', financialPlanner.divisions)
  })

  // handle a call to edit the field of an entry within a dicision and reload the entry list for that division
  ipcMain.on('edit-entry', (_, divisionName, entryId, field, newContent) => {
    financialPlanner.divisions.get(divisionName).editEntry(entryId, field, newContent)
    divisionWindow.send('list-entries', financialPlanner.divisions.get(divisionName).entries, divisionName)
  })

  // handle a call to add a new entry with only single field info and then reload the entry list for that division
  ipcMain.on('add-entry', (_, divisionName, field, content) => {
    let args
    if (field == 'name') {
      args = [content, '', 0.00]
    } else if (field == 'category') {
      args = ['', content, 0.00]
    } else if (field == 'value') {
      args = ['', '', content]
    }
    financialPlanner.divisions.get(divisionName).addEntry(...args)
    divisionWindow.send('list-entries', financialPlanner.divisions.get(divisionName).entries, divisionName)
  })

  // handle a call to delete an entry for the entry list of the division
  ipcMain.on('delete-entry', (_, divisionName, entryId) => {
    financialPlanner.divisions.get(divisionName).deleteEntry(entryId)
    divisionWindow.send('list-entries', financialPlanner.divisions.get(divisionName).entries, divisionName)
  })
}

app.on('ready', main)

app.on('window-all-closed', function () {
  app.quit()
})
