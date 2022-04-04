const { app, BrowserWindow } = require('electron');
const { session } = require("electron");
let win;
const createWindow = () => {
    win = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            webSecurity: false
        }
    });

    win.loadURL("http://localhost:3000", {
        userAgent: "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.124 Safari/537.36 qblink wegame.exe WeGame/5.3.0.3250 QBCore/3.70.107.400 QQBrowser/9.0.2524.400",
    });
    win.webContents.openDevTools();
}

const filter = {
    urls: [
        "https://www.wegame.com.cn/*",
        "https://*.qq.com/*"
    ]
};



app.whenReady()
    .then(() => {
        session.defaultSession.webRequest.onBeforeSendHeaders(filter, (detail, cb) => {
            win.webContents
                .executeJavaScript('localStorage.getItem("COOKIE_KEY");', true)
                .then(cookies => {
                    const headers = {
                        Referer: "https://www.wegame.com.cn/helper/lol/record/profile.html",
                        Accept: "application/json, text/plain, */*",
                        'trpc-caller': "wegame.pallas.web.LolBattle",
                        'content-type': "application/json;charset=UTF-8",
                        'cookie': cookies
                    };

                    Object.keys(headers)
                        .forEach(k => {
                            detail.requestHeaders[k] = headers[k];
                        });

                    cb({
                        requestHeaders: detail.requestHeaders
                    });
                });
        });

        createWindow();

        app.on('activate', () => {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (BrowserWindow.getAllWindows().length === 0) createWindow()
        })
    });

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})