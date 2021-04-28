const { app, BrowserWindow, ipcMain } = require('electron')

app.on('ready', () => {
	window = new BrowserWindow({
		width: 800,
		height: 500,
		frame: false,
		resizable: false,
		webPreferences: { nodeIntegration: true }
	})

	ipcMain.on('full_screen', (event, arg) => {
		window.maximize()
	})

	window.loadFile('index.html')
})

app.on('window-all-closed', () => app.quit())


