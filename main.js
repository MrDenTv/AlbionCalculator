const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 600,
        height: 800,
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
    autoUpdater.autoDownload = false;

    ipcMain.on('check-for-updates', () => {
        autoUpdater.checkForUpdates();
    });

    let isInstalling = false;

    ipcMain.on('install-update', () => {
        isInstalling = true;
        autoUpdater.quitAndInstall();
    });

    autoUpdater.on('update-available', () => {
        mainWindow.webContents.send('update-status', { status: 'available' });
        autoUpdater.downloadUpdate();
    });

    autoUpdater.on('update-not-available', () => {
        mainWindow.webContents.send('update-status', { status: 'latest' });
    });

    autoUpdater.on('update-downloaded', () => {
        mainWindow.webContents.send('update-status', { status: 'downloaded' });
    });

    autoUpdater.on('error', (err) => {
        if (isInstalling) return;
        mainWindow.webContents.send('update-status', { status: 'error', error: err.message });
    });

    mainWindow.once('ready-to-show', () => {
        autoUpdater.checkForUpdates();
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
