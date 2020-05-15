#! /usr/bin/env node

const { DartProcessor } = require("./dart_processor")


const args = process.argv.slice(2)
if (args.length < 1 || !args[0].endsWith('.json')) throw "未找到json文件"
const json = args[0]
const filePath = args[1] || __dirname

const fs = require('fs')
const path = require('path')
const exists = fs.existsSync
const print = (argv) => {
    console.log(JSON.stringify(argv, null, '\t'))
}


const data = JSON.parse(fs.readFileSync(json).toString())
const processList = [new DartProcessor()]

deal(filePath, data)
// print(transformStr('home_view_model'))

function deal(key, node) {
    // print(`key: ${key}`)
    // print(`node: ${JSON.stringify(node, null, '\t')}`)
    if (node instanceof Array) {
        //文件夹不存在则创建
        if (!exists(key)) {
            fs.mkdirSync(key)
            print(`创建文件夹: ${key}`)
        }
        const ext = node[0]
        for (let index = 1; index < node.length; index++) {
            const type = node[index];
            const fileName = `${path.parse(key).base}_${type}.${ext}`;
            deal(path.join(key, fileName), type)
        }
        //如果data是Object的话 则说明是一个目录 属性则是目录下文件
    } else if (node instanceof Object) {
        //文件夹不存在则创建
        if (!exists(key)) fs.mkdirSync(key)
        //遍历子节点 继续处理
        Object.keys(node).forEach((childKey) => {
            deal(path.join(key, childKey), node[childKey])
        })
    } else {
        if (exists(key)) return
        print(`创建文件: ${key}`)
        processList.forEach((processor) => {
            if (processor.canProcess(key, node)) node = processor.process(key, node)
        })
        //写入已处理的数据
        fs.writeFileSync(key, node)
    }
}