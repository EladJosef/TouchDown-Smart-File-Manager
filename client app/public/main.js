const { app, BrowserWindow } = require('electron')

app.on('ready', () => {
	window = new BrowserWindow({
		width: 1300,
		height: 900,
		frame: false,
		webPreferences: { nodeIntegration: true }
	})

	window.loadFile('index.html')
})

app.on('window-all-closed', () => app.quit())
