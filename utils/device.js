//开启严格模式
'use strict';

const os = require('os');

function deviceInfo() {
    if (!os) {
        return null;
    }

    const info = {
        platform: '',
        hostname: '',
        cpu: '',
        mac: '',
        ip:''
    };

//操作系统平台
    const pf = os.platform();

    switch (pf) {
        case 'darwin':
            info.platform = 'macOS'
            break;
        case 'win32':
            info.platform = 'Windows'
            break;
        default:
            break;
    }

    //主机名
    info.hostname = os.hostname();

    //cpu
    const cpus = os.cpus();
    if (cpus.length) {
        info.cpu = cpus[0].model;
    }
    const ipInfo = os.networkInterfaces()
    let addr = ''
    for (var key in ipInfo) { 
      if(key === 'en0'){
        addr = ipInfo[key]
      }
    } 

    addr.forEach(function (item) {
      if(item.family === 'IPv4'){
        info.ip = item.address
      }
    })
    //网卡
    const netmap = os.networkInterfaces();
    const conf = ['en0', 'WLAN', '以太网'];

    // console.log(netmap);

    for (let index = 0; index < conf.length; index++) {
        const key = conf[index];
        const item = netmap[key];
        if (item) {
            info.mac = item[0].mac
            // console.log('mac:'+ mac);
            break;
        }
    }

    return info;
}
//module.exports 暴露接口的方法
module.exports = {
    deviceInfo: deviceInfo
};