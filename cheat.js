const memoryjs = require('memoryjs');
const fs = require('fs');
const offsets = JSON.parse(fs.readFileSync('./offsets.json', 'utf8'));

const processData = {
    coreProcess: null,
    clientModule: null,
    engineModule: null,
}
//Define temp base processData for dll's
offsets.temp = {
    dwClientDllBaseAddress: null,
    dwEngineDllBaseAddress: null
};

const cheat = {
    isProcessRunning(processName) {
        let processObject = null;
        try {
            processObject = processData.coreProcess = memoryjs.openProcess(processName);
        } catch (e) {
            return false;
        }
        memoryjs.closeProcess(processObject.handle);
        return true;
    },
    setProcessData: (processName) => {
        try {
            //Set process data
            processData.coreProcess = memoryjs.openProcess(processName);
            processData.clientModule = memoryjs.findModule("client.dll", processData.coreProcess.th32ProcessID)
            processData.engineModule = memoryjs.findModule("engine.dll", processData.coreProcess.th32ProcessID)
            //Set offsets
            offsets.temp.dwEngineDllBaseAddress = processData.engineModule.modBaseAddr;
            offsets.temp.dwClientDllBaseAddress = processData.clientModule.modBaseAddr;
            console.log(`Found client.dll at: 0x${offsets.temp.dwClientDllBaseAddress.toString(16)} and engine.dll at: 0x${offsets.temp.dwEngineDllBaseAddress.toString(16)}`)
        } catch (e) {
            return false;
        }
        //We got process successfully
        return true;
    },
    async runCode() {
        //Iterate through each player
        for (let i = 1; i < 65; i++) {
            //Current user entity pointer
            const dwEntity = memoryjs.readMemory(processData.coreProcess.handle, offsets.temp.dwClientDllBaseAddress + offsets['signatures']['dwEntityList'] + (i - 1) * 0x10, "dword");
            //araaqtiuri, ar vici es ras nishnavs
            const Dormant = memoryjs.readMemory(processData.coreProcess.handle, dwEntity + offsets['signatures']['m_bDormant'], "bool");
            //Current user's health
            const health = memoryjs.readMemory(processData.coreProcess.handle, dwEntity + offsets['netvars']['m_iHealth'], 'int');
            //Current user's armour value
            const armour = memoryjs.readMemory(processData.coreProcess.handle, dwEntity + offsets['netvars']['m_ArmorValue'], 'int');
            //Is current user alive?
            const isAlive = memoryjs.readMemory(processData.coreProcess.handle, dwEntity + offsets['netvars']['m_lifeState'], 'int');
            //Pointer of my address
            const me = memoryjs.readMemory(processData.coreProcess.handle, offsets.temp.dwClientDllBaseAddress + offsets['signatures']['dwLocalPlayer'], "int");
            //Pointer of my team int number
            const myTeamNumber = memoryjs.readMemory(processData.coreProcess.handle, me + offsets['netvars']['m_iTeamNum'], "int");
            //Pointer of enemy team int number
            let EnemyTeamNumber = memoryjs.readMemory(processData.coreProcess.handle, dwEntity + offsets['netvars']['m_iTeamNum'], "int");
            const position = memoryjs.readMemory(processData.coreProcess.handle, dwEntity + offsets['netvars']['m_vecOrigin'], "vec3");
            const angle = memoryjs.readMemory(processData.coreProcess.handle, dwEntity + offsets['netvars']['dwClientState_ViewAngles'], "dword");
            //Pointer of angle X
            const angleX = memoryjs.readMemory(processData.coreProcess.handle, dwEntity + offsets['netvars']['m_angEyeAnglesX'], "float");
            //Pointer of angle Y
            const angleY = memoryjs.readMemory(processData.coreProcess.handle, dwEntity + offsets['netvars']['m_angEyeAnglesY'], "float");
            //In dwEntityList, one of 64 places is for us. We can also access this with dwLocalPlayer, just for information...
            if (dwEntity === me) {
                continue;
            }

            //Write spotted to current player. It means that we force engine to display player location, not depending
            //he/she is spotted or not. This makes players visible
            if (health > 0 && health <= 100)
                memoryjs.writeMemory(processData.coreProcess.handle, dwEntity + offsets['netvars']['m_bSpotted'], 1, "int");
        }
    }
}

module.exports = cheat;