const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')

const model_files = path.join(process.env.APPDATA,'.minecraft\\figura\\model_files')
if (!fs.existsSync(model_files)) {
    console.log('Unable to find figura model folder.')
    process.exit()
}

var watcher = chokidar.watch(model_files, {
    ignored:/(\.png|\.bbmodel|\.txt|\.zip)$/
})

watcher.on('all', (event, _path) => {
    const dirpath = path.dirname(_path)
    const avatar = dirpath.split(path.sep).pop()
    const filename = _path.split(path.sep).pop()
    if (dirpath != model_files && filename != 'script.lua' && filename.endsWith('.lua')) {
        fs.readdir(dirpath, (err, files) => {
            if (files == undefined) return
            console.log('----------+ ' + avatar + ' +----------')
            var lua = ""
            files.forEach(file => {
                if (file != 'script.lua' && file.endsWith('.lua')) {
                    lua += fs.readFileSync(path.join(dirpath,file)).toString() + '\n'
                    console.log('  + ' + avatar + path.sep + file)
                }
            });
            fs.writeFileSync(path.join(dirpath,'script.lua'), lua)
            console.log(' -> ' + avatar + path.sep + 'script.lua')
            let s = ''
            for (let i = 0; i < avatar.length+24; i++) {
                s += '-'
            }
            console.log(s+'\n')
        })
    }
})
