#! /usr/bin/env node
const args = process.argv.slice(2)
if(args.length < 1 || !args[0].endsWith('.json')) throw "未找到json文件"
const json = args[0]
const filePath = args[1] || __dirname

const fs = require('fs')
const path = require('path')
const exists = fs.existsSync
const print = (argv) => {
    console.log(JSON.stringify(argv, null, '\t'))
}


class Processor {
    canProcess(fileName, data) {
        return false;
    }
    process(fileName, data) {
        return '';
    }
}

class DartProcessor extends Processor {
    /**
     * 
     * @param {String} fileName 
     * @param {String} data 
     */
    canProcess(fileName, data) {
        return fileName.endsWith('.dart')
    }
    /**
     * 
     * @param {String} fileName 
     * @param {String} data 
     */
    process(fileName, data) {
        const className = transformStr(path.parse(fileName).name)
        switch (data) {
            case 'page':
                return `
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class ${className} extends StatelessWidget {
    @override
    Widget build(BuildContext context) {
        return Container();
    }
}
                `
            case 'view_model':
                return `
import 'package:flutter/foundation.dart';

class ${className} with ChangeNotifier {

}
                `
            case 'data_model':
                return `
import 'package:flutter/foundation.dart';

class ${className} with ChangeNotifier {
    
}
                `
            case 'repository':
                return ``
            case 'source':
                return ``
            default:
                return `class ${className} {}`;
        }
    }
}

const data = JSON.parse(fs.readFileSync(json).toString())
const processList = [new DartProcessor()]

deal(filePath, data)
// print(transformStr('home_view_model'))

function deal(key, node) {
    print(`key: ${key}`)
    // print(`node: ${JSON.stringify(node, null, '\t')}`)
    if (node instanceof Array) {
        //文件夹不存在则创建
        if (!exists(key)) fs.mkdirSync(key)
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
        processList.forEach((processor) => {
            if (processor.canProcess(key, node)) node = processor.process(key, node)
        })
        //写入已处理的数据
        fs.writeFileSync(key, node)
    }
}

/**
 * 大驼峰
 * @param {String} string 
 */
function transformStr(string) {
    const regExp = /_(\w)/g;
    let result = string.replace(regExp, ($0, $1) => $1.toUpperCase());
    return result[0].toUpperCase() + result.substr(1)
}