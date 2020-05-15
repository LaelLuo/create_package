#! /usr/bin/env node
const fs = require('fs'),
    args = process.argv.slice(2),
    json = args[0],
    path = args[1] ? args[1] : '.',
    debug = true,
    log = (argv) => {
        if (debug) { console.log(argv); } else { }
    },
    data = JSON.parse(fs.readFileSync(json).toString()),
    keys = Object.keys(data)

create(path + '/' + keys[0], data[keys[0]])

function create(name, data) {
    let keys = Object.keys(data)
    let isDir = name.endsWith('/')
    let fileName = isDir ? name.substring(0, name.length - 1) : name
    if (isDir) {
        if (fs.existsSync(fileName)) {
            log(`文件夹\t${fileName}\t已存在\n描述\t${data['description']}\n`)
            Object.keys(data['files']).forEach((value) => {
                create(name + value, data['files'][value])
            })
        } else {
            log(`创建文件夹\t${fileName}\n描述\t${data['description']}\n`)
            fs.mkdir(fileName, (error) => {
                if (!error) {
                    Object.keys(data['files']).forEach((value) => {
                        create(name + value, data['files'][value])
                    })
                } else {
                    log(error)
                }
            })
        }
    } else {
        if (fs.existsSync(fileName)) {
            log(`文件\t${fileName}\t已存在\n描述\t${data['description']}\n`)
        } else {
            log(`创建文件\t${fileName}\n描述\t${data['description']}\n`)
            if (typeof data['content'] == "string") {
                fs.writeFileSync(fileName, data['content'])
            } else {
                fs.writeFileSync(fileName, "")
            }
        }
    }
}