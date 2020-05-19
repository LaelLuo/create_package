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
        const smallHump = transformStr(path.parse(fileName).name);
        const bigHump = smallHump[0].toUpperCase() + smallHump.substr(1);
        if (data === 'page' || data === 'widget') {
            return `
import 'package:flutter/material.dart';
import 'package:aquakiss/src/utils/ui/screen_adapter.dart';

class ${bigHump} extends StatelessWidget {
    @override
    Widget build(BuildContext context) {
        return Scaffold();
    }
}
                `;
        }
        else if (data == 'view_model' || data == 'data_model') {
            return `
import 'package:flutter/foundation.dart';

class ${bigHump} with ChangeNotifier {

}
                `;
        }
        else {
            return `class ${bigHump} {}`;
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
    return result;
}