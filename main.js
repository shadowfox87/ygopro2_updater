const electron = require('electron')
''
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
var connectionNumber;
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({ width: 800, height: 600 })
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
    // mainWindow.webContents.openDevTools()
    mainWindow.on('closed', function() {
        mainWindow = null
    });

}
app.on('ready', createWindow)
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('activate', function() {
    if (mainWindow === null) {
        createWindow()
    }
})

global.restartApp = function() {
    app.restart();
}



// PORTABLE_EXECUTABLE_DIR
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////



const fs = require('fs-extra');
const request = require('request');
const async = require("async");
const http = require("http");

let whereToFolder;
let filesObject;
let gitFilesObject;
let noOfDownloads;
let user;
let repository;
let token;
let filesstorePath;
let customHeaderRequest;

fs.ensureDir(path.join(app.getPath('appData'), 'YGpro_updater'));
let obj1 = {
    whereToFolder: process.env.PORTABLE_EXECUTABLE_DIR,
    filesObject: {},
    gitFilesObject: {},
    noOfDownloads: {},
    user: 'Ygoproco',
    repository: 'Live2017Links',
    token: '',
    filesstorePath: path.join(path.join(app.getPath('appData'), 'YGpro_updater'), 'repo1.json')
};
let obj2 = {
    whereToFolder: process.env.PORTABLE_EXECUTABLE_DIR,
    filesObject: {},
    gitFilesObject: {},
    noOfDownloads: {},
    user: 'shadowfox87',
    repository: 'ygopro2',
    token: '',
    filesstorePath: path.join(path.join(app.getPath('appData'), 'YGpro_updater'), 'repo2.json'),

};
let obj3 = {
    whereToFolder: process.env.PORTABLE_EXECUTABLE_DIR,
    filesObject: {},
    gitFilesObject: {},
    noOfDownloads: {},
    user: 'shadowfox87',
    repository: 'YGOSeries10CardPics',
    token: '',
    filesstorePath: path.join(path.join(app.getPath('appData'), 'YGpro_updater'), 'repo3.json'),

};
let obj4 = {
    whereToFolder: process.env.PORTABLE_EXECUTABLE_DIR,
    filesObject: {},
    gitFilesObject: {},
    noOfDownloads: {},
    user: 'shadowfox87',
    repository: 'YGOCloseupsPng300x300',
    token: '',
    filesstorePath: path.join(path.join(app.getPath('appData'), 'YGpro_updater'), 'repo4.json'),
};
//__________________________________________________\\

//=========== Start HERE ======================\\\
require('speedtest-net')().on('downloadspeed', speed => {
    connectionNumber = parseInt(0.3 * speed)
    if (connectionNumber < 2)
        connectionNumber = 3;
    downloadFromGitPath(obj1, function() {
        downloadFromGitPath(obj2, function() {
            downloadFromGitPath(obj3, function() {
                downloadFromGitPath(obj4, function() {
                    mainWindow.webContents.send('info', getUpdateObject());
                });
            });
        });
    });
});
// downloadFromGitPath(obj1, function() {
//     mainWindow.webContents.send('info', getUpdateObject());
// });
//__________________________________________________\\
function downloadFromGitPath(objt, cb) {
    whereToFolder = objt['whereToFolder'];
    filesObject = objt['filesObject'];
    gitFilesObject = objt['gitFilesObject'];
    noOfDownloads = objt['noOfDownloads'];
    user = objt['user'];
    repository = objt['repository'];
    token = objt['token'];
    filesstorePath = objt['filesstorePath'];
    customHeaderRequest = request.defaults({
        headers: {
            'User-Agent': 'Mozilla/5.0 (iPad; U; CPU OS 3_2_1 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Mobile/7B405',
            'Authorization': 'token ' + token,
            'Accept': ' application/vnd.github.v3.raw'
        }
    });

    if (!fs.existsSync(filesstorePath)) {
        fs.writeFileSync(filesstorePath, JSON.stringify(filesObject), 'utf8');
    } else {
        filesObject = JSON.parse(fs.readFileSync(filesstorePath, 'utf8'));
    }

    customHeaderRequest.get('https://api.github.com/repos/' + user + '/' + repository + '/branches/master', function(error, response, body) {
        let bodi = JSON.parse(response['body']);
        let sha = bodi.commit.commit.tree.sha;
        customHeaderRequest.get('https://api.github.com/repos/' + user + '/' + repository + '/git/trees/' + sha + '?recursive=1', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                gitFilesObject = JSON.parse(body);
                gitFilesObject = gitFilesObject['tree'];
                let numberOfCards = gitFilesObject.length;
                let index = 0;
                for (index = 0; index < numberOfCards; index++) {
                    if (gitFilesObject[index]['type'] !== 'blob') {
                        continue;
                    }
                    let folderName = path.dirname(gitFilesObject[index]['path']);
                    let fileName = path.posix.basename(gitFilesObject[index]['path']);
                    let key = folderName + '/' + fileName;
                    fs.ensureDir(path.join(whereToFolder, folderName));
                    if (typeof filesObject[key] === 'undefined') {
                        filesObject[key] = { 'name': key, 'sha': gitFilesObject[index]['sha'], 'download_url': makeDownloadPath(folderName, fileName), 'downloaded': 0, savePath: path.join(whereToFolder, key), modified: 1, exists: 1 };
                    } else {
                        filesObject[key]['exists'] = 1;
                        if (filesObject[key]['sha'] !== gitFilesObject[index]['sha']) {
                            filesObject[key]['downloaded'] = 0;
                            filesObject[key]['sha'] = gitFilesObject[index]['sha'];
                            filesObject[key]['modified'] = 1;
                        } else {
                            if (!fs.existsSync(filesObject[key]['savePath'])) {
                                if (!fs.existsSync(path.join(whereToFolder, key))) {
                                    console.log(path.join(whereToFolder, key))
                                    filesObject[key]['downloaded'] = 0;
                                    filesObject[key]['modified'] = 1;
                                } else {
                                    filesObject[key]['savePath'] = path.join(whereToFolder, key);
                                }
                            }
                        }
                    }
                }
                finishedUpdatingCardObject(cb);
            } else {
                console.log(error);
                console.log(response.statusCode);
                process.exit();
            }
        })
    })
}

function downloadItems(cb) {
    let downloadObject = {};
    let delKeys = [];
    for (let index in filesObject) {
        if (filesObject[index]['downloaded'] == 0) {
            downloadObject[index] = filesObject[index];
        }
        if (typeof filesObject[index]['exists'] === "undefined" || filesObject[index]['exists'] == 0) {
            filesObject[index]['exists'] = 0;
            delKeys.push(index);
            fs.unkink(filesObject[index]['savePath'], function(err) {});
        }
    }
    for (var i in delKeys) {
        delete filesObject[delKeys[i]];
    }
    saveCardsObject();
    async.eachLimit(
        downloadObject,
        connectionNumber,
        (cardObject, next) => {
            downloadFilter(
                cardObject,
                next);

        },
        () => {
            saveCardsObject();
            console.log("Finished downloading");
            cb();
        }
    );
}

function makeDownloadPath(folder, file) {
    return 'https://raw.githubusercontent.com/' + user + '/' + repository + '/master/' + folder + '/' + file;
}

function updateCardObject(key) {
    filesObject[key]['downloaded'] = 1;
    noOfDownloads++;
    if (noOfDownloads % 300 == 0)
        saveCardsObject();
}

function finishedUpdatingCardObject(cb) {
    delete gitFilesObject;
    saveCardsObject();
    downloadItems(cb);
}


function redoDownloadPathRepo1(key) {
    if (path.extname(key) === '.cdb') {
        filesObject[key]['savePath'] = path.join(whereToFolder, 'cdb/' + path.basename(key));
        console.log(filesObject[key]['savePath'])
    }
    if (path.extname(key) === '.conf') {
        filesObject[key]['savePath'] = path.join(whereToFolder, 'config/' + path.basename(key));
        console.log(filesObject[key]['savePath'])
    }
}

function downloadFilter(cardObject, next) {

    if ('Live2017Links' === repository) {
        redoDownloadPathRepo1(cardObject.name);
    }
    mainWindow.webContents.send('info', [cardObject['savePath']]);
    download(
        cardObject['download_url'],
        cardObject['savePath'],
        cardObject.name,
        next
    );
}



function download(url, dest, key, next) {
    fs.ensureDir(path.dirname(dest), function() {
        const file = fs.createWriteStream(dest);
        customHeaderRequest.get(url).pipe(file).on('finish', function() {
            file.close();
            updateCardObject(key);
            next();
        }).on('error', function(e) {
            file.close();
            next();
        }).on('end', function() {
            file.close();
            next();
        })
    })

};

function saveCardsObject() {
    fs.writeFileSync(filesstorePath, JSON.stringify(filesObject), 'utf8');
}


let getUpdateObject = () => {
    let modifiedFiles = [];
    let filesObject;

    if (fs.existsSync(obj1.filesstorePath)) {
        filesObject = JSON.parse(fs.readFileSync(obj1.filesstorePath, 'utf8'));
        for (let index in filesObject) {
            if (filesObject[index]['modified'] == 1) {
                modifiedFiles.push(filesObject[index]['savePath'].replace(whereToFolder, ''));
                filesObject[index]['modified'] = 0;

                fs.writeFileSync(obj1.filesstorePath, JSON.stringify(filesObject), 'utf8');
            }
        }
    }
    if (fs.existsSync(obj2.filesstorePath)) {
        filesObject = JSON.parse(fs.readFileSync(obj2.filesstorePath, 'utf8'));
        for (let index in filesObject) {
            if (filesObject[index]['modified'] == 1) {
                modifiedFiles.push(filesObject[index]['savePath'].replace(whereToFolder, ''));
                filesObject[index]['modified'] = 0;

                fs.writeFileSync(obj2.filesstorePath, JSON.stringify(filesObject), 'utf8');
            }
        }
    }
    if (fs.existsSync(obj3.filesstorePath)) {
        filesObject = JSON.parse(fs.readFileSync(obj3.filesstorePath, 'utf8'));
        for (let index in filesObject) {
            if (filesObject[index]['modified'] == 1) {
                modifiedFiles.push(filesObject[index]['savePath'].replace(whereToFolder, ''));
                filesObject[index]['modified'] = 0;

                fs.writeFileSync(obj3.filesstorePath, JSON.stringify(filesObject), 'utf8');
            }
        }
    }
    if (fs.existsSync(obj4.filesstorePath)) {
        filesObject = JSON.parse(fs.readFileSync(obj4.filesstorePath, 'utf8'));
        for (let index in filesObject) {
            if (filesObject[index]['modified'] == 1) {
                modifiedFiles.push(filesObject[index]['savePath'].replace(whereToFolder, ''));
                filesObject[index]['modified'] = 0;

                fs.writeFileSync(obj4.filesstorePath, JSON.stringify(filesObject), 'utf8');
            }
        }
    }
    return modifiedFiles;
}