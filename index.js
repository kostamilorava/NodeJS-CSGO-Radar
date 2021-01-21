const memoryjs = require('memoryjs');
const cheat = require('./cheat');

let processIsLoaded = false;
//Indicates if cheat code is currently running
let cheatRunning = false;

const processName = "csgo.exe";
//Runs cheat code itself
const mainLoop = setInterval(async () => {
    //Process is loaded, run code
    if (!cheatRunning && processIsLoaded) {
        cheatRunning = true;
        await cheat.runCode();
        cheatRunning = false;
    }

}, 10);

//Watches if process is open or not and makes sure to open process again after game exit
const processWatcher = setInterval(() => {
    if (!cheat.isProcessRunning(processName) && processIsLoaded === true) {
        processIsLoaded = false;
        console.log('CSGO process closed. Waiting for re-open...');
    }

    if (!processIsLoaded) {
        if (cheat.setProcessData(processName)) {
            processIsLoaded = true;
        }
    }
}, 200)

console.log('Waiting for CSGO process...');