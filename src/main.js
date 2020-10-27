const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron')
const sqlite3 = require('sqlite3');
const os = require('os');
const fs = require('fs');
const requestify = require('requestify'); 
const { start } = require('repl');
const { Z_DEFAULT_STRATEGY } = require('zlib');
const { send } = require('process');

// config
const DB_CONFIG_PATH = os.homedir() + "/.iserverpro/";
const DB_CONFIG_NAME = "dbconfig.sqlite3"
if(!fs.existsSync(DB_CONFIG_PATH)){
  fs.mkdirSync(DB_CONFIG_PATH, {recursive : true});
}


function createWindow () {   
  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
  });
 
  win.setMenuBarVisibility(false);

  // 并且为你的应用加载index.html
  win.loadFile('./dist/index.html');
  win.webContents.openDevTools();

}

//  database
let db = new sqlite3.Database(DB_CONFIG_PATH + DB_CONFIG_NAME);
sqls = fs.readFileSync('./resource/init.sql', {encoding: 'utf-8'});
db.run(sqls);

ipcMain.on('db-process', (event,arg)=>{
   db.all(arg,(err,row)=>{
    event.sender.send('iserver-info', row)
})
})

ipcMain.on('db-delete', (event,arg)=>{
  const sql = "Delete From iserverinfo  where url = '"+arg+"'"
  db.all(sql,(err,row)=>{
   console.log(row)
})
})

ipcMain.on('addiserverInfo', (event,arg)=>{
  const sql = "INSERT INTO iserverinfo (url,username,password) VALUES ('"+arg.url+"','"+arg.username+"','"+arg.password+"')"
  db.all(sql,(err,row)=>{
    event.sender.send('return-iserver-info', arg)
});
})

app.whenReady().then(createWindow);





