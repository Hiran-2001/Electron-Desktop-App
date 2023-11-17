const path = require("path");

const { app, BrowserWindow, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const fs = require("fs");
let win;
function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      // webSecurity: false
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  win.webContents.openDevTools();

  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("folder-path", async (event, folderPath) => {
  console.log(folderPath);
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      win.webContents.send("load-image", { error: err.message });
      return;
    }

    const imageFiles = files.filter((file) => /\.(jpg|jpeg|png)$/i.test(file));

    const imageBuffer = imageFiles.map((file) => {
      const imagePath = path.join(folderPath, file);

      return new Promise((res, rej) => {
        fs.readFile(imagePath, (err, data) => {
          if (err) {
            rej(err);
          } else {
            res({ buffer: data, fileName: file });
          }
        });
      });
    });

    Promise.all(imageBuffer).then((imageData) => {
      win.webContents.send("load-image", { images: imageData });
    }).catch(error=>{
      mainWindow.webContents.send('load-images', { error: error.message });
    });

    // const imagePath = imageFiles.map((img) => path.join(folderPath, img));
    // win.webContents.send("load-image", { images: imagePath });
  });

  // win.webContents.send("something-msg", { Name: "Hiran Raj" });
});
