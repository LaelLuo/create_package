const { Processor } = require("./processor");
const path = require('path');

class DartProcessor extends Processor {
    /**
     *
     * @param {String} fileName
     * @param {String} data
     */
    canProcess(fileName, data) {
        return fileName.endsWith('.dart');
    }
    /**
     *
     * @param {String} fileName
     * @param {String} data
     */
    process(fileName, data) {
        const className = transformStr(path.parse(fileName).name);
        if (data === 'page' || data === 'widget') {
            return `
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class ${className} extends StatelessWidget {
    @override
    Widget build(BuildContext context) {
        return Container();
    }
}
                `;
        }
        else if (data == 'view_model' || data == 'data_model') {
            return `
import 'package:flutter/foundation.dart';

class ${className} with ChangeNotifier {

}
                `;
        }
        else {
            return `class ${className} {}`;
        }
    }
}

exports.DartProcessor = DartProcessor;

/**
 * 大驼峰
 * @param {String} string 
 */
function transformStr(string) {
    const regExp = /_(\w)/g;
    let result = string.replace(regExp, ($0, $1) => $1.toUpperCase());
    return result[0].toUpperCase() + result.substr(1)
}