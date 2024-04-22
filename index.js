const { app, BrowserWindow, shell } = require('electron');
const http = require('http');

let mainWindow;

function createWindow() {
    console.log('Creating main window...');
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.webContents.on('new-window', function(event, url) {
        event.preventDefault();
        shell.openExternal(url);
    });

    // Directly load the URL of the already-running Julia Genie server
    checkServerAndLoad('http://localhost:8000');

    mainWindow.on('closed', function() {
        console.log('Main window closed');
        mainWindow = null;
    });
}

app.on('ready', () => {
    console.log('Electron app is ready.');
    createWindow();
});

app.on('window-all-closed', function() {
    console.log('All windows closed');
    if (process.platform === 'darwin') {
        console.log('App will stay active until quit explicitly.');
    } else {
        console.log('Quitting app on platforms other than macOS');
        app.quit();
    }
});

app.on('activate', function() {
    console.log('App activated');
    if (mainWindow === null) {
        console.log('Recreating main window...');
        createWindow();
    }
});

function checkServerAndLoad(url) {
    console.log('Checking server availability...');
    http.get(url, (res) => {
        if (res.statusCode === 200) {
            console.log('Server is up, loading URL...');
            mainWindow.loadURL(url);
        } else {
            console.log('Server not ready, retrying...');
            setTimeout(() => checkServerAndLoad(url), 3000);
        }
    }).on('error', (e) => {
        console.error(`Error connecting to server: ${e.message}`);
        console.log('Retry server connection...');
        setTimeout(() => checkServerAndLoad(url), 3000);
    });
}

// No need to handle Julia process termination within Electron
