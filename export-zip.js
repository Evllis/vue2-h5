/**
 * @author Quixn
 * @description
 * 快速导出压缩包 需要安装依赖 npm install archiver -D
 * 这个库的文档地址 https://github.com/archiverjs/node-archiver
 * 可以在 package.json 中配置 script 命令 npm run build 之后直接 进行 导出 zip 压缩包
 * @example  将需要导出的目录添加到target数组中 命令行执行 node export-zip.js 即可
 * @version 20220622
 */
const fs = require('fs')
const archiver = require('archiver')

const homedir = __dirname //这里是当前目录路径

const DateString = new Date().toLocaleDateString().replace(/\//g, '') // 日期充当hash值防止覆盖之前的压缩包
const hours = new Date().getHours()
const hoursString = hours < 10 ? `0${hours}` : hours
const minutes = new Date().getMinutes()
const minutesString = minutes < 10 ? `0${minutes}` : minutes
const fileName = `distServer(${process.env.NODE_ENV.trim()})_${DateString}${hoursString}${minutesString}.zip`

// 配置要打包的路径列表,需要打包某些目录，添加到数组里面即可 相对路径
const target = ['dist']

// 默认在当前目录路径生成此文件 fileName
const output = fs.createWriteStream(homedir + `/zip/${fileName}`)
const archive = archiver('zip', {
    zlib: { level: 9 } // 设置压缩级别
})

archive.on('error', function (err) {
    throw err
})

output.on('close', function () {
    console.log(`
     --------- ---------压缩完毕--------- ---------
     生成文件大小${(archive.pointer() / 1024 / 1024).toFixed(1)}MB
     请在当前项目路径下寻找 ${fileName} 文件,系统路径为 ${homedir}\\zip\\${fileName}
     ---------如需配置生成路径或文件名,请配置output---------
     `)
})

archive.pipe(output)
for (let i of target) {
    archive.directory(i, i)
}
archive.finalize()
