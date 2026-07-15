const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 480,
        height: 750,
        minWidth: 400,
        minHeight: 600,
        resizable: true,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        icon: path.join(__dirname, 'icon.png')
    });

    mainWindow.loadFile('index.html');

    // Auto update logic
    mainWindow.once('ready-to-show', () => {
        autoUpdater.checkForUpdatesAndNotify();
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
